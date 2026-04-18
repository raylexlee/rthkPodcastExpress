import re, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

def sanitize_filename(name: str) -> str:
    name = "".join(name.split())
    name = re.sub(r'[^A-Za-z0-9\u4e00-\u9fff_-]', '', name)
    return name

options = webdriver.ChromeOptions()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)

driver.get("https://www.rthk.hk/archive")

keyword = "31看世界"
search_box = driver.find_element(By.ID, "s1")
search_box.send_keys(keyword)
time.sleep(2)

suggestions = driver.find_elements(By.CSS_SELECTOR, "ul.ui-autocomplete li")
count = len(suggestions)

for i in range(count):
    # Re-enter keyword each time
    search_box.clear()
    search_box.send_keys(keyword)
    time.sleep(1)

    # Navigate down i times
    for _ in range(i+1):
        search_box.send_keys(Keys.DOWN)
        time.sleep(0.2)

    # Hit RETURN to select
    search_box.send_keys(Keys.RETURN)
    time.sleep(3)  # wait for results to load

    # Scrape programme title from suggestion text
    title = suggestions[i].text.strip()
    safe_title = sanitize_filename(title)
    print(f"Processing {safe_title}")

    # Now scrape episodes from the updated DOM
    episodes = driver.find_elements(By.CSS_SELECTOR, ".episode-list a")  # adjust selector
    for ep in episodes:
        ep_title = ep.text
        ep_url = ep.get_attribute("href")
        print(f"  {ep_title} → {ep_url}")
        # integrate with rthk_playlist.py here

driver.quit()

