#!/usr/bin/env node
const fs = require('fs');
const { JSDOM } = require('jsdom');

// Get the filename from command-line arguments
const fileName = process.argv[2];

if (!fileName) {
  console.error('Please provide an HTML file as an argument.');
  process.exit(1);
}

// Read the HTML file
const html = fs.readFileSync(fileName, 'utf-8');

// Create a DOM from the HTML content
const dom = new JSDOM(html);
const document = dom.window.document;

// Use getElementsByTagName
const divs = document.getElementsByTagName('div');
const j = {};
for (let div of divs) {
  const a = div.textContent.split('\n').filter(e => e.length>4)
              .map(e => e.replace(/^ */,''));
  j[a[0]] = a.slice(1).join('，');
}
console.log(j);

