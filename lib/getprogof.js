const syncRequest = require('sync-request');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const ProgOfJSONpath = './ProgOf.json';

const pidUrl = page => 
  `https://podcast.rthk.hk/podcast/programmeList.php?type=audio&page=${page}&order=stroke&lang=zh-CN`;

module.exports = () => {
  let ProgOf = {};
  if (fs.existsSync(ProgOfJSONpath)) {
    const rawdata = fs.readFileSync(ProgOfJSONpath);
    ProgOf = JSON.parse(rawdata);
  } else {
    let page = 0; 
    let remainder = '99';
  
    do {
      page = page + 1;
      const res = syncRequest('GET', pidUrl(page));
      const xml = res.getBody('utf8');
      const doc = new dom().parseFromString(xml);
      remainder = xpath.select1('/programmeList/remainder', doc).firstChild.data;
      const links = xpath.select('//link', doc);
      const titles = xpath.select('//title', doc);
      for (let i=0; i < links.length; i++) {
        const pid = /(\d\d*)/.exec(links[i].firstChild.data)[1];
        const title = titles[i].firstChild.data;
        ProgOf[pid] = title;
      }      
    } while ( remainder !== '0');
    fs.writeFileSync(ProgOfJSONpath, JSON.stringify(ProgOf));
  }
  return ProgOf;
};
