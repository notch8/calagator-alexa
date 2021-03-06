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


  describe("WhatsHappening", ()=> {

    describe("bad request", ()=>{
      let badMockRequest = mockHelper.load("whats_happening_bad_request.json");
      before( (done) =>{
        timekeeper.freeze(threeEventTime);
        done();
      } );

      after( (done) =>{
        timekeeper.reset();
        done();
      } );

      it("should end session", ()=>{
        timekeeper.freeze(threeEventTime);
        return app.request(badMockRequest).then( (response)=>{
          let subject = response.response;
          expect(subject).to.have.property("shouldEndSession", true);
         });
      });

      describe("response", ()=>{
        it("should say the correct events", ()=>{
          const expected = `<speak>I'm sorry. I didn't understand your request. You can ask, 'Alexa, ask Calagator what is happing today or tomorrow'. Or ask about upcoming events. For example, Tell me about upcoming networking events.</speak>`

          return app.request(badMockRequest).then( (response)=>{
            let subject = response.response.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });
      });
    });

    describe("no events", ()=>{
      before( (done) =>{
        timekeeper.freeze(sevenEventTime);
        done();
      } );

      after( (done) =>{
        timekeeper.reset();
        done();
      } );

      let mockRequest = mockHelper.load("whats_happening_saturday_request.json");

      it("should end session", ()=>{
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response;
          expect(subject).to.have.property("shouldEndSession", true);
         });
      });

      it("should message no events", ()=>{
        const expected = '<speak>There are no events Saturday.</speak>';
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response.outputSpeech
          expect(subject.ssml).to.equal(expected);
        });
      });

      it("should not add a card", ()=>{
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response
          expect(subject).to.not.have.property('card');
        });
      });

    });

    describe("3 events", ()=>{
      let mockRequest = mockHelper.load("whats_happening_request.json");
      before( (done) =>{
        timekeeper.freeze(threeEventTime);
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
        it("should say the correct events", ()=>{
          const expected = '<speak>There are 3 events today. At 08:00:00 AM, PDX Women In Tech (PDXWIT) Coderetreat 2016. At 08:00:00 AM, PDX Global Day of Coderetreat 2016. At 10:00:00 AM, DevelopmentNow Little Hackathon of Horrors PDX. I added them to a card in the Alexa app.</speak>'

          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should add a card", ()=>{
          const expected = 'There are 3 events today.\n--------------------------\nSaturday 8:00 AM\nPDX Women In Tech (PDXWIT) Coderetreat 2016\n310 SW 4th Ave Suite 412 Portland, OR 97204\n--------------------------\nSaturday 8:00 AM\nPDX Global Day of Coderetreat 2016\n249 NW Park Ave Portland, OR 97209\n--------------------------\nSaturday 10:00 AM\nDevelopmentNow Little Hackathon of Horrors PDX\n9 SE 3rd Ave Ste 220, Portland, OR 97214'

          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.card
            expect(subject.content).to.equal(expected);
          });
        });
      });
    });

    describe("more than 3 events", ()=>{
      before( (done) =>{
        timekeeper.freeze(sevenEventTime);
        done();
      } );

      after( (done) =>{
        timekeeper.reset();
        done();
      } );

      describe('asking about Wednesday', ()=>{
        let mockRequest = mockHelper.load("whats_happening_thursday_request.json");

        it("should end session", ()=>{
          return app.request(mockRequest).then( (response)=>{
            let subject = response.response;
            expect(subject).to.have.property("shouldEndSession", false);
           });
        });

        describe("response", ()=>{
          it("should reprompt", ()=>{
            const expected = '<speak>Would you like to hear more? You can say "yes" or "no".</speak>';
            return app.request(mockRequest).then( (response)=>{
              let subject = response.response.reprompt.outputSpeech
              expect(subject.ssml).to.equal(expected);
            });
          });

          it("should set targetDate in session", ()=>{
            return app.request(mockRequest).then( (response)=>{
              let subject = response.sessionAttributes
              expect(subject.relativeTargetDay).to.equal('thursday');
            });
          });
        });
      });

      describe('asking for relative date', ()=>{
        let mockRequest = mockHelper.load("whats_happening_request.json");

        it("should end session", ()=>{
          return app.request(mockRequest).then( (response)=>{
            let subject = response.response;
            expect(subject).to.have.property("shouldEndSession", false);
           });
        });

        describe("response", ()=>{
          it("should reprompt", ()=>{
            const expected = '<speak>Would you like to hear more? You can say "yes" or "no".</speak>';
            return app.request(mockRequest).then( (response)=>{
              let subject = response.response.reprompt.outputSpeech
              expect(subject.ssml).to.equal(expected);
            });
          });

          it("should set targetDate in session", ()=>{
            return app.request(mockRequest).then( (response)=>{
              let subject = response.sessionAttributes
              expect(subject.relativeTargetDay).to.equal('today');
            });
          });
        });
      });
    });
  });
});
