"use strict";
var _ = require('lodash');
var moment = require('moment');

class EventList{
  constructor(events, targetDate){
    this.targetDate = targetDate;
    this.allEvents = events;
  }

  debug(){
    var events = _.slice(this.allEvents, 0, 5).map((event)=>{
      return event.id + ": " +moment.parseZone(event.start_time).format() 
    }).join(".\n  ");
    var content = "Debugging.\nTarget: " + 
      this.targetDate.relativeDate.format() + "\n" +
      "now: " + moment().format() + "\n" +
      "start: " + this.targetDate.beginningOfDay().format() + "\n" +
      "end: " + this.targetDate.endOfDay().format() + "\n\n" + 
      "First 5 events\n" + events;
    return content;
  } 

  count(){
    return this.filteredForDate().length;
  }

  events(offset){
    offset = offset || 0
    var events = this.filteredForDate()
    return _.slice(events, offset, offset +3);
  }

  filteredForDate(){
    var self = this;
    return this.allEvents.filter( (event) => {
      var starts = moment.parseZone(event.start_time);
      return starts.isBefore(self.targetDate.endOfDay()) && starts.isAfter(self.targetDate.beginningOfDay());
    });
  }
}

module.exports = EventList;
