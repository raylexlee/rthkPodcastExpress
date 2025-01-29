#!/usr/bin/env node
const fs = require('fs');
const pidJSONpath = pid => `./${pid}.json`;
const txtPath = title => `./person/${title}.txt`;
const Pid = '287';
//const Pid = process.argv[2];
const rawdata = fs.readFileSync(pidJSONpath(Pid));
const People = JSON.parse(rawdata);
console.log(People.pages.map(e => `${e.broadcast_date} ${e.title}`).join('\n'));
