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

  describe("TopicEvents", ()=>{
    before( (done) =>{
      timekeeper.freeze(threeEventTime);
      done();
    } );

    after( (done) =>{
      timekeeper.reset();
      done();
    } );

    describe('with no events', ()=>{
      let mockRequest = mockHelper.load("topic_events_request_bad_request.json");
      it("should say the correct events", ()=>{
        const expected = `<speak>There are no events matching your request this week.</speak>`
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response.outputSpeech
          expect(subject.ssml).to.equal(expected);
        });
      });
    });

    describe('with found events', ()=>{
      let mockRequest = mockHelper.load("topic_events_request.json");
      it("should end session", ()=>{
        timekeeper.freeze(threeEventTime);
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response;
          expect(subject).to.have.property("shouldEndSession", true);
         });
      });

      describe("response", ()=>{
        it("should say the correct events", ()=>{
          const expected = `<speak>There are 2 upcoming events this week. At 08:00:00 AM Saturday, PDX Women In Tech (PDXWIT) Coderetreat 2016. At 04:30:00 PM Tuesday, PDX Women in Tech (PDXWIT) Happy Hour Networking Event. I added them to a card in the Alexa app.</speak>`

          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should add a card", ()=>{
          const expected = 'Upcoming events related to women\n--------------------------\nSaturday 8:00 AM\nPDX Women In Tech (PDXWIT) Coderetreat 2016\n310 SW 4th Ave Suite 412 Portland, OR 97204\n--------------------------\nTuesday 4:30 PM\nPDX Women in Tech (PDXWIT) Happy Hour Networking Event'

          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.card
            expect(subject.content).to.equal(expected);
          });
        });
      });
    });
    describe('with more than 3 events', ()=>{
      let mockRequest = mockHelper.load("topic_events_more_than_3_request.json");
      it("should not session", ()=>{
        timekeeper.freeze(threeEventTime);
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response;
          expect(subject).to.have.property("shouldEndSession", false);
         });
      });

      describe("response", ()=>{
        it("should say the correct events", ()=>{
          const expected = '<speak>There are 11 upcoming events this week. Here are the first 3. At 08:00:00 AM Saturday, PDX Women In Tech (PDXWIT) Coderetreat 2016. At 08:00:00 AM Saturday, PDX Global Day of Coderetreat 2016. At 10:00:00 AM Saturday, DevelopmentNow Little Hackathon of Horrors PDX. I added them to a card in the Alexa app. Would you like to hear more?</speak>'

          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should reprompt", ()=>{
          const expected = '<speak>Would you like to hear more? You can say "yes" or "no".</speak>';
          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.reprompt.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should set targetTopic in session", ()=>{
          return app.request(mockRequest).then( (response)=>{
            let subject = response.sessionAttributes
            expect(subject.relativeTargetDay).to.equal('pdx');
          });
        });
      });
    });
  });
});
