#!/usr/bin/env bash
PROG_CODE=${1?"Missing programe code such as 287 or 2025 ..."}
./newpodcastsSinceLastUpdate.sh $PROG_CODE
case $? in
0)
    ./getPodcast.js $PROG_CODE 
    mv $PROG_CODE.json $HOME/raylexlee.github.io/myrthk/
    cd $HOME/raylexlee.github.io/myrthk/
    ;;
1)
    echo "No new episodes yet!"
    ;;
2)
    echo "No such programe id $PROG_CODE"
    ;;
*)
    echo "failed with unknow status."
    ;;
esac
