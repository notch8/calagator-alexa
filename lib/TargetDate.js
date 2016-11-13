"use strict";
var moment = require('moment-timezone');
var _ = require('lodash');

class TargetDate {
  constructor(relativeDay){
    this.dayishWord = new DayishWord(relativeDay);
    this.relativeDate = this.dayishWord.asDate();
  }

  isValid(){
    return this.relativeDate != undefined;
  }

  relativeDay(){
    return this.dayishWord.relativeDay;
  }

  beginningOfDay(){
    if(this.relativeDate){
      return moment(this.relativeDate).startOf('day');
    };
  }

  endOfDay(){
    if(this.relativeDate){
      return moment(this.relativeDate).endOf('day');
    }
  }
};

class DayishWord{
  constructor(relativeDay){
    switch (relativeDay.toLowerCase()) {
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
      case "monday":
      case "tuesday":
      case "wednesday":
      case "thursday":
      case "friday":
      case "saturday":
      case "sunday":
        this.date = this.dayOfWeek(relativeDay.toLowerCase())
        this.relativeDay = _.capitalize(relativeDay);
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

  dayOfWeek(dayWord){
    if(moment().tz('America/Los_Angeles').day(dayWord).day() == this.today().day()){
      return this.today();
    }else{
      return moment().tz('America/Los_Angeles').day(dayWord);
    }
  }
};

module.exports = TargetDate;
