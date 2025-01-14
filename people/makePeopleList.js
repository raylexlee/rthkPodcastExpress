#!/usr/bin/env node
const fs = require('fs');
const pidJSONpath = pid => `./${pid}.json`;
const txtPath = title => `./person/${title}.txt`;
const Pid = '287';
//const Pid = process.argv[2];
const rawdata = fs.readFileSync(pidJSONpath(Pid));
const People = JSON.parse(rawdata);
People.pages.forEach(person => {
  const cover = person.podcasts.map((e,i) => String(i+1).padStart(3,'0')+' '+e.caption+' '+e.eid).join('\n');
  fs.writeFileSync(txtPath(person.title), cover);  
});
