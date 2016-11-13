"use strict";
class BadRequest{
  constructor(request, response){
    response.say("I'm sorry.  I didn't understand your request.");
    response.say("You can ask, 'Alexa, ask Calagator what is happing today or tomorrow'.");
    response.say("Or ask about upcoming events.");
    response.say("For example, Tell me about upcoming networking events.");
  }
}

module.exports = BadRequest;
