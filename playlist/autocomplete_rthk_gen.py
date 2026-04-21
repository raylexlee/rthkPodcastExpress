import sys, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def process_programme(search_term, position, safe_filename, js_path="genM3uRTHKaod.js"):
    options = Options()
    # remove headless if you want to see the download UI
    driver = webdriver.Chrome(options=options)

    driver.get("https://www.rthk.hk/archive")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "s1")))
    search_box = driver.find_element(By.ID, "s1")

    # Enter keyword and wait for suggestions
    search_box.clear()
    search_box.send_keys(search_term)
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "ul.ui-autocomplete li"))
    )

    # Navigate down 'position' times
    for _ in range(position+1):
        search_box.send_keys(Keys.DOWN)
        time.sleep(0.2)
    search_box.send_keys(Keys.RETURN)

    # Wait for results container
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div#archGrid div.block.clearfix a"))
    )

    # Scroll to load all episodes
    archGrid = driver.find_element(By.ID, "archGrid")
    last_count = 0
    while True:
        driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", archGrid)
        time.sleep(2)
        blocks = driver.find_elements(By.CSS_SELECTOR, "div#archGrid div.block.clearfix")
        if len(blocks) == last_count:
            break
        last_count = len(blocks)

    # Inject JS to generate playlist
    with open(js_path, "r", encoding="utf-8") as f:
        js_code = f.read()
    driver.execute_script(js_code)

    # Periodic check for file presence
    target_file = f"{safe_filename}.m3u8"
    timeout = 30  # seconds
    waited = 0
    while waited < timeout:
        if os.path.exists(target_file):
            print(f"Confirmed {target_file} created.")
            break
        time.sleep(2)
        waited += 2
    else:
        print(f"Warning: {target_file} not detected after {timeout} seconds.")

    driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 autocomplete_rthk_gen.py <search_term> <position> <safe_filename>")
        sys.exit(1)
    process_programme(sys.argv[1], int(sys.argv[2]), sys.argv[3])

