var expect = require('chai').expect;
var moment = require('moment-timezone');
var TargetDate = require('../../lib/TargetDate');

describe("TargetDate", () => {
  var subject = new TargetDate('today');

  it("should know beginning of day", () => {
    expect(subject.beginningOfDay().toString()).to.equal(moment().tz("America/Los_Angeles").startOf('day').toString());
  });

  it("should know end of day", () => {
    expect(subject.endOfDay().toString()).to.equal(moment().tz("America/Los_Angeles").endOf('day').toString());
  });
});

describe('weekdays', ()=>{
  let timekeeper = require('timekeeper');
  let frozenTime = new Date("2016-10-23T01:48:54+00:00");

  before( (done) =>{
    timekeeper.freeze(frozenTime);
    done();
  } );

  after( (done) =>{
    timekeeper.reset();
    done();
  } );

  it("should know today (Sunday)", ()=>{
    let day = 'Sunday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(7).day(day);
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Monday", ()=>{
    let day = 'Monday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(7).day(day);
    var expected = expectedDay.startOf('day').toString();
    console.log(moment().toString())
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Tuesday", ()=>{
    let day = 'Tuesday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(7).day(day);
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Wednesday", ()=>{
    let day = 'Wednesday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(7).day(day);
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Thursday", ()=>{
    let day = 'Thursday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(7).day(day);

    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Friday", ()=>{
    let day = 'Friday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(7).day(day);

    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Saturday (Today)", ()=>{
    let day = 'Saturday';
    var subject = new TargetDate(day);
    let expectedDay = moment().tz('America/Los_Angeles').day(day);
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });
});

describe('relative day', () => {
  it("should know today", ()=> {
    var subject = new TargetDate('today');
    expect(subject.relativeDay()).to.equal('today');
  });

  it("should know todays", ()=> {
    var subject = new TargetDate('todays');
    expect(subject.relativeDay()).to.equal('today');
  });

  it("should know tomorrow", ()=> {
    var subject = new TargetDate('tomorrow');
    expect(subject.relativeDay()).to.equal('tomorrow');
  });

  it("should know tomorrows", ()=> {
    var subject = new TargetDate('tomorrows');
    expect(subject.relativeDay()).to.equal('tomorrow');
  });
});

describe("day words", () => {
  it("should know tomorrow", () => {
    var subject = new TargetDate('tomorrow');
    var tomorrow = moment().tz("America/Los_Angeles").add(1, 'day').startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(tomorrow);
  });

  it("should know today", () => {
    var subject = new TargetDate('today');
    var today = moment().tz("America/Los_Angeles").startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(today);
  });

  it("should know tomorrows (possessive)", () => {
    var subject = new TargetDate('tomorrows');
    var tomorrow = moment().tz("America/Los_Angeles").add(1, 'day').startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(tomorrow);
  });

  it("should know todays (possessive)", () => {
    var subject = new TargetDate('todays');
    var today = moment().tz("America/Los_Angeles").startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(today);
  });

  it("should not know other things", ()=>{
    var subject = new TargetDate('bob');
    expect(subject.isValid()).to.equal(false);
    expect(subject.relativeDate).to.equal(undefined);
    expect(subject.beginningOfDay()).to.equal(undefined);
    expect(subject.endOfDay()).to.equal(undefined);
  });
});
