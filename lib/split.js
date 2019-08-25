module.exports = (titleCaption, pid) => {
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
  default:      
    n = titleCaption.indexOf('(');		  
    n = (n === -1) ? titleCaption.indexOf('(') : n;
    if (n === -1) {
      title = titleCaption;
      caption = titleCaption;      
    } else {
      title = titleCaption.substr(0, n-1);
      caption = titleCaption.substr(n);		  
    }		  
  }
  return [title.trim(), caption];	
};