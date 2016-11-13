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
    var subject = new TargetDate('Sunday');
    let expectedDay = moment().day("Sunday").tz('America/Los_Angeles');
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Monday", ()=>{
    var subject = new TargetDate('Monday');
    let expectedDay = moment().day("Monday").day(7).tz('America/Los_Angeles');
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Tuesday", ()=>{
    var subject = new TargetDate('Tuesday');
    let expectedDay = moment().day("Tuesday").day(7).tz('America/Los_Angeles');
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Wednesday", ()=>{
    var subject = new TargetDate('Wednesday');
    let expectedDay = moment().day("Wednesday").day(7).tz('America/Los_Angeles');
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Thursday", ()=>{
    var subject = new TargetDate('Thursday');
    let expectedDay = moment().day("Thursday").day(7).tz('America/Los_Angeles');
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Friday", ()=>{
    var subject = new TargetDate('Friday');
    let expectedDay = moment().day("Friday").day(7).tz('America/Los_Angeles');
    var expected = expectedDay.startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(expected);
  });

  it("should know Saturday", ()=>{
    var subject = new TargetDate('Saturday');
    let expectedDay = moment().day("Saturday").day(7).tz('America/Los_Angeles');
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
