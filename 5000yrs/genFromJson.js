#!/usr/bin/env node
const array = require('./array.json');
const j = array.map(e => `${e.href} ${e.title}`).join('\n');
console.log(j);
