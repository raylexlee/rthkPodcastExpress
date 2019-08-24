## Background
[Radio Television Hong Kong (RTHK; Chinese: 香港電台)](https://en.wikipedia.org/
wiki/RTHK) presents its podcasts at http://podcast.rthk.hk/podcast/ which underwent a version change around April 2019. It employed a lot of ajax features to enhance the user experience. But the sequence of episodes STILL runs from the newest to oldest order. Thus it is incapable to provide auto-play feature.
## Findings
``` bash
curl https://podcast.rthk.hk/podcast/programmeList.php?type=audio\&page=1\&order=stroke\&lang=zh-CN
```
``` xml
<?xml version="1.0" encoding="utf-8"?>
<programmeList>
	<total>209</total>
	<remainder>197</remainder>
	<page>1</page>
	<count>12</count>
	<programmePerPage>12</programmePerPage>
		
  <programme>
    <title><![CDATA[2016立法會選舉論壇]]></title>
    <link><![CDATA[item.php?pid=1099]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_1099.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[2016立法會選舉論壇(功能組別)]]></title>
    <link><![CDATA[item.php?pid=1090]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_1090.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[2017行政長官選舉特輯]]></title>
    <link><![CDATA[item.php?pid=1207]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_1207.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[Cultural Express 文化快訊]]></title>
    <link><![CDATA[item.php?pid=433]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_433.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[Do Re Mischa]]></title>
    <link><![CDATA[item.php?pid=1059]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_1059.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[English Everywhere]]></title>
    <link><![CDATA[item.php?pid=151]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_151.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[English in NEWS]]></title>
    <link><![CDATA[item.php?pid=467]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_467.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[French Moment]]></title>
    <link><![CDATA[item.php?pid=1239]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_1239.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[Gifted 非凡響]]></title>
    <link><![CDATA[item.php?pid=111]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_111.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[Hong Kong Welcomes You - Audio Flash]]></title>
    <link><![CDATA[item.php?pid=210]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_210.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[Language Academy]]></title>
    <link><![CDATA[item.php?pid=1581]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_1581.jpg]]></cover>
    <format>audio</format>
  </programme>
	
  <programme>
    <title><![CDATA[Ole Ole Spain]]></title>
    <link><![CDATA[item.php?pid=127]]></link>
    <cover><![CDATA[upload_photo/item_photo/170x170_127.jpg]]></cover>
    <format>audio</format>
  </programme>

</programmeList>
```
``` bash
curl https://podcast.rthk.hk/podcast/episodeList.php?pid=287\&year=2018\&page=1
```
``` xml
<?xml version="1.0" encoding="utf-8"?>
<episodeList>
	<total>52</total>
	<remainder>40</remainder>
	<page>1</page>
	<count>12</count>
	<episodePerPage>12</episodePerPage>
<episode>
	<pid>287</pid>
	<eid>127835</eid>
	<episodeTitle><![CDATA[司馬懿 (十二)︰司馬炎篡魏]]></episodeTitle>
	<episodeDate>2018-12-29</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:37</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1812281949_64144.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>127476</eid>
	<episodeTitle><![CDATA[司馬懿 (十一)︰淮南三叛]]></episodeTitle>
	<episodeDate>2018-12-22</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:24:57</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1812212106_39115.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>127027</eid>
	<episodeTitle><![CDATA[司馬懿 (十)︰高平陵之變]]></episodeTitle>
	<episodeDate>2018-12-15</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:38</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1812141906_83278.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>126574</eid>
	<episodeTitle><![CDATA[司馬懿 (九)︰內鬥曹爽]]></episodeTitle>
	<episodeDate>2018-12-08</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:45</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1812101027_35385.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>125380</eid>
	<episodeTitle><![CDATA[司馬懿 (八)︰智鬥諸葛亮]]></episodeTitle>
	<episodeDate>2018-12-01</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:23</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1811201640_71731.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>125379</eid>
	<episodeTitle><![CDATA[司馬懿 (七)︰坐鎮宛城]]></episodeTitle>
	<episodeDate>2018-11-24</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:21</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1811201640_93938.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>124912</eid>
	<episodeTitle><![CDATA[司馬懿 (六)︰曹丕篡漢]]></episodeTitle>
	<episodeDate>2018-11-17</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:21</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1811131742_43194.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>124425</eid>
	<episodeTitle><![CDATA[司馬懿 (五)︰曹操病逝]]></episodeTitle>
	<episodeDate>2018-11-10</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:37</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1811061144_14846.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>123774</eid>
	<episodeTitle><![CDATA[司馬懿 (四)︰出仕曹操]]></episodeTitle>
	<episodeDate>2018-11-03</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:34</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1810251731_63836.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>123624</eid>
	<episodeTitle><![CDATA[司馬懿 (三)︰東漢末年]]></episodeTitle>
	<episodeDate>2018-10-27</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:36</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1810231705_25836.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>123291</eid>
	<episodeTitle><![CDATA[司馬懿 (二)︰河內豪族]]></episodeTitle>
	<episodeDate>2018-10-20</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:32</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1810181751_90621.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>122893</eid>
	<episodeTitle><![CDATA[司馬懿 (一)︰權謀祖師]]></episodeTitle>
	<episodeDate>2018-10-13</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:42</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1810121814_25423.mp3]]></mediafile>
	<format>audio</format>
</episode>

</episodeList>
raylex@fk:~/grabRTHKpodcasts$ curl https://podcast.rthk.hk/podcast/episodeList.php?pid=287\&year=2018\&page=4
<?xml version="1.0" encoding="utf-8"?>
<episodeList>
	<total>52</total>
	<remainder>4</remainder>
	<page>4</page>
	<count>12</count>
	<episodePerPage>12</episodePerPage>
<episode>
	<pid>287</pid>
	<eid>112044</eid>
	<episodeTitle><![CDATA[喬治華盛頓 (六)︰第一屆大陸會議]]></episodeTitle>
	<episodeDate>2018-04-21</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:03</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1804161638_67736.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>111833</eid>
	<episodeTitle><![CDATA[喬治華盛頓 (五)︰波士頓茶黨事件]]></episodeTitle>
	<episodeDate>2018-04-14</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:24:05</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1804131434_43514.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>111455</eid>
	<episodeTitle><![CDATA[喬治華盛頓 (四)︰十三殖民地反英運動	]]></episodeTitle>
	<episodeDate>2018-04-07</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:24:13</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1804061848_76079.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>110779</eid>
	<episodeTitle><![CDATA[喬治華盛頓 (三)︰英法七年戰爭]]></episodeTitle>
	<episodeDate>2018-03-31</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:05</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1803292039_10611.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>110249</eid>
	<episodeTitle><![CDATA[喬治華盛頓 (二)︰北美殖民地]]></episodeTitle>
	<episodeDate>2018-03-24</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:55</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1803231816_17982.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>109852</eid>
	<episodeTitle><![CDATA[喬治華盛頓 (一)︰英國內戰]]></episodeTitle>
	<episodeDate>2018-03-17</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:58</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1803151553_60083.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>109174</eid>
	<episodeTitle><![CDATA[萬曆帝 (十二)︰萬曆以後]]></episodeTitle>
	<episodeDate>2018-03-10</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:07</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1803051932_40474.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>108736</eid>
	<episodeTitle><![CDATA[萬曆帝 (十一)︰薩爾滸之役]]></episodeTitle>
	<episodeDate>2018-03-03</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:24:25</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1802261708_29846.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>108270</eid>
	<episodeTitle><![CDATA[萬曆帝 (十)︰梃擊案]]></episodeTitle>
	<episodeDate>2018-02-24</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:26</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1802151447_19755.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>108007</eid>
	<episodeTitle><![CDATA[萬曆帝 (九)︰國本之爭]]></episodeTitle>
	<episodeDate>2018-02-17</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:14</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1802131753_84837.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>108006</eid>
	<episodeTitle><![CDATA[萬曆帝 (八)︰楊應龍之亂]]></episodeTitle>
	<episodeDate>2018-02-10</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:25:30</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1802131753_25792.mp3]]></mediafile>
	<format>audio</format>
</episode>
<episode>
	<pid>287</pid>
	<eid>106979</eid>
	<episodeTitle><![CDATA[萬曆帝 (七)︰三大征之禦倭援朝]]></episodeTitle>
	<episodeDate>2018-02-03</episodeDate>
	<cover><![CDATA[https://podcast.rthk.hk/podcast/upload_photo/item_photo/16x9_275x155_287.jpg]]></cover>
	<duration>00:24:43</duration>
	<mediafile><![CDATA[https://app3.rthk.hk/podcast/media/people/287_1801261644_93075.mp3]]></mediafile>
	<format>audio</format>
</episode>

</episodeList>
```
``` bash
curl https://podcast.rthk.hk/podcast/item.php?pid=287\&lang=zh-CN | grep "option value="
```
``` html
						<option value="2019" >2019</option>
						<option value="2018" >2018</option>
						<option value="2017" >2017</option>
						<option value="2016" >2016</option>
						<option value="2015" >2015</option>
						<option value="2014" >2014</option>
						<option value="2013" >2013</option>
						<option value="2012" >2012</option>
						<option value="2011" >2011</option>
```