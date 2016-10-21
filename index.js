var alexa = require('alexa-app');
var app = new alexa.app('calagator');
var TimeParser = require('./lib/TimeParser');

app.dictionary = {
  "days": ["today", "tomorrow"],
  "daysPossesive": ["todays", "tomorrows"],
};

app.intent('WhatsHappening',
  {
    'slots':{
      'DAY': 'AMAZON.LITERAL',
      'POSSESSIVEDAY': 'AMAZON.LITERAL'
    },
    'utterances':[
      "{to list |to tell me |}what is happening {days|DAY}",
      "{to list |to tell me |}what events are {days|DAY}",
      "{to list |to tell me |}what is on the calendar {days|DAY}",
      "{to list |to tell me |}what is on {daysPossesive|POSESSIVEDAY} calendar"
    ]
  },
  function(request, response){
    var timeParser = new TimeParser();
    if(request.slot('DAY')){
      var targetDate = timeParser.dateForRelativeDay(request.slot('DAY'));
    }else if(request.slot('POSSESSIVEDAY')){
      var targetDate = timeParser.dateForRelativeDay(request.slot('POSESSIVEDAY'));
    }

    response.say("The date:" + targetDate.toString());

    response.card({
      type: 'Simple',
      title: 'Tech Events Today',
      content: [
          'There are 3 events today',
          targetDate.toString()
        ].join("\n")
    })
  }
);

app.intent('AMAZON.HelpIntent', 
  {
    'utterances':[
      "for help {customizing|setting up|getting started}"
    ]
  },
  function(request, response){
    response.say("You can ask me what is happening today or tomorrow." +
      "Or ask about upcoming events.  'Tell me about upcoming networking events', for example." +
      "I have added a card listing more things I understand.");

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

app.error = function(exception, request, response) {
    response.say("Sorry, something bad happened");
};

module.exports = app;
