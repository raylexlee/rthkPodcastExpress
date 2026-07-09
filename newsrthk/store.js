let mySpeak;
let audio, myRange, myAutoplay;
let myPeriod, myEvent, myContent, myIntro;
const qEvent = {
"hktoday" : "晨早新聞天地",
"12oclocknews" : "午間新聞天地",
"6oclocknews" : "傍晚新聞天地",
"eveningnews" : "晚間新聞天地",
"newspaper" : "報章摘要"
}
const periods = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i); // Subtract days (0 is today, 1 is yesterday, etc.)
    
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(d.getDate()).padStart(2, '0');
    
    return `${yyyy}${mm}${dd}`;
});
let intro = '';
let Content = {};
let currentTime;
const lastEventInPeriodStored = g => `yesternewsEventInPeriod${g}`
const lastEventStored = `yesternewsEvent`
let lastEvent = 'hktoday';
let lastPeriod = periods[1];
// b = hktoday, 12oclocknews, ..., newspaper
const soundUrl = (b,i) => `https://rthkaod2022.akamaized.net/m4a/radio/archive/radio1/${b}/m4a/${i}.m4a/master.m3u8`;
// i = yyyymmdd
const optionPeriod = g => `<option value="${g}" ${(g == lastPeriod) ? 'selected' : ''}>${g}</option>`;
const optionEvent = e => `<option value="${e}" ${(e == lastEvent) ? 'selected' : ''}>${qEvent[e]}</option>`;
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
document.addEventListener("DOMContentLoaded", function(event) { myInit(); });
function myInit() { 
  audio = document.getElementById('audio');
  mySpeak = document.getElementById('mySpeak');
  myAutoplay = document.getElementById('myAutoplay');
  audio.onplay = function (e) { 
    if (currentTime > audio.currentTime) {
      audio.currentTime = currentTime;
    }
  };
  audio.onpause = function (e) {
    mySpeak.innerHTML = '<a href="javascript:speak()" style="color:red;">&#9654;</a>';
  };
  audio.onplay = function () {
    mySpeak.innerHTML = '<img src="playing.svg" />';
  }
  audio.onseeked = () => { currentTime = audio.currentTime; }
  audio.onended = function (e) {
    if (myAutoplay.checked) {
      moveToNextOption();
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
  myPeriod = document.getElementById('myPeriod');
  myEvent = document.getElementById('myEvent');
  myIntro = document.getElementById('myIntro');
  myContent = document.getElementById('myContent');
  const event = lastEvent;
  myPeriod.innerHTML = periods.map(g => optionPeriod(g)).join('\n');
  myEvent.innerHTML = Object.keys(qEvent).map(b => optionEvent(b)).join('\n');
  myPeriod.onchange = () => {
    lastEvent = 'hktoday';
    myEvent.innerHTML = Object.keys(qEvent).map(b => optionEvent(b)).join('\n');
    gotoChapter(myEvent.value);
  }
  myEvent.onchange = () => {
    gotoChapter(myEvent.value);
  }
  gotoChapter(myEvent.value);
}
function updateQR(e,t) {
  const base = decodeURI(document.location.href.split('?')[0]);
  qrcode.makeCode(`${base}?episode=${e}&time=${t}`);
}
function moveToPrevOption() {
  const selectElement = myEvent;
  
  // Calculate the next index, looping back to 0 if at the end
  const nextIndex = selectElement.selectedIndex
                   ? (selectElement.selectedIndex - 1)
                   : (selectElement.options.length - 1);
  
  // Update the select element
  selectElement.selectedIndex = nextIndex;
  
  // Optional: Trigger a 'change' event if other scripts rely on it
  selectElement.dispatchEvent(new Event('change'));
}
function moveToNextOption() {
  const selectElement = myEvent;
  
  // Calculate the next index, looping back to 0 if at the end
  const nextIndex = (selectElement.selectedIndex + 1) % selectElement.options.length;
  
  // Update the select element
  selectElement.selectedIndex = nextIndex;
  
  // Optional: Trigger a 'change' event if other scripts rely on it
  selectElement.dispatchEvent(new Event('change'));
}

function gotoChapter(chapter) {
   const B = myEvent.value;
   const E = qEvent[B];
   const I = myPeriod.value;
   audio.firstElementChild.setAttribute('src', soundUrl(B,I));
   audio.load();
   document.title = `${E}-${myPeriod.value}`;
   if (myAutoplay.checked) {
     audio.play();
     audio.currentTime = currentTime;
   }
}
function speak() { audio.play(); }
function pauseResume() { audio.pause(); }
