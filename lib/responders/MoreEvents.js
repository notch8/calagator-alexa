"use strict";

var TargetDate = require('../TargetDate');
var TimeParser = require('../TimeParser');
var Event = require('../Event');
var EventList = require('../EventList');
var _ = require('lodash');
var rp = require('request-promise');

class MoreEvents{
  constructor(request, response){
    this.request = request;
    this.response = response;
    this.targetDate = new TargetDate(request.session("relativeTargetDay"));

    this.events().then((events)=>{
      let eventList = new EventList(events, this.targetDate, true);
      this.sayEvents(eventList);
    });
  }
  
  sayEvents(eventList){
    var eventCount = eventList.count() - 3;

    var eventDescriptions = eventList.events().map( (attrs) => { 
      var event = new Event(attrs);
      return event.verbalized() 
    });

    var voiceContent = _.flatten([
      "Ok, there are " + eventCount + " more.",
      eventDescriptions
    ]);

    voiceContent.forEach((snippet) =>{
      this.response.say(snippet);
    });
    this.response.send();
  }

  events(){
    var uri = 'https://calagator.org/events.json';
    var options = {
      method: 'GET',
      uri: uri,
      json: true,
      resolveWithFullResponse: true
    };
    return rp(options).then((response)=> response.body);
  }
}

module.exports = MoreEvents
