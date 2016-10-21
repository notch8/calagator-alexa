var expect = require('chai').expect;

var TimeParser = require('../../lib/TimeParser');

var tz = require('timezone/loaded');

describe("Localizing time", function(){
  it("should parse time", function(){
    var input = "2016-10-21T13:00:00.000-07:00"
    var subject = new TimeParser();
    expect(subject.parse(input)).to.equal("01:00:00 PM");
  });

});

