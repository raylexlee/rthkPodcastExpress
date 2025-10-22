let myContent;
document.addEventListener("DOMContentLoaded", function(event) {
  myInit();
});
const contentUrl = (t, e) => `text/${t}/${e}.txt`;
function myInit() {
  myContent = document.getElementById('myContent');
  let chapter = '001';
  let title = '金瓶梅';
  const querystring = location.search;
  if (querystring != '') {
    const params = (new URL(document.location)).searchParams;
    const episode =  params.get('episode');
    const book =  params.get('book');
    chapter = episode ? episode : chapter;
    title = book ? book : title;
  }
  document.title = `${title}-${chapter}`
  fetch(contentUrl(title, chapter))
    .then(response => response.text())
    .then(data => {
      const paragraphs = data.replace(/\n+$/, "").split('\n');
      myContent.innerHTML = paragraphs.map(e => `<p>${e}</p>`).join('\n');
    });
}
