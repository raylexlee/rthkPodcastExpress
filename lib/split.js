const series = (strNum, n) => (parseInt((strNum.substr(1) - 1) / n) + 1).toString().padStart(3,'0');
const season = '春夏秋冬'; 
module.exports = (date, titleCaption, pid, programme) => {
  let n = 0, title = '', caption = '';
  switch (pid) {
  case '287':
    n = titleCaption.indexOf('（');  
    if (n !== -1) {
      title = titleCaption.split('（')[0];
    } else {
      n = titleCaption.indexOf('(');
      title = titleCaption.split('(')[0];
    }  
    if (title.startsWith('岳飛(五')) {
      n = titleCaption.indexOf('(');
      title = titleCaption.split('(')[0];
    }
    title = ( title ===  '彼得大帝') ?  '彼德大帝' : title;		  
    caption = titleCaption.substr(n);		  
    break;  
  case '336':
    [title, caption] = titleCaption.split(' ');
    title = `第${series(title, 18)}輯`;
    break;
  case '568':
  case '668':
  case '1893':
  case '2025':
    title = programme;
    caption = titleCaption;      
    break;  
  case '1069':
    let yyyy, mm, dd;
    [yyyy, mm, dd] = date.split('-');
    title = `${yyyy}${season[parseInt((parseInt(mm) - 1) / 3)]}`;
    caption = titleCaption;      
    break;  
  default:      
    n = titleCaption.indexOf('(');		  
    n = (n === -1) ? titleCaption.indexOf('(') : n;
    if (n === -1) {
      title = titleCaption;
      caption = titleCaption;      
    } else {
      title = titleCaption.substr(0, n);
      caption = titleCaption.substr(n);		  
    }		  
  }
  return [title.trim(), caption];	
};
