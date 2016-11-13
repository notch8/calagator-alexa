"use strict";
var tz = require('timezone/loaded');

class HumanDatetime{
  constructor(targetDatetime){
    this.targetDatetime = targetDatetime;
  }

  asHearableDate(){
    return tz(this.targetDatetime, '%D', 'en_US', 'America/Los_Angeles').trim();
  }

  asHearableTime(includeDay){
    if(includeDay){
      return tz(this.targetDatetime, '%r %A', 'en_US', 'America/Los_Angeles').trim();
    }else{
      return tz(this.targetDatetime, '%r', 'en_US', 'America/Los_Angeles').trim();
    }
  }

  asReadableTime(){
    return tz(this.targetDatetime, '%A %l:%M %p', 'en_US', 'America/Los_Angeles').trim();
  }
};

module.exports = HumanDatetime;
