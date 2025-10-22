let adjustment = 0.4;
let audio;
let title, myContent, myChapter, myRange, myBook, myAutoplay;
let nDigits = 3;
let myPauseCancel;
let chapters;
let activeEpisode;
const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params === 'none') window.location = 'zhttsaloud.html?title=阿Q正傳';
title =  params.get('title');
title = title ? title : '阿Q正傳';
const synth = window.speechSynthesis;
const myVoice = document.getElementById('myVoice');
const rate = document.querySelector('#rate');
let completed_myinit = false;
let voices = [];
let mySpeaker = [];
let utterThis;
let justCancel = false;
let pausing = false;
let crPosition=[];
let nCharsRow, lineHeight; 
let rowsLine=[]; 
let numCharsLine=[];
let punctuationPosition=[];
let punctuationArray=[];
let positionIndex = 0;
const nameSpeaker = name => {
   const firstPart = name.split('(')[0].trim();
   return firstPart.startsWith('Microsoft') ? firstPart.split(' ')[1] : firstPart;
};
let punctuationRegex = /[；。！？;.!?]/gm;
const googleRegex = /[；。！？，,;.!?]/gm;
//const notAndroid=navigator.userAgent.toLowerCase().indexOf('android')==-1;
const notAndroid = false;
function updatePauseCancel() {
  myPauseCancel.innerHTML = (mySpeaker[myVoice.selectedIndex].localService && notAndroid) ? '&#9208;' : '&#9632;';
}
function myTTSinit() {
 mySpeaker = [];
 voices = synth.getVoices();
 let i;
 for (i=0; i < voices.length; i++) if (voices[i].lang.startsWith('zh')) mySpeaker.push(voices[i]);
let voice = mySpeaker.findIndex(e => nameSpeaker(e.name) === 'WanLung');
if (voice !== -1) {
   [mySpeaker[0], mySpeaker[voice]] = [mySpeaker[voice], mySpeaker[0]];
 } else {
   voice = mySpeaker.findIndex(e => e.lang.substr(3,2) === 'HK');
   if (voice >= 1) [mySpeaker[0], mySpeaker[voice]] = [mySpeaker[voice], mySpeaker[0]];
   }
  if (!localStorage.getItem('zhttsVoice')) {
    const start_voice = 0;
    localStorage.setItem('zhttsVoice',start_voice);
  }
 const lastVoice = parseInt(localStorage.getItem('zhttsVoice'));
 const option = (e,v) => `<option value="${e.name}" ${(v === lastVoice) ? 'selected' : ''}>
   ${nameSpeaker(e.name)} ${e.lang.substr(3,2)}</option>
   `;
 myVoice.innerHTML = mySpeaker.map((e,v) => option(e,v)).join('\n');
 utterThis = new SpeechSynthesisUtterance('Create utter this');
 utterThis.onpause = function (event) {
   console.log(event.charIndex);
   console.log('SpeechSynthesisUtterance.onpause');
 }
 utterThis.onend = function (e) {
   if (justCancel) {
     justCancel = false;
     return;
   }
   positionIndex++;
   if (positionIndex === punctuationPosition.length) {
     positionIndex = 0;
     if (myAutoplay.checked) {
       nextChapter();
     } 
   }
   speak();
 }
 utterThis.onerror = function (event) {
   console.error('SpeechSynthesisUtterance.onerror');
 }
// utterThis.onboundary = SyncAudioWithContent;
}
myTTSinit();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = myTTSinit;
}
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
const optionChapter = c => `<option value="${c}" ${c.startsWith(activeEpisode) ? 'selected' : ''}>${c.substring(1+nDigits).replaceAll('_',' ')}</option>`;
const contentUrl = chapter => `text/${title}/${chapter.substring(0,nDigits)}.txt`;
async function myInit() {
  document.title = title.replaceAll('_',' ');
  audio = document.getElementById('audio');
  audio.onended = () => { audio.play(); };
  audio.onplay = speak;
  audio.onpause = pauseResume;
  myContent = document.getElementById('myContent');
  myContent = document.getElementById('myContent');
  myContent.style.lineHeight=2;
  myChapter = document.getElementById('myChapter');
  myRange = document.getElementById('myRange'); 
  myBook = document.getElementById('myBook');
  myAutoplay = document.getElementById('myAutoplay');
  myPauseCancel = document.getElementById('myPauseCancel');
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
  myContent.onselect = e => {
    for (let i = 0; i < punctuationPosition.length; i++) {
      if (punctuationPosition[i] >= myContent.selectionStart) {
         positionIndex = i;
         speak();
         break;
      }
    }
  }
  myRange.oninput = function() {
    const v = myRange.value;
    myContent.style.fontSize = `${20 + parseInt(v)}px`;
    CalculateScrollData(); // for rowsLine[], lineHeight, nCharsRow
  };
  document.getElementById('setting').onbeforetoggle = function() {
    document.getElementById('yellow').style.display = (isEdgeAndroid() && (myVoice.length == 0)) ? '' : 'none'; 
  }
  document.body.onunload = function() {
    if (synth.speaking) {
      justCancel = true;
      synth.cancel();
    }
  };
  const data = await fetchText(`text/${title}/coverparameters.txt`);
  chapters = data.replace(/\n+$/, "").split('\n');
  nDigits = chapters[0].indexOf(' ');      
  const chapter = getLastChapter();
  myChapter.innerHTML = chapters.map(c => optionChapter(c)).join('\n');
  myChapter.onchange = () => { gotoChapter(myChapter.value); }
  if (mySpeaker.filter(s => s.voiceURI.startsWith('Google')).length >= 1) punctuationRegex = googleRegex;
  gotoChapter(chapter, false); 
}    
function prevChapter() {
    const idx =chapters.findIndex(c => c.startsWith(activeEpisode));
    let i = idx - 1;
    i = (i === -1) ? (chapters.length - 1) : i;
    const chapter = chapters[i];
    myChapter.value = chapter;
    positionIndex = 0;
    gotoChapter(chapter);
}
function nextChapter() {
    const idx =chapters.findIndex(c => c.startsWith(activeEpisode));
    let i = idx + 1;
    i = (i === chapters.length) ? 0 : i;
    const chapter = chapters[i];
    myChapter.value = chapter;
    positionIndex = 0;
    gotoChapter(chapter);
}
async function gotoChapter(chapter, PleaseSpeak = true) {
   //activeEpisode = parseInt(chapter.substring(0,3));
   activeEpisode = chapter.substring(0,nDigits);
   localStorage.setItem('wspa_activeEpisode'+title, activeEpisode);
   myBook.innerHTML = title.replaceAll('_',' ');
   document.title = `${title.replaceAll('_',' ')} ${chapter.substring(1 + nDigits).replaceAll('_',' ')}`;
   const data = await fetchText(contentUrl(chapter))
   myContent.value = data;
   myContent.value = myContent.value.split('\n').filter(e => e.length >= 1).join('\n');
   numCharsLine=myContent.value.split('\n').map(e => e.length);
   rowsLine = Array(numCharsLine.length);
   CalculateScrollData(); // for rowsLine[], lineHeight, nCharsRow
   new ResizeObserver(CalculateScrollData).observe(myContent);
   crPosition=[];
   for (let valueIndex=0; valueIndex < myContent.value.length; valueIndex++) 
     if (myContent.value[valueIndex] === '\n') {
       crPosition.push(valueIndex);
     }
   punctuationArray = myContent.value.match(punctuationRegex);
   punctuationPosition=[];
   let punctuationIndex = 0;
   for (let valueIndex=0; valueIndex < myContent.value.length; valueIndex++) 
     if (myContent.value[valueIndex] === punctuationArray[punctuationIndex]) {
       punctuationPosition.push(valueIndex);
       punctuationIndex++;
     }
   completed_myinit = true;
   if (myAutoplay.checked) {
     if (synth.speaking) { 
       justCancel = true;
       synth.cancel();
     }
     if (PleaseSpeak) speak();
   }
}
function getLastChapter() {
  const c = params.get('chapter');
  const s = params.get('sentence');
  if (c && s) {
    localStorage.setItem('wspa_activeEpisode'+title,c);
    localStorage.setItem('wspa_positionIndex'+title,s);
  }
  if (!localStorage.getItem('wspa_positionIndex'+title)) {
    localStorage.setItem('wspa_positionIndex'+title,0);
  }
  positionIndex = parseInt(localStorage.getItem('wspa_positionIndex'+title));
  if (!localStorage.getItem('wspa_activeEpisode'+title)) {
    const start_episode = chapters[0].substring(0,nDigits);
    localStorage.setItem('wspa_activeEpisode'+title,start_episode);
  }
  activeEpisode = localStorage.getItem('wspa_activeEpisode'+title);
  return chapters.find(c => c.startsWith(activeEpisode)); 
}
function speak(){
    if (synth.speaking) {
    //    console.error('speechSynthesis.speaking');
        return;
    }
    if (myContent.value !== '') {
    pausing = false;  
    const start = (positionIndex >= 1) ? (punctuationPosition[positionIndex - 1] + 1) : 0;
    const stop = punctuationPosition[positionIndex];
    utterThis.voice = mySpeaker.filter(e => e.name === myVoice.value)[0];
    updatePauseCancel();
    utterThis.text = myContent.value.substring(start, stop);
    utterThis.pitch = 1;
    utterThis.rate = rate.value;
    justCancel = true;
    synth.cancel();
    synth.speak(utterThis);
    audio.play();
    justCancel = false;
//    const portion = start / myContent.value.length;
//    myContent.scrollTop = portion * myContent.scrollHeight - adjustment * myContent.offsetHeight;
    ScrollText(start);
    myContent.select();
    myContent.setSelectionRange(start, stop);
  }
}
myVoice.onchange = function(){
  localStorage.setItem('zhttsVoice',myVoice.selectedIndex);
  justCancel = true;
  synth.cancel();
  speak();
}

