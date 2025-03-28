#!/usr/bin/env bash
PROG_CODE=287
./new287podcastsSinceLastUpdate.sh
case $? in
0)
    git add $PROG_CODE.txt
    git commit -m "Update new podcasts."
    git push origin master
    ./getPodcast.js $PROG_CODE 
    mv $PROG_CODE.json $HOME/raylexlee.github.io/myrthk/
    cd $HOME/raylexlee.github.io/myrthk/
    git add $PROG_CODE.json
    git commit -m "Update programme"
    git push origin master
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
