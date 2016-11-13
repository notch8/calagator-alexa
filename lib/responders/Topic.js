"use strict";
var BaseResponder = require('./BaseResponder');
var Event = require('../Event');
var TopicEventList = require('../TopicEventList');
var EventCard = require('../EventCard');
var moment = require('moment-timezone');
var _ = require('lodash');

class Topic extends BaseResponder{
  constructor(request, response){
    super(request, response);
    this.topic = request.slot('TOPIC');
    this.reprompt = 'Would you like to hear more? You can say "yes" or "no".';
    this.process();
  }

  eventList(rawEvents){
    return new TopicEventList(rawEvents, this.topic)
  }

  setPrefix(eventList){
    let count = eventList.count()
    if(count > 3){
      this.voiceContent.push(`There are ${count} upcoming events this week. Here are the first 3.`);
    } else if(count == 0){
      this.voiceContent.push("There are no events matching your request this week.");
    }else if(count == 1){
     this.voiceContent.push(`There is 1 matching event this week.`);
    }else{
      this.voiceContent.push(`There are ${count} upcoming events this week.`);
    }
  }

  setPostfix(eventList){
    let count = eventList.events().length
    if( count == 1){
      this.voiceContent.push(`I added it to a card in the Alexa app.`);
    }else if(count > 1){
      this.voiceContent.push(`I added them to a card in the Alexa app.`);
    }

    if(eventList.count() > 3){
      this.voiceContent.push(`Would you like to hear more?`);
    }
  }
  
  sayEvents(events){
    events.forEach((params)=>{
      let event = new Event(params)
      this.voiceContent.push(event.verbalized(true));
    });
  }

  cardForEvents(events){
    let cardSubTitle = `Upcoming events related to ${this.topic}`;
    let card = new EventCard(events, cardSubTitle);
    card.send(this.response);
  }
}

module.exports = Topic;
