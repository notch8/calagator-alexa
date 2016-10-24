"use strict";
var tz = require('timezone/loaded');

class HumanDatetime{
  constructor(targetDatetime){
    this.targetDatetime = targetDatetime;
  }

  asHearableDate(){
    return tz(this.targetDatetime, '%D', 'en_US', 'America/Los_Angeles').trim();
  }

  asHearableTime(){
    return tz(this.targetDatetime, '%r', 'en_US', 'America/Los_Angeles').trim();
  }

  asReadableTime(){
    return tz(this.targetDatetime, '%l:%M %p', 'en_US', 'America/Los_Angeles').trim();
  }
};

module.exports = HumanDatetime;