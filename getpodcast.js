const syncRequest = require('sync-request');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');

const episodesUrl = (pid, year, page) =>  
  `https://podcast.rthk.hk/podcast/episodeList.php?pid=${pid}&year=${year}&page=${page}`; 
const yearsUrl = pid => `https://podcast.rthk.hk/podcast/item.php?pid=${pid}`;  

const Pid = '287';

const ProgOf = require('./lib/getprogof.js')();

const years = pid => syncRequest('GET', yearsUrl(pid))
  .getBody('utf8')
  .split('\n')
  .filter(line => /option value=/.test(line))
  .map(line =>  /(\d{4})/.exec(line)[1]);
console.log(ProgOf[Pid]);
years(Pid)
  .forEach(year => {
    let page = 0, remainder = '99';
    do {
      page = page + 1;
      const res = syncRequest('GET', episodesUrl(Pid, year, page));
      const xml = res.getBody('utf8');
      const doc = new dom().parseFromString(xml);
      remainder = xpath.select1('/episodeList/remainder', doc).firstChild.data;
      const titles = xpath.select('//episodeTitle', doc);
      const dates = xpath.select('//episodeDate', doc);
      const audios = xpath.select('//mediafile', doc);
      for (let i = 0; i < titles.length; i++) {
        const title = titles[i].firstChild.data;
        const date = dates[i].firstChild.data;
        const audio = audios[i].firstChild.data;
        console.log(date, ' ', title, ' ', audio);
      }

    } while (remainder !== '0');
  });  