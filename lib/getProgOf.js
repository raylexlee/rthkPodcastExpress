const fs = require('fs');
const ProgOfJSONpath = './ProgOf.json';

module.exports = () => {
  let ProgOf = {};
  if (fs.existsSync(ProgOfJSONpath)) {
    const rawdata = fs.readFileSync(ProgOfJSONpath);
    ProgOf = JSON.parse(rawdata);
  } else {
    const proglist = fs.readFileSync('./proglist.txt', {encoding:'utf8', flag:'r'}).replace(/\n+$/, "").split('\n')
    proglist.map(pidTitle => {
      const [pid,title]=pidTitle.split(' ');
      ProgOf[pid] = title;
    });
    fs.writeFileSync(ProgOfJSONpath, JSON.stringify(ProgOf));
  }
  return ProgOf;
};
