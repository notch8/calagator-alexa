//"use strict";
var alexa = require('alexa-app');
var app = new alexa.app('calagator');
var WhatsHappeningResponder = require('./lib/responders/WhatsHappening');
var BadRequestResponder = require('./lib/responders/BadRequest');
var MoreEventsResponder = require('./lib/responders/MoreEvents');
var TopicResponder = require('./lib/responders/Topic');

var TargetDate = require('./lib/TargetDate');

//var timekeeper = require('timekeeper');
//var sevenEventTime = new Date("2016-10-26T01:48:54+00:00");
//timekeeper.freeze(sevenEventTime);

app.dictionary = {
  "days": ["today", "tomorrow"],
  "daysPossesive": ["todays", "tomorrows"],
};

app.intent('MoreEvents',
  {
    'slots':{
      'DESIRE': 'DesireSlot' 
    },
    'utterances':[
      "{-|DESIRE}",
      "{-|DESIRE} tell me more",
      "{-|DESIRE} list them",
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
      'DAY': 'DaySlot'
    },
    'utterances':[
      "for {events|meetups|meetings} {on|} {-|DAY}",
      "to give me {all|all the|the|} {events|meetups|meetings} {on|} {-|DAY}",
      "{to list |to tell me |}what is happening {on|} {-|DAY}",
      "{to list |to tell me |}what events are {on|} {-|DAY}",
      "{to list |to tell me |}what is on the calendar {-|DAY}",
      "{to list |to tell me |}what is on {-|DAY} {calendar|}"
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

app.intent('TopicEvents',
  {
    'slots':{
      'TOPIC': 'TopicSlot'
    },
    'utterances':[
      'to {tell me about|list} {|upcoming} {-|TOPIC} {events|meetups|meetings}',
      'to give me {|upcoming} {-|TOPIC} {events|meetups|meetings}',
      'about {|upcoming} {-|TOPIC} {events|meetups|meetings}',
      'to {tell me about|list|give me} {|upcoming} {events|meetups|meetings} about {-|TOPIC}',
    ]
  },
  (request, response) => {
    new TopicResponder(request, response);
    return false;
  }
);


app.intent('AMAZON.HelpIntent', 
  {
    'utterances':[
      "for help {|customizing|setting up|getting started}"
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
