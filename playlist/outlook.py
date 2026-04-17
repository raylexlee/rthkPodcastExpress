import requests
import re
import json

# Step 1: Fetch the archive page
url = "https://www.rthk.hk/archive"
html = requests.get(url).text

# Step 2: Extract the JSON structure (example: if embedded in JS)
# This regex is just illustrative — adjust based on actual structure you find
match = re.search(r'var programmes = (

\[.*?\]

);', html, re.S)
if match:
    programmes_json = match.group(1)
    programmes = json.loads(programmes_json)
    print("Total programmes:", len(programmes))
    # Example: print first few
    for p in programmes[:10]:
        print(p)
else:
    print("Programme dataset not found in page source")

