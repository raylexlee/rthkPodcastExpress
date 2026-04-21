def process_programme(search_term, position):
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)

    driver.get("https://www.rthk.hk/archive")
    WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "s1")))
    search_box = driver.find_element(By.ID, "s1")

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

    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div#archGrid div.block.clearfix a"))
    )

    safe_title = sanitize_filename(search_term)  # or capture suggestion text if needed
    generate_playlist(driver, safe_title)

    driver.quit()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 autocomplete_rthk_gen.py <search_term> <position>")
        sys.exit(1)
    process_programme(sys.argv[1], int(sys.argv[2]))

