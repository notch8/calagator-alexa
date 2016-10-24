"use strict";
var fs = require("fs");
var path = require("path");

class MockHelper{
  load(mockFile) {
    var fixturePath = path.join(__dirname, "../fixtures");
    return JSON.parse(fs.readFileSync( fixturePath+ "/" + mockFile, "utf8"));
  }
};

module.exports = new MockHelper();
