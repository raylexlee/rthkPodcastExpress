const moment = require('moment');
moment.locale('zh-hk');
module.exports = () => `最後更新於香港時間${moment().format('LLLL')}`;