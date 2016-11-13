"use strict";

var TargetDate = require('../TargetDate');
var TimeParser = require('../TimeParser');
var Event = require('../Event');
var EventList = require('../EventList');
var _ = require('lodash');
var rp = require('request-promise');

class MoreEvents{
  constructor(request, response){
    var uri = 'https://calagator.org/events.json';
    var options = {
      method: 'GET',
      uri: uri,
      json: true,
      resolveWithFullResponse: true
    };

    rp(options).then((calagator) => {


      var events = calagator.body;
      var targetDate = new TargetDate(request.session("relativeTargetDay"));
      var relativeDay = targetDate.relativeDay();
      var eventList = new EventList(events, targetDate, true);
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
        response.say(snippet);
      });
      response.send();
    });
  }
}

module.exports = MoreEvents
