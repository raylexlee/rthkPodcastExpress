#!/usr/bin/env bash
PERIOD=${1?'missing period'}
LINK=${2?'missing link of period'}
TXT=text/$PERIOD.txt
JSON=text/$PERIOD.json
curl -q -o temp.html $LINK
cat temp.html  | pup 'meta[name="description"] attr{content}' > $TXT
cat temp.html  | pup ':parent-of([class="event-head"])' | sed 's/td\>/div/' > divs.html
 ./makeJson.js divs.html > $JSON
