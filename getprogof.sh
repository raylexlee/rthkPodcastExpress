#!/usr/bin/env bash
REMAINDER=99
PAGE=1
while [ "$REMAINDER" != "0" ]
do
  LIST_URL='https://podcast.rthk.hk/podcast/programmeList.php?type=all&page='"$PAGE"'&order=stroke&lang=zh-CN'
  curl -s -o temp.xml $LIST_URL
  PAGE=$(expr $PAGE + 1)
  REMAINDER=$(xmlstarlet sel -t -v '/programmeList/remainder' temp.xml)
  PIDS=($(xmlstarlet sel -t -v '//link' temp.xml | sed 's/.*=\(.*\)/\1/'))
  TITLES=($(xmlstarlet sel -t -v '//title' temp.xml | sed 's/ /_/g'))
  LAST=$(expr ${#PIDS[@]} - 1)
  for I in $(seq 0 $LAST)
  do
    echo ${PIDS[$I]} ${TITLES[$I]}
  done
done
