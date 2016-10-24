"use strict";
var moment = require('moment-timezone');

class TargetDate {
  constructor(relativeDay){
    this.dayishWord = new DayishWord(relativeDay);
    this.relativeDate = this.dayishWord.asDate();
  }

  relativeDay(){
    return this.dayishWord.relativeDay;
  }

  beginningOfDay(){
    return moment(this.relativeDate).startOf('day');
  }

  endOfDay(){
    return moment(this.relativeDate).endOf('day');
  }

};

class DayishWord{
  constructor(relativeDay){
    switch (relativeDay) {
      case "today":
        this.date = this.today();
        this.relativeDay = 'today';
        break;
      case "tomorrow":
        this.date = this.tomorrow();
        this.relativeDay = 'tomorrow';
        break;
      case "todays":
        this.date = this.today();
        this.relativeDay = 'today'
        break;
      case "tomorrows":
        this.date = this.tomorrow();
        this.relativeDay = 'tomorrow';
        break;
    };
  }

  asDate(){
    return this.date;
  }

  today(){
    return moment().tz('America/Los_Angeles');
  }

  tomorrow(){
    return this.today().add(1, 'day');
  }
};

module.exports = TargetDate;
