"use strict";
var fs        = require("fs");
var path      = require("path");
const workers  = [];

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    console.log(file);
    const worker = require(path.join(__dirname, file));
    workers.push(worker);
  });

module.exports = workers;
