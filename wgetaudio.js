const fs = require('fs');
const request = require('request');
const Pid = '287';

function _downloadFile(url, pathName) {
    return new Promise((resolve, reject) => {
        request.head(url, function(){
            request(url).pipe(fs.createWriteStream(pathName))
                .on('close', () => resolve(pathName))
                .on('error', error =>  reject(error))
        });
    })
}

const downloadFiles = pid => {

  const Programme = require('./lib/getProgramme.js')(pid);

  Programme.pages.filter(page => page.broadcast_date === '2020-01-04').forEach(page => {
    const save_to_dir = `${page.broadcast_date}${page.title}`;
    fs.mkdirSync(save_to_dir);
    page.podcasts.forEach((podcast, index) => {
        const url = podcast.url;
        const file = `${(index < 9) ? '0' : ''}${index + 1}${podcast.caption}`;
        console.log('Start download file ', `${index + 1}`); 
        _downloadFile(url, `${save_to_dir}/${file}`)
          .then(p => {
            console.log('Got ', p); })
          .catch(e => {
            console.log(e); });
        });
      });
  };

downloadFiles(Pid);
