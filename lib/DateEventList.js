"use strict";
var _ = require('lodash');
var moment = require('moment');

class DateEventList{
  constructor(events, targetDate, listRemaining){
    this.targetDate = targetDate;
    this.allEvents = events;
    this.listRemaining = listRemaining;
  }

  count(){
    return this.filteredForDate().length;
  }

  events(){
    if(this.listRemaining){
      var offset = 3;
    }else{
      var offset = 0;
      var limit = 3
    };

    var events = this.filteredForDate()
    if(limit){
      return _.slice(events, offset, limit);
    }else{
      return _.slice(events, offset);
    }
  }

  filteredForDate(){
    var self = this;
    return this.allEvents.filter( (event) => {
      var starts = moment.parseZone(event.start_time);
      return starts.isBefore(self.targetDate.endOfDay()) && starts.isAfter(self.targetDate.beginningOfDay());
    });
  }
}

module.exports = DateEventList;