function pauseResume() {
  if (synth.speaking !== true) {
    return;
  }
  audio.pause();
  synth.cancel();
  localStorage.setItem('wspa_positionIndex'+title, positionIndex);
  updateQR(title, activeEpisode, positionIndex);
}
function updateQR(t,c,s) {
  const base = document.location.href.split('?')[0];
  qrcode.makeCode(`${base}?title=${t}&chapter=${c}&sentence=${s}`);
}
function ScrollText(charIndex)  {
//  const fontSize = parseFloat(window.getComputedStyle(myContent).fontSize)
//  const nCharsRow = Math.floor(myContent.clientWidth / fontSize)
//  const lineHeight = myContent.scrollHeight / numCharsLine.map(e => Math.ceil(e / nCharsRow)).reduce((a,b) => a + b);
  let lineIndex;
  for (lineIndex=0; lineIndex < crPosition.length; lineIndex++)
    if (charIndex <= crPosition[lineIndex]) break;
  let topRow = 0;
  if (lineIndex >=1)
    topRow = rowsLine[lineIndex - 1];
    // topRow = numCharsLine.slice(0, lineIndex).map(e => Math.ceil(e / nCharsRow)).reduce((a,b) => a + b);
  const lastRow = Math.ceil(((lineIndex === 0) ? charIndex : (charIndex - crPosition[lineIndex-1])) / nCharsRow);
  myContent.scrollTop = (lineHeight * (topRow + lastRow)) - (adjustment * myContent.clientHeight);
}
function CalculateScrollData() {
  const fontSize = parseFloat(window.getComputedStyle(myContent).fontSize)
  nCharsRow = Math.floor(myContent.clientWidth / fontSize)
  rowsLine[0] = Math.ceil(numCharsLine[0] / nCharsRow);
  let lineIndex = 1;
  while (lineIndex < numCharsLine.length) {
    rowsLine[lineIndex] = rowsLine[lineIndex - 1] + Math.ceil(numCharsLine[lineIndex] / nCharsRow);
    lineIndex++;
  }
  lineHeight = myContent.scrollHeight / rowsLine[rowsLine.length - 1];
}
