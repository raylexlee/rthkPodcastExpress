let nDigits = 3;
let title, myContent, audio, myChapter, mySpeak, myBook, myAutoplay;
let chapters;
let activeEpisode;
let currentTime;
const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params === 'none') window.location = 'people.html?title=玄奘法師';
title =  params.get('title');
title = title ? title : '玄奘法師';
document.addEventListener("DOMContentLoaded", function(event) {
  myInit();
});
const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints;

  // Detect Android
  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // Detect iOS (including iPads running iPadOS 13+ which might report as MacIntel)
  if (/iPad|iPhone|iPod/.test(platform) || (platform === 'MacIntel' && maxTouchPoints > 1)) {
    return "iOS";
  }

  // If neither Android nor iOS, return "Other"
  return "Other";
};
function isEdgeAndroid() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('edg') && userAgent.includes('android');
}
async function fetchText(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}
const optionChapter = c => `<option value="${c}" ${c.startsWith(activeEpisode) ? 'selected' : ''}>${c.split(' ')[1].replaceAll('_',' ')}</option>`;
const soundUrl = id => `https://podcasts.rthk.hk/podcast/media/people/287_${id}.mp3`;
const contentUrl = chapter => `text/${title}/${chapter.substring(0,3)}.txt`;
async function myInit() {
  document.title = title;
  myContent = document.getElementById('myContent');
  audio = document.getElementById('audio');
  myChapter = document.getElementById('myChapter');
  mySpeak = document.getElementById('mySpeak'); 
  myBook = document.getElementById('myBook');
  myAutoplay = document.getElementById('myAutoplay');
const  myFootlineSetting = document.getElementById('myFootlineSetting');
const  myFootline = document.getElementById('myFootline');
  const deviceType = getDeviceType();
  if (deviceType !== "Other") {
    const minHeight = ((deviceType === 'iOS') || isEdgeAndroid()) ? '70px' : '60px';
    myFootline.style.minHeight = minHeight;
    myFootlineSetting.style.minHeight = minHeight;    
  } else {
    myFootline.style.display = 'none';
  }
  audio.onplay = function (e) { 
    if (currentTime > audio.currentTime) {
      audio.currentTime = currentTime;
    }
//    const pageTime = myContent.offsetHeight / myContent.scrollHeight * audio.duration / audio.playbackRate;
//    console.log(pageTime);
//    SyncAudioWithContent();
//    mySync = setInterval(SyncAudioWithContent, Math.round(pageTime*700));
  };
  audio.onpause = function (e) {
    localStorage.setItem('PEOPLEcurrentTime'+title, audio.currentTime);
    updateQR(activeEpisode, audio.currentTime);
//    clearInterval(mySync);
    mySpeak.innerHTML = '<a href="javascript:speak()" style="color:red;">&#9654;</a>';
  };
  audio.onplaying = function () {
    mySpeak.innerHTML = '<img src="playing.svg" />';
  }
  audio.onseeked = () => { currentTime = audio.currentTime; }
  audio.onended = function (e) {
    if (myAutoplay.checked) {
      nextChapter();
    }
  }
  const data = await fetchText(`person/${title}.txt`)
  chapters = data.replace(/\n+$/, "").split('\n');
  const chapter = getLastChapter();
  myChapter.innerHTML = chapters.map(c => optionChapter(c)).join('\n');
  myChapter.onchange = () => { gotoChapter(myChapter.value); }
  myChapter.value = chapter;
  gotoChapter(chapter); 
}    
function updateQR(e,t) {
  const base = decodeURI(document.location.href.split('?')[0]);
  qrcode.makeCode(`${base}?title=${title}&episode=${e}&time=${t}`);
}
function prevChapter() {
    const m = myChapter.value.split(' ')[0];
    let i = chapters.findIndex(c => c.startsWith(m)) - 1;
    i = (i === -1) ? (chapters.length - 1) : i;
    const chapter = chapters[i];
    myChapter.value = chapter;
    currentTime = 0.0;
    localStorage.setItem('PEOPLEcurrentTime'+title, 0.0);
    gotoChapter(chapter);
}
function nextChapter() {
    const m = myChapter.value.split(' ')[0];
    let i = 1 + chapters.findIndex(c => c.startsWith(m));
    i = (i === chapters.length) ? 0 : i;
    const chapter = chapters[i];
    myChapter.value = chapter;
    currentTime = 0.0;
    localStorage.setItem('PEOPLEcurrentTime'+title, 0.0);
    gotoChapter(chapter);
}
async function gotoChapter(chapter) {
   const [E, T, M, I] = chapter.split(' ');
   audio.firstElementChild.setAttribute('src', soundUrl(I));
   audio.load();
   activeEpisode = parseInt(chapter.substring(0,3));
   localStorage.setItem('PEOPLEactiveEpisode'+title, activeEpisode);
   myBook.innerHTML = title.replaceAll('_',' ');
   document.title = `${title.replaceAll('_',' ')} ${T.replaceAll('_',' ')}`;
   const data = await fetchText(contentUrl(chapter))
   myContent.value = data;
   myContent.scrollTop = 0.0;
   if (myAutoplay.checked) {
     audio.play();
     audio.currentTime = currentTime;
   }
}
function getLastChapter() {
  const e = params.get('episode');
  const t = params.get('time');
  if (e && t) {
    localStorage.setItem('PEOPLEactiveEpisode'+title,e);
    localStorage.setItem('PEOPLEcurrentTime'+title, t);
  }
  if (!localStorage.getItem('PEOPLEactiveEpisode'+title)) {
    const start_episode = parseInt(chapters[0].substring(0,3));
    localStorage.setItem('PEOPLEactiveEpisode'+title,start_episode);
    localStorage.setItem('PEOPLEcurrentTime'+title, 0.0);
  }
  activeEpisode = localStorage.getItem('PEOPLEactiveEpisode'+title);
  currentTime = localStorage.getItem('PEOPLEcurrentTime'+title);
  return chapters.find(c => c.startsWith(activeEpisode.padStart(3, '0'))) 
}
function speak() { audio.play(); }
function pauseResume() { audio.pause(); }
