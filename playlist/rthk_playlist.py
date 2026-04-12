from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time, requests
from bs4 import BeautifulSoup

def search_programme(driver, progName):
    driver.get("https://www.rthk.hk/archive")
    time.sleep(2)

    # Find the search box and type programme name
    search_box = driver.find_element(By.ID, "s1")
    search_box.clear()
    search_box.send_keys(progName)

    # Click the search button instead of pressing Enter
    search_button = driver.find_element(By.ID, "search1btn")
    search_button.click()

    time.sleep(3)  # wait for results

    # Scroll until all episodes are loaded
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Collect episode anchors
    anchors = driver.find_elements(By.CSS_SELECTOR, f'a[title="{progName}"]')
    episodes = []
    for a in anchors:
        href = a.get_attribute("href")
        fullUrl = href if href.startswith("http") else "https://www.rthk.hk" + href
        date_text = a.text[:10]
        d = date_text.split('/')
        if len(d) == 3:
            yyyymmdd = d[2] + d[1] + d[0]
            episodes.append({"date": yyyymmdd, "url": fullUrl})
    episodes.sort(key=lambda e: e["date"])
    return episodes

def get_episode_meta(ep):
    res = requests.get(ep["url"])
    html = res.text
    doc = BeautifulSoup(html, "html.parser")

    # Safe title extraction
    title_tag = doc.find("title")
    if title_tag and title_tag.string:
        parts = title_tag.string.split("|")
        episodeTitle = parts[-1].strip()
    else:
        episodeTitle = f"Episode {ep['date']}"

    # Collect all master.m3u8 links
    fileMatches = [m for m in html.split('"') if "master.m3u8" in m]
    m3u8Link = sorted(fileMatches)[0] if fileMatches else None

    return {"date": ep["date"], "episodeTitle": episodeTitle, "m3u8Link": m3u8Link}

def generate_playlist(driver, progName):
    episodes = search_programme(driver, progName)
    seen = set()
    m3u = "#EXTM3U\n"
    for ep in episodes:
        meta = get_episode_meta(ep)
        if meta["m3u8Link"] and meta["date"] not in seen:
            seen.add(meta["date"])
            m3u += f'#EXTINF:0, {progName} — {meta["episodeTitle"]} [{meta["date"]}]\n{meta["m3u8Link"]}\n'
    with open(f"{progName}.m3u8", "w", encoding="utf-8") as f:
        f.write(m3u)
    print(f"Saved {progName}.m3u8")

# --- Main run ---
options = Options()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)

programmes = ["古今風雲人物", "長安的荔枝"]
for prog in programmes:
    generate_playlist(driver, prog)

driver.quit()

