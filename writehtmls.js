const fs = require('fs');
const Pid = '287';

const Programme = require('./lib/getProgramme.js')(Pid);

const caption = page => page.podcasts.map(podcast => podcast.caption).join('\n');
const url = page => page.podcasts.map((podcast, index) => `<div><a href="${podcast.url}">${index + 1}</a></div>`).join('\n');
const html = page => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="${page.title}">
<title>${page.title}</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<audio id="audio" preload="auto" tabindex="0" controls="" type="audio/mpeg">
<source type="audio/mp3" src="">
Sorry, your browser does not support HTML5 audio.
</audio>
<div id="playlist">
	
${url(page)}
</div>
<pre>
${page.title}
${page.broadcast_date}
	
${caption(page)}
</pre>
<a href="index.html">回到目錄</a>
<script type="text/javascript">
var podcast = {
	episodes: ${page.episodes}
}
</script>
<script type='text/javascript' src="podcastapp.js"></script>
</body>
</html>`;

Programme.pages.forEach(page => {
  fs.writeFileSync(`${page.title}.html`, html(page))  
  });
