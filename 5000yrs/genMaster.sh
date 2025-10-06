#!/usr/bin/env bash
PERIOD=${1?'missing period'}
LINK=${2?'missing link of period'}
TXT=master/$PERIOD.txt
curl -q -o temp.html $LINK
cat temp.html | pup 'a[class="listen-button"] json{}' > array.json
./genFromJson.js | sort -u > $TXT
