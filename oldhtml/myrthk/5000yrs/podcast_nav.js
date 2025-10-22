let activeEpisode, title, audio;
let currentTime;
let chapters ;
let prog = '明';
let pageTitle;
const querystring = location.search;
if (querystring != '') {
    const params = (new URL(document.location)).searchParams;
    const pgProg =  params.get('prog');
    prog = pgProg ? pgProg : prog;
}
pageTitle=prog;
document.addEventListener("DOMContentLoaded", function(event) {
  myInitChapters(); 
});
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
  fetch(`${prog}.txt`)
    .then(response => response.text())
    .then(data => {
      chapters = data.replace(/\n+$/, "").split('\n').map(e => {
        const [caption,url] = e.split(" ");
        return {caption:caption,url:url};
      });
      const optIndexHtml = `<li><a href="index.html">返　回　前　目　錄</a></li>`;
      document.title = pageTitle;
      document.getElementById('myContent').value = `


本網頁轉自香港電台網上中華五千年純文字版而來, 

主要提供連續播放功能
`;
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
function getLastChapter() {
  if (!localStorage.getItem('activeEpisode'+pageTitle)) {
    const start_episode = 1;
    localStorage.setItem('activeEpisode'+pageTitle,start_episode);
    localStorage.setItem('currentTime'+pageTitle, 0.0);
  }
  activeEpisode = parseInt(localStorage.getItem('activeEpisode'+pageTitle));
  currentTime = localStorage.getItem('currentTime'+pageTitle);
  return (activeEpisode - 1); 
}
