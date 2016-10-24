//"use strict";
var alexa = require('alexa-app');
var app = new alexa.app('calagator');
var WhatsHappeningResponder = require('./lib/responders/WhatsHappening');
var BadRequestResponder = require('./lib/responders/BadRequest');
var MoreEventsResponder = require('./lib/responders/MoreEvents');

var TargetDate = require('./lib/TargetDate');
//var TimeParser = require('./lib/TimeParser');
//var Event = require('./lib/Event');
//var EventList = require('./lib/EventList');
//var _ = require('lodash');
//var rp = require('request-promise');

var timekeeper = require('timekeeper');
var sevenEventTime = new Date("2016-10-26T01:48:54+00:00");
timekeeper.freeze(sevenEventTime);

app.dictionary = {
  "days": ["today", "tomorrow"],
  "daysPossesive": ["todays", "tomorrows"],
};

app.intent('MoreEvents',
  {
    'slots':{
      'DESIRE': 'AMAZON.LITERAL' 
    },
    'utterances':[
      "{yes|no|DESIRE}",
      "{yes|DESIRE} tell me more",
      "{yes|DESIRE} list them",
      "tell me more",
      "list them",
    ]
  },
  (request, response) => {
    if(request.session("relativeTargetDay") && (!request.slot('DESIRE') || request.slot('DESIRE') == 'yes' )){
      new MoreEventsResponder(request, response);
      return false;
    }else if(request.slot('DESIRE') == 'no'){
      response.say('Ok.  Goodbye.');
    }else{
      new BadRequestResponder(request, response);
    }

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

    var targetDate = new TargetDate(request.slot('DAY'));

    if(targetDate.isValid()){
      new WhatsHappeningResponder(request, response);
      return false;
    }else{
      new BadRequestResponder(request, response);
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
