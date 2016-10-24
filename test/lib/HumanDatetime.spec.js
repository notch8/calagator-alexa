var expect = require('chai').expect;
var HumanDatetime = require('../../lib/HumanDatetime');


describe("Localizing time", function(){
  it("should parse time", function(){
    var myDate = new Date("2016-10-21T13:00:00.000-07:00");
    var subject = new HumanDatetime(myDate);
    expect(subject.asHearableTime()).to.equal("01:00:00 PM");
  });
});

