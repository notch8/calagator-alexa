class BadRequest{
  constructor(request, response){
    response.say("I'm sorry.  I didn't understand your request.  You can ask, 'Alexa, ask Calagator what is happing today or tomorrow'.");
  }
}

module.exports = BadRequest;
