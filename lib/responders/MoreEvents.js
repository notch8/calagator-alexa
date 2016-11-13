"use strict";

var BaseResponder = require('./BaseResponder');
var TargetDate = require('../TargetDate');
var TimeParser = require('../TimeParser');
var Event = require('../Event');
var DateEventList = require('../DateEventList');
var _ = require('lodash');
var rp = require('request-promise');

class MoreEvents extends BaseResponder{
  constructor(request, response){
    super(request, response);
    if(request.session("relativeTargetDay")){
      this.targetDate = new TargetDate(request.session("relativeTargetDay"));
    }else if(request.session('topic')){
      this.topic = request.session('topic'); 
    }
    this.process();
  }

  eventList(rawEvents){
    if(this.targetDate){
      return new DateEventList(rawEvents, this.targetDate, true);
    }else if(this.topic){
      return new TopicEventList(rawEvents, this.topic, true);
    }
  }

  setPrefix(eventList){
    let count = eventList.count() - 3;
    this.voiceContent.push(`Ok, there are ${count} more.`);
  }

  sayEvents(events){
    this.voiceContent.push(events.map( (attrs) => { 
      var event = new Event(attrs);
      return event.verbalized() 
    }));
  }

  setPostfix(){}
  cardForEvents(){}
  
}

module.exports = MoreEvents
