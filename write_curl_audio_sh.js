#!/usr/bin/env node
const fs = require('fs');
const request = require('request');

//const Pid = '287';
const Pid = process.argv[2];
const sh_str = pid => {

  const Programme = require('./lib/getProgramme.js')(pid);

  const wget_str = Programme.pages.map(page => {
    const save_to_dir = page.title;
    return `mkdir ${save_to_dir}\n` +
      page.podcasts.map((podcast, index) => {
        const url = podcast.url;
        const ext = url.slice(-3);
        const file = `${(index < 9) ? '0' : ''}${index + 1}${podcast.caption.replace(/\//g,'_').replace(/\s/g, '\\ ').replace(/\(/g, '\\(').replace(/\)/g, '\\)')}.${ext}`;
        return `curl -s -o ${save_to_dir}/${file} ${url}`;
        }).join('\n');
      }).join('\n');
  return `mkdir ${Programme.name}\ncd ${Programme.name}\n${wget_str}`;
  };

fs.writeFileSync(`${Pid}.sh`, sh_str(Pid));
