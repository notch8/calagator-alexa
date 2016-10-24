//"use strict";
var alexa = require('alexa-app');
var app = new alexa.app('calagator');
var WhatsHappeningResponder = require('./lib/responders/WhatsHappening');

var TargetDate = require('./lib/TargetDate');
var TimeParser = require('./lib/TimeParser');
var Event = require('./lib/Event');
var EventList = require('./lib/EventList');
var _ = require('lodash');
var rp = require('request-promise');

var timekeeper = require('timekeeper');
var sevenEventTime = new Date("2016-10-26T01:48:54+00:00");
timekeeper.freeze(sevenEventTime);

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
      'DAY': 'AMAZON.LITERAL',
      'EVENT_FILTER': 'AMAZON.LITERAL'
    },
    'utterances':[
      "{to list |to tell me |}what is happening {days|DAY}",
      "{to list |to tell me |}what {EVENT_FILTER} events are {days|DAY}",
      "{to list |to tell me |}what is on the calendar {days|DAY}",
      "{to list |to tell me |}what is on {daysPossesive|DAY} calendar"
    ]
  },
  (request, response) => {

    var targetDate = new TargetDate(request.slot('DAY'));

    if(targetDate.isValid()){
      new WhatsHappeningResponder(request, response);
      return false;
    }else{
      response.say("I'm sorry.  I didn't understand your request.  You can ask me about today or tomorrow.");
    }
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
