const syncRequest = require('sync-request');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require('fs');
const pidJSONpath = pid => `./${pid}.json`;
const split = require('./lib/split.js');

const episodesUrl = (pid, year, p) =>  
  `https://podcast.rthk.hk/podcast/episodeList.php?pid=${pid}&year=${year}&page=${p}`; 
const yearsUrl = pid => `https://podcast.rthk.hk/podcast/item.php?pid=${pid}`;  

const Pid = '287';

const ProgOf = require('./lib/getprogof.js')();
const Programme = require('./lib/getProgramme.js')(Pid);
if (Programme['latest'] === '1900-01-01') {
  Programme['name'] = ProgOf[Pid];
}
const lastLatest = Programme['latest'];

const updateProgramme = (date, titleCaptions, audio) => {
  const [title, caption] = split(titleCaptions, Pid);
  const getPageIndex = title => {
    for (let i = 0; i < Programme['pages'].length; i++) {
      if (Programme['pages'][i]['title'] === title) return i;
    }
    const page = {
      broadcast_date: '',
      title: title,
      episodes: 0,
      podcasts: []
    };
    Programme['pages'].unshift(page);
    return 0;
  };
  const pageIndex = getPageIndex(title);
  const episode = {caption: caption, url: audio};
  Programme['pages'][pageIndex]['broadcast_date'] = date;
  Programme['pages'][pageIndex]['podcasts'].unshift(episode);
  Programme['pages'][pageIndex]['episodes']++;     
};

const years = pid => syncRequest('GET', yearsUrl(pid))
  .getBody('utf8')
  .split('\n')
  .filter(line => /option value=/.test(line))
  .map(line =>  /(\d{4})/.exec(line)[1]);
let hasNewEpisode = false;

years(Pid).filter(yr => (yr >= lastLatest.substr(0,4)))
  .forEach(year => {
    let p = 0, remainder = '99';
    do {
      p = p + 1;
      const res = syncRequest('GET', episodesUrl(Pid, year, p));
      const xml = res.getBody('utf8');
      const doc = new dom().parseFromString(xml);
      remainder = xpath.select1('/episodeList/remainder', doc).firstChild.data;
      const dates = xpath.select('//episodeDate', doc);
      const titleCaptions = xpath.select('//episodeTitle', doc);
      const audios = xpath.select('//mediafile', doc);
      for (let i = 0; i < titleCaptions.length; i++) {
        const date = dates[i].firstChild.data;
        if (date <= lastLatest) break;
        if (!hasNewEpisode) hasNewEpisode = true;
        if (Programme['latest'] === lastLatest) Programme['latest'] = date;
        
        const titleCaption = titleCaptions[i].firstChild.data;
        const audio = audios[i].firstChild.data;
        updateProgramme(date, titleCaption, audio);
        
        console.log(date, ' ', titleCaption, ' ', audio);
      }
    } while (remainder !== '0');
  });

if (hasNewEpisode) {
  Programme['pages'].sort((a, b) => {
    const A = a.broadcast_date, B = b.broadcast_date;
    return (A < B) ? -1 : ((A > B) ? 1 : 0); 
  });
  let prgYear = {
    name: '',
    podcasts: []
  };
  Programme['pages'].forEach(page => {
    const podcast = {
      title: page['title'],
      episodes: page['episodes']
    };
    if (prgYear['name'] !== page['broadcast_date'].substr(0,4)) {
      if (prgYear['name'].length > 0) {
        Programme['years'].push(prgYear);
      }
      prgYear = {name: page['broadcast_date'].substr(0,4), podcasts: [ podcast ]};
    } else {
      prgYear['podcasts'].push(podcast);
    }
  });
  Programme['years'].push(prgYear);
  fs.writeFileSync(pidJSONpath(Pid), JSON.stringify(Programme));
}  