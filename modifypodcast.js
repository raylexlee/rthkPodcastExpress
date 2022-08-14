#!/usr/bin/env node
const fs = require('fs');
const pidJSONpath = pid => `./${pid}.json`;

const Pid = '328';
const Programme = require('./lib/getProgramme.js')(Pid);

//  fs.writeFileSync(pidJSONpath(Pid), JSON.stringify(Programme));
