let mySpeak;
let audio, myRange, myAutoplay;
let myPeriod, myEvent, myContent, myIntro;
let Events = {};
let periods = [];
let intro = '';
let Content = {};
let currentTime;
const lastEventInPeriodStored = g => `last5000yrsEventInPeriod${g}`
const lastEventStored = `last5000yrsEvent`
let lastEvent;
let lastPeriod;
const soundUrl = (b,i) => `https://app4.rthk.hk/mp3/chiculture/fivethousandyears/${b}/${i}.mp3`;
const optionPeriod = g => `<option value="${g}" ${(g == lastPeriod) ? 'selected' : ''}>${g.replaceAll('_',' ')}</option>`;
const optionEvent = e => `<option value="${e.join(' ')}" ${(e[3] == lastEvent) ? 'selected' : ''}>${e[0]} ${e[1]}</option>`;
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
async function fetchJSON(file) {
  const response = await fetch(file);
  const data = await response.json(); // Parses JSON into JS object
  return data;
}
document.addEventListener("DOMContentLoaded", function(event) { myInit(); });
async function myInit() { 
  audio = document.getElementById('audio');
  mySpeak = document.getElementById('mySpeak');
//  myRange = document.getElementById('myRange'); 
  myAutoplay = document.getElementById('myAutoplay');
//  myRange.oninput = function() {
//    const v = myRange.value;
//    myContent.style.fontSize = `${20 + parseInt(v)}px`;
//    myIntro.style.fontSize = `${20 + parseInt(v)}px`;
//  };
  audio.onplay = function (e) { 
    if (currentTime > audio.currentTime) {
      audio.currentTime = currentTime;
    }
  };
  audio.onpause = function (e) {
    const eid = myEvent.value.split(' ')[3];
    const p = myPeriod.value;
    localStorage.setItem(lastEventInPeriodStored(p), eid);
    localStorage.setItem(lastEventStored, eid); 
    localStorage.setItem('5000yrsCurrentTime'+eid, audio.currentTime);
    updateQR(eid, audio.currentTime);
    mySpeak.innerHTML = '<a href="javascript:speak()" style="color:red;">&#9654;</a>';
  };
  audio.onplay = function () {
    mySpeak.innerHTML = '<img src="playing.svg" />';
  }
  audio.onseeked = () => { currentTime = audio.currentTime; }
  audio.onended = function (e) {
    if (myAutoplay.checked) {
      nextChapter();
    } else {
      currentTime = 0.0;
      audio.play();
    }
  }
  const  myFootlineSetting = document.getElementById('myFootlineSetting');
  const  myFootline = document.getElementById('myFootline');
  const deviceType = getDeviceType();
  if (deviceType !== "Other") {
    const minHeight = (deviceType === 'iOS') ? '80px' : '70px';
    myFootline.style.minHeight = minHeight;
    myFootlineSetting.style.minHeight = minHeight;    
  } else {
    myFootline.style.display = 'none';
  }
  let data = await fetchText(`periods.txt`);
  periods = data.split('\n');
  periods.forEach(p => { Event[p] = [] });
  data = await fetchText(`events.txt`);
  const events = data.split('\n');
  events.forEach(e => { const a = e.split(' '); Event[a[0]].push(a.slice(1)) });
  myPeriod = document.getElementById('myPeriod');
  myEvent = document.getElementById('myEvent');
  myIntro = document.getElementById('myIntro');
  myContent = document.getElementById('myContent');
  const event = getLastChapter();
  Content = await fetchJSON(`text/${lastPeriod}.json`);
  myPeriod.innerHTML = periods.map(g => optionPeriod(g)).join('\n');
  myEvent.innerHTML = Event[lastPeriod].map(b => optionEvent(b)).join('\n');
  myIntro.value = await fetchText(`text/${lastPeriod}.txt`);
  myContent.value = Content[myEvent.value.split(' ')[0]];
  myPeriod.onchange = async () => {
    myIntro.value = await fetchText(`text/${myPeriod.value}.txt`);
    Content = await fetchJSON(`text/${myPeriod.value}.json`);
    lastEvent = localStorage.getItem(lastEventInPeriodStored(myPeriod.value));
    lastEvent = lastEvent ? lastEvent : Event[myPeriod.value][0][3];
    myEvent.innerHTML = Event[myPeriod.value].map(b => optionEvent(b)).join('\n');
    const e = myEvent.value.split(' ');
    myContent.value = (e[0] in Content) ? Content[e[0]] : `#${e[3]} ${e[0]} ${e[1]}`;
    gotoChapter(myEvent.value);
  }
  myEvent.onchange = () => {
    const e = myEvent.value.split(' ');
    gotoChapter(myEvent.value);
  }
  gotoChapter(myEvent.value);
}
function updateQR(e,t) {
  const base = decodeURI(document.location.href.split('?')[0]);
  qrcode.makeCode(`${base}?episode=${e}&time=${t}`);
}
function prevChapter() {
    const eid = myEvent.value.split(' ')[3];
    const events = Event[myPeriod.value];
    let pos = 0;
    while (events[pos][3] !== eid) pos++;
    pos -= 1;
    if (pos < 0) pos = events.length - 1;    
    const chapter = events[pos].join(' ');
    myEvent.value = chapter;
    currentTime = 0.0;
    localStorage.setItem('5000yrsCurrentTime'+events[pos][3], 0.0);
    gotoChapter(chapter);
}
function nextChapter() {
    const eid = myEvent.value.split(' ')[3];
    const events = Event[myPeriod.value];
    let pos = 0;
    while (events[pos][3] !== eid) pos++;
    pos += 1;
    if (pos === events.length ) pos = 0;    
    const chapter = events[pos].join(' ');
    myEvent.value = chapter;
    currentTime = 0.0;
    localStorage.setItem('5000yrsCurrentTime'+events[pos][3], 0.0);
    gotoChapter(chapter);
}
function gotoChapter(chapter) {
   const [E,T,B,I] = chapter.split(' ');
   audio.firstElementChild.setAttribute('src', soundUrl(B,I));
   audio.load();
   document.title = `${E}-${myPeriod.value}`;
   myContent.value = (E in Content) ? Content[E] : `#${I} ${E} ${T}`;
   if (myAutoplay.checked) {
     audio.play();
     audio.currentTime = currentTime;
   }
}
function getLastChapter() {
const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params !== 'none') {
  const e = params.get('episode');
  const t = params.get('time');
  if (e && t) {
    localStorage.setItem(lastEventStored, e);
    localStorage.setItem('5000yrsCurrentTime'+e, t);
  }
}
  if (!localStorage.getItem(lastEventStored)) {
    localStorage.setItem(lastEventStored, '195');
    localStorage.setItem('5000yrsCurrentTime'+'195', 0.0);
  }
  lastEvent = localStorage.getItem(lastEventStored);
  currentTime = localStorage.getItem('5000yrsCurrentTime'+lastEvent);
  lastPeriod = periods.filter(p => Event[p].map(e => e[3]).includes(lastEvent))[0];
  return Event[lastPeriod].filter(e => e[3] === lastEvent)[0];
}
function speak() { audio.play(); }
function pauseResume() { audio.pause(); }
