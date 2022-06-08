#!/usr/bin/env bash
PROG_CODE=${1?"Missing programe code such as 287 or 2025 ..."}
rm $PROG_CODE*
./getpodcast.js $PROG_CODE 
./writehtmls.js $PROG_CODE 
./writeindexpage.js $PROG_CODE   
./write_curl_audio_sh.js $PROG_CODE  
