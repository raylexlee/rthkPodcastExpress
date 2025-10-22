let myContent;
let nDigits = 3;
let title, chapters;
let activeEpisode;
const querystring = location.search;
const params = (querystring != '') ? (new URL(document.location)).searchParams : 'none';
if (params === 'none') window.location = 'qbook.html?title=阿Q正傳';
title =  params.get('title');
title = title ? title : '阿Q正傳';
document.addEventListener("DOMContentLoaded", function(event) {
  myInit();
});
async function fetchText(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}
const contentUrl = chapter => `text/${title}/${chapter.substring(0,nDigits)}.txt`;
const coverparametersUrl = `text/${title}/coverparameters.txt`;
async function myInit() {
  myContent = document.getElementById('myContent');
  const data = await fetchText(coverparametersUrl);
  chapters = data.replace(/\n+$/, "").split("\n");
  nDigits = chapters[0].indexOf(" ");      
  for (const chapter of chapters) await gotoChapter(chapter); 
}
async function gotoChapter(chapter) {
   activeEpisode = chapter.substring(0,nDigits);
   const headline=isHead => `<h5>
     ${isHead ? chapter.substring(1 + nDigits).replace("_"," ") : '&nbsp'}
     </h5>`;
     const data = await fetchText(contentUrl(chapter));
     const paragraphs = data.replace(/\n+$/, "").split('\n');
     myContent.innerHTML += `
${headline(true)}
${paragraphs.map(e => `<p>${e}</p>`).join('\n')}
`;
}
