from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time

options = Options()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)

driver.get("https://www.rthk.hk/archive")
time.sleep(2)

# Type into the search box
search_box = driver.find_element(By.ID, "s1")
search_box.clear()
search_box.send_keys("香港故事")

time.sleep(2)  # wait for autocomplete suggestions to appear

# Grab all suggestion items
suggestions = driver.find_elements(By.CSS_SELECTOR, "ul.ui-autocomplete li")

# Save to a text file
with open("programmes.txt", "w", encoding="utf-8") as f:
    for s in suggestions:
        name = s.text.strip()
        if name:
            f.write(name + "\n")
            print(name)

driver.quit()

