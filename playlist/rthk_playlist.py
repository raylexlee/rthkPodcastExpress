import sys
import time
import requests
import re
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

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
        time.sleep(4)
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

    # Extract unique episode code
    episodeCode = None
    if m3u8Link:
        match = re.search(r'(\d+)(?:\.m4a|\.smil)/master\.m3u8', m3u8Link)
        if match:
            episodeCode = match.group(1)

    return {
        "date": ep["date"],
        "episodeTitle": episodeTitle,
        "m3u8Link": m3u8Link,
        "episodeCode": episodeCode
    }

def generate_playlist(driver, progName):
    episodes = search_programme(driver, progName)
    metas = []
    seen = set()

    for ep in episodes:
        meta = get_episode_meta(ep)
        key = meta["episodeCode"]
        if meta["m3u8Link"] and key and key not in seen:
            seen.add(key)
            metas.append(meta)

    # Sort by episodeCode numerically
    metas.sort(key=lambda m: int(m["episodeCode"]))

    m3u = "#EXTM3U\n"
    for meta in metas:
        m3u += f'#EXTINF:0, {progName} — {meta["episodeTitle"]} [{meta["date"]}]\n{meta["m3u8Link"]}\n'

    safeName = progName.replace(" ", "")
    filename = f"{safeName}.m3u8"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(m3u)
    print(f"Saved {filename}")

# --- Main run ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 rthk_playlist.py <programme name>")
        sys.exit(1)

    progName = sys.argv[1]

    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    generate_playlist(driver, progName)

    driver.quit()

