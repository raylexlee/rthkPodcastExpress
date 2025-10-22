let activeEpisode, title, audio;
let currentTime;
let Programme = {};
let Page = {};
let chapters = {};
let prog = 'NONE';
let pageTitle = 'ALL';
const querystring = location.search;
const params = (new URL(document.location)).searchParams;
const pgProg =  params.get('prog');
prog = pgProg ? pgProg : prog;
const pgPage =  params.get('page');
pageTitle = pgPage ? pgPage : pageTitle;
const li_podcasts = (podcasts, pid) => podcasts
.map(podcast => `			   <li><a href="podcast.html?prog=${pid}&page=${podcast.title}">${podcast.title} (${podcast.episodes})</a></li>`).join('\n');
const li_years = (years, pid) => years.map(year => li_podcasts(year.podcasts, pid)).join('\n');
const from_to_years = years => `${years[0].name}-${years[years.length - 1].name}`;
const indexpage = (programme, pid) => `
  <div class="nav-container">
    <div class="brand">
	    <img src="https://podcast.rthk.hk/podcast/upload_photo/item_photo/170x170_${pid}.jpg" width="auto" height="70" />
	  <div class="subtitle">${programme.name}<br />收聽優化版</div>
    </div>
    <nav>
      <div class="nav-mobile">
        <a class="active" id="nav-toggle" href="#!"><span></span></a>
      </div>
      <ul class="nav-list">
              <li>
                <a href="#">${from_to_years(programme.years)}</a>
                <ul class="nav-dropdown" id="myChapterList">
${li_years(programme.years, pid)}
                </ul>
              </li>
      </ul>
    </nav>
  </div>
`;
document.addEventListener("DOMContentLoaded", function(event) {
  if (pageTitle === 'ALL') { 
    myInitIndexPage(); 
  } else { myInitChapters(); 
    }
});
function myInitIndexPage() {
  fetch(`${prog}.json`)
    .then(response => response.json())
    .then(data => {
      Programme = data;
      if (Programme.pages.length === 1) {
        window.location = `podcast.html?prog=${prog}&page=${Programme.pages[0].title}`;
      }
      document.title = Programme.name;
      document.getElementById('myContent').value = `

${Programme.name} 最新播岀 ${Programme.latest}`;
      document.getElementById('navigation').innerHTML = indexpage(Programme, prog);
      ProcessMenu();
      document.getElementById('nav-toggle').onclick = function () {
        this.classList.toggle('active');
      };
      document.getElementById('nav-toggle').addEventListener('click', function () {
        document.querySelectorAll('nav ul').forEach(el => toggle(el));
        });
     });
}
const media = {};
media['mp4'] = `<div class="videoWrapper"><video id="audio"   width="640" height="480" controls>
  <source src="" type="video/mp4">
  Your browser does not support the video tag.
  </video></div>
`;
media['mp3'] = `<audio id="audio" preload="auto" tabindex="0" controls="">
<source type="audio/mp3" src="">
Sorry, your browser does not support HTML5 audio.
</audio>
`;
media['m4a'] = `<audio id="audio" preload="auto" tabindex="0" controls="">
<source type="audio/x-m4a" src="">
Sorry, your browser does not support HTML5 audio.
</audio>
`;
function myInitChapters() {
  const optChapter = (chapter, index) => `<li><a href="javascript:gotoChapter(${index})">${chapter.caption}</a></li>`;
  fetch(`${prog}.json`)
    .then(response => response.json())
    .then(data => {
      Programme = data;
      Page = Programme.pages.filter(page => page.title === pageTitle)[0]; 
      const parentPage = (Programme.pages.length === 1) ? 'index.html' : `podcast.html?prog=${prog}`;
      const optIndexHtml = `<li><a href="${parentPage}">返　回　前　目　錄</a></li>`;
      chapters = Page.podcasts;
      document.title = Page.title;
      document.getElementById('myContent').value = `

${(Page.title === Programme.name) ? '' : Page.title} 首播日期 ${Page.broadcast_date}

${(Page.title === Programme.name) ? '' : Programme.name} 最新播岀 ${Programme.latest}`;
      document.getElementById('myChapterList').innerHTML=`${optIndexHtml}\n${chapters.map((c,i) => optChapter(c,i)).join('\n')}`; 
      document.getElementById('media').innerHTML = `${media[chapters[0].url.slice(-3)]}`;
      ProcessMenu();
      document.getElementById('nav-toggle').onclick = function () {
        this.classList.toggle('active');
      };
      document.getElementById('nav-toggle').addEventListener('click', function () {
        document.querySelectorAll('nav ul').forEach(el => toggle(el));
        });
      audio = document.getElementById('audio');
      audio.onpause = function (e) {
        localStorage.setItem('currentTime'+pageTitle, audio.currentTime);
        updateQR(prog, pageTitle, activeEpisode, audio.currentTime);
        };
      audio.onended = nextChapter;
      const chapter = getLastChapter();
      gotoChapter(chapter); 
      });
}    
function prevChapter() {
    currentTime = 0.0;
    const idx = activeEpisode - 1;
    let i = idx - 1;
    i = (i === -1) ? (chapters.length - 1) : i;
    const chapter = i;
    gotoChapter(chapter);
}
function nextChapter() {
    currentTime = 0.0;
    const idx = activeEpisode - 1;
    let i = idx + 1;
    i = (i === chapters.length) ? 0 : i;
    const chapter = i;
    gotoChapter(chapter);
}
function gotoChapter(chapter) {
   audio.firstElementChild.setAttribute('src', chapters[chapter].url);
   audio.load();
   audio.play();
   activeEpisode = chapter + 1;
   localStorage.setItem('activeEpisode'+pageTitle, activeEpisode);
   document.getElementById('myBook').innerHTML=`
     ${pageTitle} 
     <a href="javascript:prevChapter()" style="color:cyan;">&lArr;</a> 
     ${chapters[chapter].caption}
     <a href="javascript:nextChapter()" style="color:cyan;">&rArr;</a> 
     `;
   document.title = `${pageTitle} ${chapters[chapter].caption}`;
   audio.play();
   audio.currentTime = currentTime;
}
function toggle(elem) {
  elem.style.display = (elem.style.display === 'none') ? 'block' : 'none';
}

