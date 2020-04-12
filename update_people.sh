#!/bin/bash
rm 287*
node getpodcast.js 
node writehtmls.js 
node writeindexpage.js 
node write_curl_audio_sh.js 
