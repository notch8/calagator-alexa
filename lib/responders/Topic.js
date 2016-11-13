"use strict";
var Event = require('../Event');
var EventCard = require('../EventCard');
var _ = require('lodash');
var rp = require('request-promise');

class Topic{
  constructor(request, response){
    this.request = request;
    this.response = response;
    this.topic = request.slot('TOPIC');

    var uri = 'https://calagator.org/events.json';
    var options = {
      method: 'GET',
      uri: uri,
      json: true,
      resolveWithFullResponse: true
    };

    rp(options).then((calagator) => {
      var events = calagator.body;
      let voiceContent = [];

      let expression = new RegExp(this.topic, 'i');
      let matchingEvents = events.filter((event)=>{
        return expression.test(event.title);
      });

      matchingEvents.forEach((params)=>{
        let event = new Event(params)
        voiceContent.push(event.verbalized(true));
      });

      if(matchingEvents.length > 0){
        if(matchingEvents.length == 1){
          response.say(`I found 1 upcoming event.`);
        }else{
          response.say(`I found ${matchingEvents.length} upcoming events.`);
        }

        voiceContent.forEach((snippet) =>{
          response.say(snippet);
        });
        if(matchingEvents.length == 1){
          response.say(`I added it to a card in the Alexa app.`);
        }else{
          response.say(`I added them to a card in the Alexa app.`);
        }

        let cardSubTitle = `Upcoming events related to ${this.topic}`;
        let card = new EventCard(matchingEvents, cardSubTitle);
        card.send(response);
      } else {
        response.say("I didn't find any events matching your request.");
      }
      response.send();
    });
  }

  descriptionForEvent(event) {
    return event.title;
  } 
}

module.exports = Topic;
