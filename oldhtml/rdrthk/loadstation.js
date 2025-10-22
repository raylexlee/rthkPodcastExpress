let episode,drama, group;
let title, stream, mode, episodes, ramas, groups;
let lastTitle, lastStream, lastMode;
const radiodrama = {};
function updateQR(t,s,m) {
  const base = document.location.href.split('?')[0];
  qrcode.makeCode(`${base}?title=${t}&stream=${s}&mode=${m}`);
}
async function fetchText(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}
        function playRadio() {
            const radio = document.getElementById("radio");
            const drama = document.getElementById("drama");
            const episode = document.getElementById("episode");
            const dramaValue = drama.value;
            const episodeValue = episode.value;
            document.title = drama[drama.selectedIndex].innerText;
            localStorage.setItem('lastStream'+title,document.title.replace(/ /g,'_'));
            radio.src = dramaValue;
            radio.play();
            updateQR(title, drama[drama.selectedIndex].innerText.replace(/ /g,'_'), document.body.classList.value);
        }

        function stopRadio() {
            const radio = document.getElementById("radio");
            radio.pause();
            radio.currentTime = 0;
        }

        function toggleDarkMode() {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem('lastMode',document.body.classList.value);
            updateQR(title, drama[drama.selectedIndex].innerText.replace(/ /g,'_'), document.body.classList.value);
        }
document.addEventListener("DOMContentLoaded", function(event) {
  myInit();
});
async function myInit() {
  const gdata = await fetchText('groups.txt');
  groups = gdata.replace(/\n+$/, "").split("\n").map(line => line.split(" ")[0]);
const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params === 'none') {
  lastTitle = '广东';
  if (localStorage.getItem('lastTitle')) lastTitle = localStorage.getItem('lastTitle');
  window.location =`index.html?title=${lastTitle}`;
}
title =  params.get('title');
title = title ? title : '广东';
if (groups.includes(title)) { 
  localStorage.setItem('lastTitle',title)
} else {
  title = localStorage.getItem('lastTitle') ? localStorage.getItem('lastTitle') : '广东';  
}
stream =  params.get('stream');
stream = stream ? stream : 'none';
if ((stream === 'none') && (localStorage.getItem('lastStream'+title))) stream = localStorage.getItem('lastStream'+title);
mode =  params.get('mode');
mode = mode ? mode : '';
if ((mode === '') && (localStorage.getItem('lastMode'))) mode = localStorage.getItem('lastMode');
const qingtingUrl = id => `https://lhttp.qingting.fm/live/${id}/64k.mp3`;
const streamUrl = id => (id[0] === 'h') ? id : qingtingUrl(id);
const optionElement = a => `<option value="${streamUrl(a[1])}" ${(a[0] === stream) ? 'selected' : ''}>${a[0].replace(/_/g,' ')}</option>`;
const groupOptionElement = a => `<option value="${a}" ${(a === title) ? 'selected' : ''}>${a}</option>`;
  drama = document.getElementById('drama');
  group = document.getElementById('group');
  const data = await fetchText(`text/${title}.txt`);
  dramas = data.replace(/\n+$/, "").split("\n");
  drama.innerHTML = dramas.map(line => {
    a = line.split(' ');
    return optionElement(a);
  }).join('\n');
  group.innerHTML = groups.map(a => groupOptionElement(a)).join('\n');
  group.onchange = function() {
    window.location = `index.html?title=${group.value}`; 
  }
  if (mode) toggleDarkMode();
}
