"use strict";
var tz = require('timezone/loaded');
var _ = require('lodash');

var TimeParser = function(){};

TimeParser.prototype.parse = function(input){
  var rawTime = tz(input);
  return tz(rawTime, '%r', 'en_US', 'America/Los_Angeles').trim();
};

TimeParser.prototype.dateForRelativeDay = function(relativeDay){
  switch (relativeDay) {
    case "today":
      return this.today();
    case "tomorrow":
      return this.tomorrow();
    case "todays":
      return this.today();
    case "tomorrows":
      return this.tomorrow();
  };
};

TimeParser.prototype.today = function(){
  return new Date();
};

TimeParser.prototype.tomorrow = function(){
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
};

module.exports = TimeParser;
