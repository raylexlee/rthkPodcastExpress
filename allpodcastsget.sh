#!/usr/bin/env bash
PID=${1?'missing pid eg 287,336'}
YEARS_URL='https://podcast.rthk.hk/podcast/item.php?pid='"$PID"
for YEAR in $(curl -s $YEARS_URL | grep 'option value=' | sed 's#.*\([0-9]\{4\}\).*#\1#')
do
    PAGE=1
    REMAINDER=99
    while [ "$REMAINDER" != "0" ]
    do
        EPISODES_URL='https://podcast.rthk.hk/podcast/episodeList.php?pid='"$PID"'&year='"$YEAR"'&page='"$PAGE"
        curl -s -o temp.xml $EPISODES_URL
        REMAINDER=$(xmlstarlet sel -t -v '/episodeList/remainder' temp.xml)
        DATES=($(xmlstarlet sel -t -v '//episodeDate' temp.xml))
        TITLE_CAPTIONS=($(xmlstarlet sel -t -v '//episodeTitle' temp.xml | sed 's/ /_/g'))
        MEDIAFILES=($(xmlstarlet sel -t -v '//mediafile' temp.xml))
        LAST=$(expr ${#DATES[@]} - 1)
        for i in $(seq 0 $LAST)
        do
            echo ${DATES[$i]} ${TITLE_CAPTIONS[$i]} ${MEDIAFILES[$i]}
        done
        PAGE=$(expr $PAGE + 1)
    done
done
