#!/bin/bash
search_term="香港故事"
while read line; do
    term=$(echo "$line" | awk '{print $1}')
    pos=$(echo "$line" | awk '{print $2}')
    prog=$(echo "$line" | awk '{print $3}')
    echo "Processing $prog at position $pos"
    python3 autocomplete_rthk_gen.py "$term" "$pos"
done < "${search_term}.txt"

