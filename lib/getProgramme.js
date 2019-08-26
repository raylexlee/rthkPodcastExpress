const fs = require('fs');

module.exports = pid => {
  const pidJSONpath = pid => `./${pid}.json`;
  let Programme = {
    name: '',
    latest: '1900-01-01',
    pages: [],
    years: []	  
  };
  if (fs.existsSync(pidJSONpath(pid))) {
    const rawdata = fs.readFileSync(pidJSONpath(pid));
    Programme = JSON.parse(rawdata);
  } 
  return Programme;
};
