const fs = require('fs');
const Pid = '287';

const Programme = require('./lib/getProgramme.js')(Pid);

const li_podcasts = podcasts => podcasts
.map(podcast => `			   <li><a href="${podcast.title}.html">${podcast.title} (${podcast.episodes})</a></li>`).join('\n');
const li_years = years => years.map(year => `          <li>
		  <a href="#" class="current">${year.name}</a>
                   <ul class="nav-dropdown">
${li_podcasts(year.podcasts)}
                   </ul>
          </li>`).join('\n');
const now = require('./lib/gethknowtime.js')();
const indexpage = (programme, pid) => `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" > 
    <title>${programme.name}</title> 
    <meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="${programme.name}">
<link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="manifest" href="site.webmanifest">
<link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">
    
    <!--///////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //		Styles
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////--> 
    

    <!-- Custom styles for this template -->
    <link rel='stylesheet' id='camera-css'  href='camera.css' type='text/css' media='all'> 
    <link rel='stylesheet' id='nav-css'  href='navbar/nav.css' type='text/css' media='all'> 

    <link href="carousel.css" rel="stylesheet">

  </head>
  <body>
	<div class="fluid_container">
<section class="navigation">
  <div class="nav-container">
    <div class="brand">
	    <img src="170x170_${pid}.jpg" width="auto" height="70" />
	  <div class="subtitle">${programme.name}<br />手機優化版</div>
    </div>
    <nav>
      <div class="nav-mobile">
        <a id="nav-toggle" href="#!"><span></span></a>
      </div>
      <ul class="nav-list">
${li_years(programme.years)}
      </ul>
    </nav>
  </div>
</section>
<section>
  <p>${now}</p>
</section>
        </div><!-- .fluid_container -->
    <!--///////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //		Scripts
    //
    ///////////////////////////////////////////////////////////////////////////////////////////////////--> 
    <script type='text/javascript' src='scripts/jquery.min.js'></script>
    <script type='text/javascript' src='scripts/jquery.mobile.customized.min.js'></script>
    <script type='text/javascript' src='scripts/jquery.easing.1.3.js'></script> 
    <script type='text/javascript' src='scripts/camera.min.js'></script> 
    <script type='text/javascript' src='navbar/nav.js'></script> 
</body>
</html>`;
fs.writeFileSync('index.html', indexpage(Programme, Pid));
