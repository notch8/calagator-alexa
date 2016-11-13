"use strict";

var TargetDate = require('../TargetDate');
var TimeParser = require('../TimeParser');
var Event = require('../Event');
var EventList = require('../EventList');
var EventCard = require('../EventCard');
var _ = require('lodash');
var rp = require('request-promise');

class WhatsHappening{
  constructor(request, response){
    this.request = request;
    this.response = response;
    this.targetDate = new TargetDate(request.slot('DAY').toLowerCase());
    this.relativeDay = this.targetDate.relativeDay();
    
    this.events().then((rawEvents)=>{
      let eventList = new EventList(rawEvents, this.targetDate);
      this.sayEvents(eventList);
      this.cardForEvents(eventList);
    }) ;
  }

  sayEvents(eventList){
    let eventCount = eventList.count();
    let eventDescriptions = eventList.events().map( (attrs) => { 
      let event = new Event(attrs);
      return event.verbalized() 
    });

    let voiceContent = _.flatten([
      this.numberToListPhrase(eventCount),
      eventDescriptions
    ]);

    if(eventCount > 3){
      let morePrompt = "Would you like to hear more?";
      this.response.shouldEndSession(false, morePrompt);
      voiceContent.push(morePrompt);
    };

    voiceContent.forEach((snippet) =>{
      this.response.say(snippet);
    });
  }

  numberToListPhrase(eventCount){
    if(eventCount > 3){
      return "There are " + eventCount + " events " + this.relativeDay + ".  " +
      "Here are the first 3.";
    } else if(eventCount == 0){
      return "There are no events " + this.relativeDay + "."
    } else if(eventCount == 1){
      return "There is " + eventCount + " event " + this.relativeDay + "." 
    }else{
      return "There are " + eventCount + " events " + this.relativeDay + "." 
    };
  }

  cardForEvents(eventList){
    let eventCount = eventList.count();
    let cardSubTitle = 'There are ' + eventCount + ' events ' + this.relativeDay + ".\n";
    let card = new EventCard(eventList.events(), cardSubTitle);
    card.send(this.response);
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

module.exports = WhatsHappening;
