"use strict";

var _ = require('lodash');
var rp = require('request-promise');

class BaseResponder{
  constructor(request, response){
    this.eventUri = 'https://calagator.org/events.json';
    this.voiceContent = [];
    this.request = request;
    this.response = response;
  }
  
  process(listRemaining){
    this.getEvents().then((rawEvents)=>{
      let eventList = this.eventList(rawEvents)
      let events = eventList.events();
      this.setPrefix(eventList);
      this.sayEvents(events);
      this.setPostfix(events);
      this.cardForEvents(events);
      this.verbalize();
      this.setReprompt(eventList);
      this.response.send();
    }) ;

  }

  verbalize(){
    _.flatten(this.voiceContent).forEach((snippet) =>{
      this.response.say(snippet);
    });

  }

  setReprompt(eventList){
    if(this.reprompt){
      if(eventList.count() > 3){
        this.response.shouldEndSession(false, this.reprompt);
      };
    }
  }

  getEvents(){
    var options = {
      method: 'GET',
      uri: this.eventUri,
      json: true,
      resolveWithFullResponse: true
    };
    return rp(options).then((response)=> response.body);
  }

  eventList(rawEvents){
    throw "Abstract eventList called in base class.  Must be overrideen";
  }

  setPrefix(){
    throw "Abstract setPrefix called in base class.  Must be overridden";
  }
  sayEvents(){
    throw "Abstract sayEvents called in base class.  Must be overridden";
  }
  setPostfix(){
    throw "Abstract setPostfix called in base class.  Must be overridden";
  }

  cardForEvents(){
    throw "Abstract cardForEvents called in base class.  Must be overridden";
  }
}

module.exports = BaseResponder;
