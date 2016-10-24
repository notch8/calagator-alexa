var Bluebird = require('bluebird');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var mockHelper = require("../helpers/MockHelper");
var mockery = require('mockery');
chai.use(chaiAsPromised);
var expect = chai.expect;
chai.config.includeStack = true;

var eventsFile = 'events.json';

before( (done)=>{
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('request-promise', ()=>{
    console.log('running mock');
    var response = {
      body: mockHelper.load(eventsFile)
    };
    return Bluebird.resolve(response);
  });

  app = require('../../index');

  done();
});

after( (done) => {
  mockery.disable();
  mockery.deregisterAll();
  done();
});


describe("Event Requests", ()=>{
  var timekeeper = require('timekeeper');

  describe("MoreEvents", ()=>{
    var sevenEventTime = new Date("2016-10-26T01:48:54+00:00");
  });

  describe("WhatsHappening", ()=> {
    var threeEventTime = new Date("2016-10-23T01:48:54+00:00");
    var sevenEventTime = new Date("2016-10-26T01:48:54+00:00");
    var mockRequest = mockHelper.load("whats_happening_request.json");

    describe("3 events", ()=>{
      it("should end session", ()=>{
        timekeeper.freeze(threeEventTime);
        return app.request(mockRequest).then( (response)=>{
          var subject = response.response;
          expect(subject).to.have.property("shouldEndSession", true);
         });
      });

      describe("response", ()=>{
        it("should say the correct events", ()=>{
          timekeeper.freeze(threeEventTime);
          const expected = '<speak>There are 3 events today. At 08:00:00 AM, PDX Women In Tech (PDXWIT) Coderetreat 2016. At 08:00:00 AM, PDX Global Day of Coderetreat 2016. At 10:00:00 AM, DevelopmentNow Little Hackathon of Horrors.</speak>'

          return app.request(mockRequest).then( (response)=>{
            var subject = response.response.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should add a card", ()=>{
          const expected = 'There are 3 events today.\nPDX Women In Tech (PDXWIT) Coderetreat 2016\nStarts At: 8:00 AM\n310 SW 4th Ave Suite 412 Portland, OR 97204\nPDX Global Day of Coderetreat 2016\nStarts At: 8:00 AM\n249 NW Park Ave Portland, OR 97209\nDevelopmentNow Little Hackathon of Horrors\nStarts At: 10:00 AM\n9 SE 3rd Ave Ste 220, Portland, OR 97214'

          return app.request(mockRequest).then( (response)=>{
            var subject = response.response.card
            expect(subject.content).to.equal(expected);
          });
        });
      });
    });

    describe("more than events", ()=>{
      it("should end session", ()=>{
        timekeeper.freeze(sevenEventTime);
        return app.request(mockRequest).then( (response)=>{
          var subject = response.response;
          expect(subject).to.have.property("shouldEndSession", false);
         });
      });

      describe("response", ()=>{
        it("should reprompt", ()=>{
          timekeeper.freeze(sevenEventTime);
          const expected = '<speak>Would you like to hear more?</speak>';
          return app.request(mockRequest).then( (response)=>{
            var subject = response.response.reprompt.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should set targetDate in session", ()=>{
          timekeeper.freeze(sevenEventTime);
          return app.request(mockRequest).then( (response)=>{
            var subject = response.sessionAttributes
            expect(subject.relativeTargetDay).to.equal('today');
          });
        });
      });
    });
  });
});
