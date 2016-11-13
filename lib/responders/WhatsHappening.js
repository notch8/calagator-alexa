"use strict";

var BaseResponder = require('./BaseResponder');
var TargetDate = require('../TargetDate');
var TimeParser = require('../TimeParser');
var Event = require('../Event');
var DateEventList = require('../DateEventList');
var EventCard = require('../EventCard');
var _ = require('lodash');
var rp = require('request-promise');

class WhatsHappening extends BaseResponder{
  constructor(request, response){
    super(request, response);
    this.targetDate = new TargetDate(request.slot('DAY').toLowerCase());
    this.relativeDay = this.targetDate.relativeDay();
    this.reprompt = 'Would you like to hear more? You can say "yes" or "no".';
    this.process(); 
  }

  eventList(rawEvents){
    return new DateEventList(rawEvents, this.targetDate);
  }

  sayEvents(events){
    let eventCount = events.length;
    let eventDescriptions = events.map( (attrs) => { 
      let event = new Event(attrs);
      return event.verbalized() 
    });

    this.voiceContent.push(eventDescriptions);
  }

  setPrefix(eventList){
    let eventCount = eventList.count();
    if(eventCount > 3){
      this.voiceContent.push("There are " + eventCount + " events " + this.relativeDay + ".  " +
      "Here are the first 3.");
    } else if(eventCount == 0){
      this.voiceContent.push("There are no events " + this.relativeDay + ".")
    } else if(eventCount == 1){
      this.voiceContent.push("There is " + eventCount + " event " + this.relativeDay + ".")
    }else{
      this.voiceContent.push("There are " + eventCount + " events " + this.relativeDay + "."); 
    };
  }

  setPostfix(eventList){
    let count = eventList.events().length;
    if(count == 1){
      this.voiceContent.push(`I added it to a card in the Alexa app.`);
    }else if(count > 1){
      this.voiceContent.push(`I added them to a card in the Alexa app.`);
    }

    if(eventList.count() > 3){
      this.voiceContent.push(`Would you like to hear more?`);
    }
  }

  cardForEvents(events){
    let eventCount = events.length;
    let cardSubTitle = 'There are ' + eventCount + ' events ' + this.relativeDay + ".\n";
    let card = new EventCard(events, cardSubTitle);
    card.send(this.response);
  }
}

module.exports = WhatsHappening;
