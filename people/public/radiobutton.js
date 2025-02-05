const vtArray = [ 
['zhttskoob.html', 'tts','HotPink'], 
['podcast.html','podcast','LawnGreen'], 
['book.html','txt', 'cyan']
];
const partialUrl = { 
'zhttskoob.html' : 'people/zhttskoob.html?title', 
'podcast.html' : 'myrthk/podcast.html?prog=287&page', 
'book.html' : 'people/book.html?title'
};
const description = {
'zhttskoob.html' : `經由香港電台古今風雲人物節目每集內容而成, 並且優化收聽收看效果, 可以自動跳集, 記錄上次收聽時段, 敬請參考<a href="https://github.com/raylexlee/rthkPodcastExpress/tree/master/people">程式碼</a><br />為獲得最佳語音效果，請使用最新版本的 Microsoft Edge。其他瀏覽器可能適用, 特別是 ios 和 android 設備。詳情請參考 Web Speech API 的 <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API#speechsynthesis_2">SpeechSynthesis</a>。`,
'podcast.html' : '經由香港電台古今風雲人物節目串流而成, 並且優化收聽效果, 可以自動跳集, 記錄上次收聽時段, 敬請參考<a href="https://github.com/raylexlee/rthkPodcastExpress/blob/master/refresh_podcast.sh">程式碼</a>。',
'book.html' : '請使用最新版本 Microsoft Edge 的大聲朗讀'
}
function insertRadioAtTopOfBody() {
  document.body.innerHTML = radioForm(vtArray) + document.body.innerHTML;
  selectRadioButton(type);
  document.querySelector('ul').style.backgroundColor = vtArray.filter( e => e.includes(type))[0][2];
  document.querySelector('p').innerHTML = description[type];
}
function radioChange(radio) {
    const selectedValue = radio.value;
    const selectedText = radio.parentElement.textContent.trim();
    const selectedBgcolor = window.getComputedStyle(radio.parentElement).backgroundColor;
    
//    console.log('Selected radio button value:', selectedValue);
//    console.log('Selected radio button text:', selectedText);
//    console.log(selectedBgcolor);
    const links = document.querySelectorAll('a');
    for (i=0; i < links.length; i++) {
       links[i].href = links[i].href.replace(partialUrl[type], partialUrl[selectedValue]);
    } 
    document.querySelector('ul').style.backgroundColor = selectedBgcolor;
    document.querySelector('p').innerHTML = description[selectedValue];
    type = selectedValue;
    const base = window.location.href.split('?')[0];
    const url = base.endsWith('group.html') ? `${base}?author=${document.title}&type=${type}` : `${base}?type=${type}` ;
    qrcode.makeCode(url);
}

function selectRadioButton(value) {
    const radioButton = document.querySelector(`input[name="fileType"][value="${value}"]`);
    if (radioButton) {
        radioButton.checked = true;
    }
}
const radioOption = (v,t, c) => `
            <label style="background-color: ${c}">
                <input type="radio" name="fileType" value="${v}" onchange="radioChange(this)">${t}
            </label>
`;
const radioForm = vtArr => `
    <form>
        <div class="radio-group">
           ${vtArr.map(e => {
             const [v, t, c] = e;
             return radioOption(v,t, c);
           }).join('\n')}
        </div>
    </form>
`;
