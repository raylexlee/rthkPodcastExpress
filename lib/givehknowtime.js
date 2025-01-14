#!/usr/bin/env node
const moment = require('moment');
moment.locale('zh-hk');
console.log( `最後更新於香港時間${moment().format('LLLL')}`);
