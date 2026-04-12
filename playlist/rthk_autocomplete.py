import sys
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def fetch_suggestions(search_term):
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
                f.write(name + "\n")
                print(name)

    driver.quit()
    print(f"Saved {len(suggestions)} suggestions to {filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 rthk_autocomplete.py <search term>")
        sys.exit(1)

    search_term = sys.argv[1]
    fetch_suggestions(search_term)

