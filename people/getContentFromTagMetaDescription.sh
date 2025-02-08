#!/usr/bin/env bash
EID=${1?'missing episode id eg 24153'}
PID=287
EPISODES_URL='https://podcast.rthk.hk/podcast/item.php?pid='"$PID"'&eid='"$EID"
curl -s -o temp.html $EPISODES_URL
dos2unix -q temp.html
cat temp.html | pup 'meta[name="description"] attr{content}' | sed 's/\&[amp;]*\#[0-9]*;//g'
rm temp.html
