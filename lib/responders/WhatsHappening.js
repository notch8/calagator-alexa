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

    response.session('relativeTargetDay', request.slot('DAY').toLowerCase());

    var uri = 'https://calagator.org/events.json';
    var options = {
      method: 'GET',
      uri: uri,
      json: true,
      resolveWithFullResponse: true
    };

    rp(options).then((calagator) => {
      var events = calagator.body;
      var targetDate = new TargetDate(request.slot('DAY').toLowerCase());
      var relativeDay = targetDate.relativeDay();
      var eventList = new EventList(events, targetDate);
      var eventCount = eventList.count();

      if(eventCount > 3){
        var numberToListPhrase = "There are " + eventCount + " events " + relativeDay + ".  " +
        "Here are the first 3.";
        var morePrompt = "Would you like to hear more?";
        response.shouldEndSession(false, morePrompt);
      } else if(eventCount == 0){
        var numberToListPhrase = "There are no events " + relativeDay + "."
      } else if(eventCount == 1){
        var numberToListPhrase = "There is " + eventCount + " event " + relativeDay + "." 
      }else{
        var numberToListPhrase = "There are " + eventCount + " events " + relativeDay + "." 
      };

      var eventDescriptions = eventList.events().map( (attrs) => { 
        var event = new Event(attrs);
        return event.verbalized() 
      });

      var voiceContent = _.flatten([
        numberToListPhrase,
        eventDescriptions
      ]);

      if(morePrompt){
        voiceContent.push(morePrompt);
      };

      voiceContent.forEach((snippet) =>{
        response.say(snippet);
      });

      let cardSubTitle = 'There are ' + eventCount + ' events ' + relativeDay + ".\n";
      let card = new EventCard(eventList.events(), cardSubTitle);
      card.send(response);
      response.send();
    });
  }
}

module.exports = WhatsHappening;
