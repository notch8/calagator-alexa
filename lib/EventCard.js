"use strict";
var Event = require('./Event');
var _ = require('lodash');

class EventCard{
  constructor(events, subTitle){
    this.events = events;
    this.subTitle = subTitle;
  }

  send(response){
    if(this.events.length > 0){
      var cardDescriptions = this.events.map( (attrs) => { 
        var event = new Event(attrs);
        return event.asCard() 
      });

      var cardContent = _.flatten([
        //eventList.debug(),
        this.subTitle,
        cardDescriptions.join("\n") //add extra newline inbetween events
      ]);

      response.card({
        type: 'Simple',
        title: 'Calagator',
        content: cardContent.join("\n")
      });
    };
  }
}

module.exports = EventCard;
