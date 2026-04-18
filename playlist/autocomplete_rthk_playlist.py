import sys 
import re, time
import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def sanitize_filename(name: str) -> str:
    name = "".join(name.split())
    name = re.sub(r'[^\w\u4e00-\u9fff-]', '', name)

    return name

def search_programme(driver, progName):
    archGrid = driver.find_element(By.ID, "archGrid")

    # Scroll until all episodes are loaded
    last_count = 0
    while True:
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", archGrid)
        time.sleep(2)
        blocks = driver.find_elements(By.CSS_SELECTOR, "div#archGrid div.block.clearfix")
        if len(blocks) == last_count:
            break
        last_count = len(blocks)

    # Collect episode anchors
    anchors = driver.find_elements(By.CSS_SELECTOR, "div#archGrid div.block.clearfix a")
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

    safeName = progName
    filename = f"{safeName}.m3u8"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(m3u)
    print(f"Saved {filename}")

def fetch_suggestions_generate_playlist(search_term):
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    driver.get("https://www.rthk.hk/archive")
    time.sleep(2)

    # Type into the search box
    search_box = driver.find_element(By.ID, "s1")
    search_box.clear()
    search_box.send_keys(search_term)

    time.sleep(2)  # wait for autocomplete suggestions to appear

    # Grab all suggestion items
    suggestions = driver.find_elements(By.CSS_SELECTOR, "ul.ui-autocomplete li")

    # Save to a file named after the search term
    filename = f"{search_term}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        for s in suggestions:
            name = s.text.strip()
            if name:
                f.write(search_term + " " + sanitize_filename(name) + "\n")
    print("Saved " + filename)

    count = len(suggestions)

    for i in range(count):
        # Re-enter search_term each time
        search_box = driver.find_element(By.ID, "s1")
        search_box.clear()
        search_box.send_keys(search_term)
        time.sleep(1)

        # Grab fresh suggestions list
        suggestions = driver.find_elements(By.CSS_SELECTOR, "ul.ui-autocomplete li")

        # Capture the title BEFORE hitting RETURN
        title = suggestions[i].text.strip()
        safe_title = sanitize_filename(title)
        print(f"Processing {safe_title}")

        # Navigate down i times
        for _ in range(i+1):
            search_box.send_keys(Keys.DOWN)
            time.sleep(0.2)

        # Hit RETURN to select
        search_box.send_keys(Keys.RETURN)
        # Wait until at least one episode anchor appears inside archGrid
        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.ID, "archGrid"))
            )
        except TimeoutException:
            print(f"Timeout waiting for results of {safe_title}, skipping.")
            continue

        # Now scrape episodes from the updated DOM
        generate_playlist(driver, safe_title)

    # Quit once after all suggestions
    driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 autocomplete_rthk_playlist.py <search term>")
        sys.exit(1)

    search_term = sys.argv[1]
    fetch_suggestions_generate_playlist(search_term)

