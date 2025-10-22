let audio, episode,drama, group;
let title, author, chapter, mode; 
let Drama ; 
let Group ;
let lastRadioDramaTitle, lastMode;
let activeEpisode;
let currentTime;
const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params === 'none') {
  title = localStorage.getItem('lastRadioDramaTitle');
  if (!title) title = radiodrama.title;
} else {
title =  params.get('title');
title = title ? title : radiodrama.title;
  localStorage.setItem('lastRadioDramaTitle',title);
  const e = params.get('episode');
  const t = params.get('time');
  if (e && t) {
    localStorage.setItem('activeEpisode'+title,e);
    localStorage.setItem('currentTime'+title, t);
  }
 mode =  params.get('mode');
mode = mode ? mode : '';
if ((mode === '') && (localStorage.getItem('lastMode'))) mode = localStorage.getItem('lastMode');
window.location = 'index.html';
}
function updateQR(t,e,T,m) {
  const base = document.location.href.split('?')[0];
  qrcode.makeCode(`${base}?title=${t}&episode=${e}&time=${T}&mode=${m}`);
}
async function fetchText(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}

        function toggleDarkMode() {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem('lastMode',document.body.classList.value);
        }
document.addEventListener("DOMContentLoaded", function(event) {
  myInit();
});
async function myInit() {
  const gdata = await fetchText('allGroup.txt');
  Group = gdata.replace(/\n+$/, "").split("\n");
  const ddata = await fetchText('allDrama.txt');
  Drama = ddata.replace(/\n+$/, "").split("\n");
  const filterDrama = Drama.filter(d => d.split(' ')[1] == title)
   if (filterDrama.length == 0) window.location = `index.html`;
   radiodrama.currentDrama = filterDrama[0];
   author = radiodrama.group;
const optionElement = a => {
  const [A, t, x, n, D] = a.split(' '); 
  return `<option value="${a}" ${(t === radiodrama.title) ? 'selected' : ''}>${t} (${n})</option>`;
  }
const episodeOptionElement = a => `<option value="${a}" ${(a === radiodrama.episode) ? 'selected' : ''}>${a}</option>
`;
const groupOptionElement = a => `<option value="${a}" ${(a == radiodrama.group) ? 'selected' : ''}>${a}</option>`;
  audio = document.getElementById("audio");
  drama = document.getElementById('drama');
  group = document.getElementById('group');
  episode = document.getElementById('episode');
  for (let i=1; i <= radiodrama.episodes; i++) episode.innerHTML += episodeOptionElement(i);
  drama.innerHTML = Drama.filter(d => d.startsWith(author+' '))
    .map( a => optionElement(a)).join('\n');

  group.innerHTML = Group.map(a => groupOptionElement(a)).join('\n');
  group.onchange = function() {
    if ((audio.firstElementChild.src !== "") && (audio.paused == false)) audio.pause();
    author = group.value;
    const lastTitle = localStorage.getItem('lastTitleRadioDrama'+author);
    radiodrama.currentDrama = 
         Drama.filter(d => d.startsWith(author+' '+(lastTitle ? (lastTitle+' ') : '')))[0];
    title = radiodrama.title;
    activeEpisode = radiodrama.episode;
    currentTime = radiodrama.time;
    drama.innerHTML = Drama.filter(a => a.startsWith(author+' ')).map(a => optionElement(a)).join('\n');
    drama.onchange();
  }
  drama.onchange = function() {
    if ((audio.firstElementChild.src !== "") && (audio.paused == false)) audio.pause();
    radiodrama.currentDrama = drama.value;
    title = radiodrama.title;
    activeEpisode = radiodrama.episode;
    currentTime = radiodrama.time;
    episode.innerHTML = '';
    for (let i = 1; i <= radiodrama.episodes; i++) episode.innerHTML += episodeOptionElement(i); 
    radiodrama.play = audio;
  }
  episode.onchange = function() {
    radiodrama.currentEpisode = episode.value;
    radiodrama.currentTime = 0.0;
    activeEpisode = radiodrama.episode;
    currentTime = radiodrama.time;
    radiodrama.play = audio;
  }
  audio.onended = () => {
    radiodrama.stepEpisode = 1;
    activeEpisode = radiodrama.episode;
    episode.value = activeEpisode;
    radiodrama.currentTime = 0.0;
    currentTime = radiodrama.time;
    radiodrama.play = audio;
  }
  audio.onpause = () => {
    radiodrama.currentTime = audio.currentTime;
    currenTime = radiodrama.time;
    radiodrama.save();
    updateQR(title, episode.value, audio.currentTime, document.body.classList.value);
  }
  toggleDarkMode();
  //if (mode) toggleDarkMode();
  radiodrama.play = audio;
}
