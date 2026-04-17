progName="31看世界"
# Step 1: Autocomplete
progId=$(curl -s "https://www.rthk.hk/api/autocomplete?term=$progName" | jq -r '.[0].id')

# Step 2: Archive URL
archiveUrl="https://www.rthk.hk/archive/index.php?progId=$progId"
echo "Archive URL: $archiveUrl"

# Step 3: List RTHK files from Open Data
curl -s "https://app.data.gov.hk/v1/historical-archive/list-files?provider=RTHK" | jq .

