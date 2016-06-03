#!/usr/bin/env node
var fs = require('fs');
var css = require('css');
var obj = JSON.parse(fs.readFileSync('node_modules/caniuse-db/data.json', 'utf8'));
var configFile = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var config = {};

// max browser percentage
var chromeMax = 0.0;
// max browser key
var chromeMaxKey = '';
// keys
var chromeKeys = [];

// iterate specified browser from configFile
for(let browser in configFile) {
  // get browser keys from caniuse
  chromeKeys = Object.keys(obj.agents[browser].usage_global);

  // find key with highest usage percentage
  for(let key in obj.agents[browser].usage_global) {
    if( obj.agents[browser].usage_global[key] > chromeMax ) {
      chromeMax = obj.agents[browser].usage_global[key];
      chromeMaxKey = key;
    }
  }

  // add broser to config
  config[browser] = [];

  // add browser to config based on offset value
  for(var i = configFile[browser] * -1 ; i <= configFile[browser]; i++) {
    config[browser].push((parseInt(chromeMaxKey)+i).toString());
  }
  chromeMax = 0.0;
  var chromeMaxKey = '';
}


// read test.css file and parse
var cssStream = fs.readFileSync('test.css', 'utf8');
cssParse = css.parse(cssStream);

// array for distinct properties and values
var properties = [];
var values = [];

// get distinct properties
cssParse.stylesheet.rules.map(rule => {
  rule.declarations.map(declaration => {
    properties.indexOf(declaration.property) === -1 ? properties.push(declaration.property) : '';
  });
});

// iterate properties
properties.map(property => {
  // iterate config
  for(let key in config) {
    config[key].map( version => {
        // show support for a given broser
        console.log(`${property} supported in ${key}, version ${version}: `, obj.data[property].stats[key][version]);
    });
  }
});
