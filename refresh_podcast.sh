#!/usr/bin/env bash
PROG_CODE=${1?"Missing programe code such as 287 or 2025 ..."}
rm $PROG_CODE*
./getpodcast.js $PROG_CODE 
mv $PROG_CODE.json $HOME/raylexlee.github.io/myrthk/
