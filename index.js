//"use strict";
var alexa = require('alexa-app');
var app = new alexa.app('calagator');
var TargetDate = require('./lib/TargetDate');
var TimeParser = require('./lib/TimeParser');
var Event = require('./lib/Event');
var EventList = require('./lib/EventList');
var _ = require('lodash');
var rp = require('request-promise');

app.dictionary = {
  "days": ["today", "tomorrow"],
  "daysPossesive": ["todays", "tomorrows"],
};

app.intent('MoreEvents',
  {
    'utterances':[
      "yes",
      "{yes|}tell me more",
      "{yes|}list them"
    ]
  },
  (request, response) => {
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
 
    return false;
  }
);

app.intent('WhatsHappening',
  {
    'slots':{
      'DAY': 'AMAZON.LITERAL'
    },
    'utterances':[
      "{to list |to tell me |}what is happening {days|DAY}",
      "{to list |to tell me |}what events are {days|DAY}",
      "{to list |to tell me |}what is on the calendar {days|DAY}",
      "{to list |to tell me |}what is on {daysPossesive|DAY} calendar"
    ]
  },
  (request, response) => {

    response.session('relativeTargetDay', request.slot('DAY'));

    var uri = 'https://calagator.org/events.json';
    var options = {
      method: 'GET',
      uri: uri,
      json: true,
      resolveWithFullResponse: true
    };

    rp(options).then((calagator) => {


      var events = calagator.body;
      var targetDate = new TargetDate(request.slot('DAY'));
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

      var cardDescriptions = eventList.events().map( (attrs) => { 
        var event = new Event(attrs);
        return event.asCard() 
      });
 
      var cardContent = _.flatten([
        //eventList.debug(),
        'There are ' + eventCount + ' events ' + relativeDay + ".\n" + 
        cardDescriptions.join("\n") //add extra newline inbetween events
      ]);

      response.card({
        type: 'Simple',
        title: 'Tech events ' + relativeDay,
        content: cardContent.join("\n")
      });

      response.send();
    });
 
    return false;
  }
);

app.intent('AMAZON.HelpIntent', 
  {
    'utterances':[
      "for help {customizing|setting up|getting started}"
    ]
  },
  (request, response) => {
    response.say("To use the Calagator skill, you can ask me what is happening today or tomorrow.");
    response.say("Or ask about upcoming events.");
    response.say("For example, Tell me about upcoming networking events.");
    response.say("I have added a card to the Alexa app listing more things I understand.");

    var questions = [
      "What is happening today?",
      "What is happening tomorrow?"
    ];
    response.card({
      type: 'Simple',
      title: 'Calagator Help',
      content: "Here are some questions you can ask me:\n" + questions.join("\n")
    });
  }
);

app.error = (exception, request, response) => {
    response.say("Sorry, something bad happened");
};

module.exports = app;