function ProcessMenu() {
  document.querySelectorAll('nav ul li > a:not(:only-child)')
    .forEach(el => el.onclick = function (e) {
      const nd = this.nextElementSibling;
      document.querySelectorAll('.nav-dropdown')
        .forEach(function(elem) { 
          if (elem === nd) {
            toggle(nd);
          } else {
            elem.style.display = 'none';
          }});
      e.stopPropagation();
    });
  document.documentElement.onclick = function () {
    document.querySelectorAll('.nav-dropdown').forEach(el => el.style.display = 'none');
  };
}
function updateQR(g,p,e,t) {
  const base = document.location.href.split('?')[0];
  qrcode.makeCode(`${base}?prog=${g}&page=${p}&episode=${e}&time=${t}`);
}
function getLastChapter() {
  const e = params.get('episode');
  const t = params.get('time');
  if (e && t) {
    localStorage.setItem('activeEpisode'+pageTitle,e);
    localStorage.setItem('currentTime'+pageTitle, t);
    window.location = `${window.location.href.split('?')[0]}?prog=${prog}&page=${pageTitle}`;
  }
  if (!localStorage.getItem('activeEpisode'+pageTitle)) {
    const start_episode = 1;
    localStorage.setItem('activeEpisode'+pageTitle,start_episode);
    localStorage.setItem('currentTime'+pageTitle, 0.0);
  }
  activeEpisode = parseInt(localStorage.getItem('activeEpisode'+pageTitle));
  currentTime = localStorage.getItem('currentTime'+pageTitle);
  return (activeEpisode - 1); 
}
