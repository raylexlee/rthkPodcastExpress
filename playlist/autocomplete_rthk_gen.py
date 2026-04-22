import sys, time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def process_programme(search_term, position, safe_filename, js_path="genRTHKm3u8.js"):
    options = Options()
    options.add_argument("--headless")
    # remove headless by commenting out if you want to see the download UI
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

    # Scroll to load all episodes (bounce scroll)
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(4)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Inject JS to generate playlist
    with open(js_path, "r", encoding="utf-8") as f:
        js_code = f.read()
    target_file = os.path.expanduser(f"~/Downloads/{safe_filename}.m3u8")
    if os.path.exists(target_file):
        os.remove(target_file)
    driver.execute_script(js_code)

    # Periodic check for file presence
    timeout = 30  # seconds
    waited = 0
    while waited < timeout:
        if os.path.exists(target_file):
            print(f"Confirmed {target_file} created.")
            # Append to success.log
            with open("success.log", "a", encoding="utf-8") as f:
                f.write(sys.argv[1] + " " + sys.argv[3] + "\n")
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

