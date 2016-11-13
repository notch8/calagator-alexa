let Bluebird = require('bluebird');
let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
let mockHelper = require("../helpers/MockHelper");
let mockery = require('mockery');
chai.use(chaiAsPromised);
let expect = chai.expect;
chai.config.includeStack = true;

let eventsFile = 'events.json';

before( (done)=>{
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false,
    useCleanCache: true
  });

  mockery.registerMock('request-promise', ()=>{
    let response = {
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
  let timekeeper = require('timekeeper');
  let threeEventTime = new Date("2016-10-23T01:48:54+00:00");
  let sevenEventTime = new Date("2016-10-26T01:48:54+00:00");

  describe("MoreEvents", ()=>{
    let mockRequest = mockHelper.load("more_events_request.json");

    before( (done) =>{
      timekeeper.freeze(sevenEventTime);
      done();
    } );

    after( (done) =>{
      timekeeper.reset();
      done();
    } );

    it("should end session", ()=>{
      timekeeper.freeze(threeEventTime);
      return app.request(mockRequest).then( (response)=>{
        let subject = response.response;
        expect(subject).to.have.property("shouldEndSession", true);
       });
    });

    describe("response", ()=>{
      before( (done) =>{
        timekeeper.freeze(sevenEventTime);
        done();
      } );

      after( (done) =>{
        timekeeper.reset();
        done();
      } );


      it("should say the correct events", ()=>{
        const expected = '<speak>Ok, there are 4 more. At 06:00:00 PM, Donut.js. At 06:00:00 PM, The Tech Academy Social Networking Night. At 06:30:00 PM, Ruby on Rails PDX Monthly Meetup. At 06:30:00 PM, RainSec.</speak>';

        return app.request(mockRequest).then( (response)=>{
          let subject = response.response.outputSpeech
          expect(subject.ssml).to.equal(expected);
        });
      });
    });
  });


  describe("No MoreEvents", ()=>{
    let mockRequest = mockHelper.load("more_events_request_no.json");

    before( (done) =>{
      timekeeper.freeze(sevenEventTime);
      done();
    } );

    after( (done) =>{
      timekeeper.reset();
      done();
    } );

    it("should end session", ()=>{
      timekeeper.freeze(threeEventTime);
      return app.request(mockRequest).then( (response)=>{
        let subject = response.response;
        expect(subject).to.have.property("shouldEndSession", true);
       });
    });

    describe("response", ()=>{
      before( (done) =>{
        timekeeper.freeze(sevenEventTime);
        done();
      } );

      after( (done) =>{
        timekeeper.reset();
        done();
      } );


      it("should say the correct events", ()=>{
        const expected = '<speak>Ok. Goodbye.</speak>'

        return app.request(mockRequest).then( (response)=>{
          let subject = response.response.outputSpeech
          expect(subject.ssml).to.equal(expected);
        });
      });
    });
  });
});
