"use strict";
var HumanDatetime = require('./HumanDatetime');
var _ = require('lodash');

class Event{
  constructor(attrs){
    this.attrs = attrs;
  }

  verbalized(){
    return [
      "At " + this.startTime().asHearableTime(),
      _.trimEnd(this.title(), '.') + '.',
      ].join(", ");
  }

  asCard(){
    return [
      this.title(),
      "Starts At: " + this.startTime().asReadableTime(),
      this.address()
    ].join("\n");
  }

  title(){
    return this.attrs.title;
  }
  
  startTime(){
    var start = new Date(this.attrs.start_time);  
    return new HumanDatetime(start);
  }

  address(){
    if(this.attrs.venue){
      return this.attrs.venue.address;
    };
  }
}

module.exports = Event;
