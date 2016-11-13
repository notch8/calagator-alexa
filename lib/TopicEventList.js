"use strict";
var _ = require('lodash');
var moment = require('moment');

class TopicEventList{
  constructor(events, topic, listRemaining){
    this.topic = topic;
    this.allEvents = events;
    this.listRemaining = listRemaining;
  }

  count(){
    return this.filteredForTopic().length;
  }

  events(){
    if(this.listRemaining){
      var offset = 3;
    }else{
      var offset = 0;
      var limit = 3
    };

    var events = this.filteredForTopic()
    if(limit){
      return _.slice(events, offset, limit);
    }else{
      return _.slice(events, offset);
    }
  }

  filteredForTopic(){
    let expression = new RegExp(this.topic, 'i');
    let weekFromToday = moment().day(7).tz('America/Los_Angeles');
    return this.allEvents.filter((event)=>{
      return expression.test(event.title) && weekFromToday.isAfter(event.start_time)
    });
  }
}

module.exports = TopicEventList;
