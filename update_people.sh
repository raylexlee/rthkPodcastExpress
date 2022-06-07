#!/bin/bash
rm 287*
./getpodcast.js 287 
node writehtmls.js 
node writeindexpage.js 
node write_curl_audio_sh.js 
