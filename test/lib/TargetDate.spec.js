var expect = require('chai').expect;
var moment = require('moment');
var TargetDate = require('../../lib/TargetDate');

describe("TargetDate", () => {
  var subject = new TargetDate('today');

  it("should know beginning of day", () => {
    expect(subject.beginningOfDay().toString()).to.equal(moment().startOf('day').toString());
  });

  it("should know end of day", () => {
    expect(subject.endOfDay().toString()).to.equal(moment().endOf('day').toString());
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
    var tomorrow = moment().add(1, 'day').startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(tomorrow);
  });

  it("should know today", () => {
    var subject = new TargetDate('today');
    var today = moment().startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(today);
  });

  it("should know tomorrows (possessive)", () => {
    var subject = new TargetDate('tomorrows');
    var tomorrow = moment().add(1, 'day').startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(tomorrow);
  });

  it("should know todays (possessive)", () => {
    var subject = new TargetDate('todays');
    var today = moment().startOf('day').toString();
    expect(subject.beginningOfDay().toString()).to.equal(today);
  });
});
