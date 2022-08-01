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
    title = title.trim();
    title = ( title ===  '彼得大帝') ?  '彼德大帝' : title;		  
    caption = titleCaption.substr(n);		  
    break;  
  case '336':
  case '568':
  case '668':
  case '1893':
  case '2025':
  case '1069':
  default:      
    title = programme;
    caption = titleCaption;      
  }
  return [title.trim(), caption];	
};
