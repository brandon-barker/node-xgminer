(x)gminer
============

## Purpose

(x)gminer is a node module which provides an API client for cgminer / sgminer / bfgminer.

It's currently focused on scrypt only commands and targeted against cgminer 3.7.2. 

Although ASIC / FPGA commands may work, they have not been tested

## Current Status

This module was developed for [nodeminer](https://github.com/brandon-barker/nodeminer), a Web UI for mining scrypt based cryptocurrencies, but will be developed and maintained seperately to provide more usability for the community.

## Features

* cgminer / bfgminer / sgminer support
* Supports all scrypt based API commands
* Promise (q) library

## Supported API Commands

For a list of supported API commands take a look at the [commands.json](https://github.com/brandon-barker/node-xgminer/blob/master/lib/config/commands.json) file (proper wiki/documentation coming soon)

## Installation

via [npm](http://github.com/isaacs/npm):
```
npm install xgminer
```
Manually:
```
git clone git://github.com/brandon-barker/node-xgminer.git xgminer
```

## Examples

Connect to cgminer API and return a 'summary'
```javascript
var xgminer = require('xgminer');

var client = new xgminer(host, port);

client.summary().then(function (data) {
  console.log(data);
}, function (err) {
  // an error occurred
});
```

Connect to cgminer API and disable GPU 0
```javascript
var xgminer = require('xgminer');

var client = new xgminer(host, port);

client.gpudisable('0').then(function (data) {
  console.log(data);
}, function (err) {
  // an error occurred
});
```

Connect to cgminer API and zero all stats
```javascript
var xgminer = require('xgminer');

var client = new xgminer(host, port);

client.zero('all,true').then(function (data) {
  console.log(data);
}, function (err) {
  // an error occurred
});
```
