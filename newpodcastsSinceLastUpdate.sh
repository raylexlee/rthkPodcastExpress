#!/usr/bin/env bash
PID=${1?'missing pid eg 287,336'}
OLD_PODCASTS="$PID".txt
NEW_PODCASTS="$PID".new.txt
cp /dev/null $NEW_PODCASTS
[ -f $OLD_PODCASTS ] && OUTPUT=$NEW_PODCASTS || OUTPUT=$OLD_PODCASTS
[ -f $OLD_PODCASTS ] && LAST_DATE=$(head -1 $OLD_PODCASTS | awk '{print $1;}') || LAST_DATE='RaylexLee'
echo $LAST_DATE
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
            [ "${DATES[$i]}" = "$LAST_DATE" ] && break 3;
            echo ${DATES[$i]} ${TITLE_CAPTIONS[$i]} ${MEDIAFILES[$i]}>> $OUTPUT
        done
        PAGE=$(expr $PAGE + 1)
    done
done
if [ -s $NEW_PODCASTS ]
then
    cat $OLD_PODCASTS >> $NEW_PODCASTS
    mv $NEW_PODCASTS $OLD_PODCASTS
##### new episodes for existing programme
    exit 0
fi
rm $NEW_PODCASTS
if [ -f $OLD_PODCASTS ]
then
    if [ "$LAST_DATE" = "RaylexLee" ] 
    then
##### first compiling existing programme
        exit 0
    fi
##### no updates for existing programme
    exit 1
fi
##### no such programme id
exit 2
