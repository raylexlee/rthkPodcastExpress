#!/usr/bin/env node
//Usage ./get287Podcast.js
//would generate 287.json from 287.txt
const fs = require('fs');
const pidJSONpath = pid => `./${pid}.json`;
const split = require('../lib/split.js');

const Pid = '287';
//const Pid = process.argv[2];

const ProgOf = require('../lib/getProgOf.js')();
const Programme = {
    name: ProgOf[Pid],
    latest: '1900-01-01',
    pages: [],
    years: []	  
  };
const lastLatest = Programme['latest'];

const updateProgramme = (date, titleCaptions, audio, eid) => {
  const [title, caption] = split(date, titleCaptions, Pid, ProgOf[Pid]);
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
  const episode = {caption: caption, url: audio, eid: eid};
  Programme['pages'][pageIndex]['broadcast_date'] = date;
  Programme['pages'][pageIndex]['podcasts'].unshift(episode);
  Programme['pages'][pageIndex]['episodes']++;     
};

let hasNewEpisode = false;
const dtm = fs.readFileSync(`./${Pid}.txt`, {encoding:'utf8', flag:'r'}).replace(/\n+$/, "").split('\n');

dtm.forEach(e => {
  [date, titleCaption, audio, eid] = e.split(' '); 
   if (!hasNewEpisode) hasNewEpisode = true;
   if (Programme['latest'] === lastLatest) Programme['latest'] = date;
   updateProgramme(date, titleCaption.replace(/_/g, ' '), audio, eid);
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
