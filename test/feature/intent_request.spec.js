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

      let mockRequest = mockHelper.load("whats_happening_monday_request.json");

      it("should end session", ()=>{
        return app.request(mockRequest).then( (response)=>{
          let subject = response.response;
          expect(subject).to.have.property("shouldEndSession", true);
         });
      });

      it("should reprompt", ()=>{
        const expected = '<speak>There are no events Monday.</speak>';
        return app.request(mockRequest).then( (response)=>{
          console.log(response)
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
          const expected = `<speak>I didn't find any events matching your request.</speak>`
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
            const expected = `<speak>I found 7 upcoming events. At 08:00:00 AM Saturday, PDX Women In Tech (PDXWIT) Coderetreat 2016. At 04:30:00 PM Tuesday, PDX Women in Tech (PDXWIT) Happy Hour Networking Event. At 05:30:00 PM Tuesday, PDX Women In Tech (PDXWIT) presents - "Most Likely to Succeed" Viewing. At 06:00:00 PM Friday, We Code Hackathon for Women & Friends. At 05:30:00 PM Thursday, PDX Women In Tech (PDXWIT) presents Demystifying Telecom:How the voice you hear got there. At 05:00:00 PM Tuesday, PDX Women in Tech (PDXWIT) Mentorship Program Networking Event. At 03:30:00 PM Friday, PDX Women In Tech (PDXWIT) Volunteering with Free Geek. I added them to a card in the Alexa app.</speak>`
            return app.request(mockRequest).then( (response)=>{
              let subject = response.response.outputSpeech
              expect(subject.ssml).to.equal(expected);
            });
          });
          it("should add a card", ()=>{
            const expected = `Upcoming events related to women\nPDX Women In Tech (PDXWIT) Coderetreat 2016\nStarts At: 8:00 AM\n310 SW 4th Ave Suite 412 Portland, OR 97204\nPDX Women in Tech (PDXWIT) Happy Hour Networking Event\nStarts At: 4:30 PM\nPDX Women In Tech (PDXWIT) presents - "Most Likely to Succeed" Viewing\nStarts At: 5:30 PM\n135 SW Taylor Suite 200, Portland, Oregon, 97204\nWe Code Hackathon for Women & Friends\nStarts At: 6:00 PM\n308 SW 2nd Ave Fifth Floor Portland, OR 97204\nPDX Women In Tech (PDXWIT) presents Demystifying Telecom:How the voice you hear got there\nStarts At: 5:30 PM\nPDX Women in Tech (PDXWIT) Mentorship Program Networking Event\nStarts At: 5:00 PM\n108 NW 9th Ave. Ste. 201 Portland, OR 97209\nPDX Women In Tech (PDXWIT) Volunteering with Free Geek\nStarts At: 3:30 PM\n1731 SE 10th Avenue, Portland, OR 97214`

            return app.request(mockRequest).then( (response)=>{
              let subject = response.response.card
              expect(subject.content).to.equal(expected);
            });
          });
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
          const expected = '<speak>There are 3 events today. At 08:00:00 AM, PDX Women In Tech (PDXWIT) Coderetreat 2016. At 08:00:00 AM, PDX Global Day of Coderetreat 2016. At 10:00:00 AM, DevelopmentNow Little Hackathon of Horrors.</speak>'

          return app.request(mockRequest).then( (response)=>{
            let subject = response.response.outputSpeech
            expect(subject.ssml).to.equal(expected);
          });
        });

        it("should add a card", ()=>{
          const expected = 'There are 3 events today.\nPDX Women In Tech (PDXWIT) Coderetreat 2016\nStarts At: 8:00 AM\n310 SW 4th Ave Suite 412 Portland, OR 97204\nPDX Global Day of Coderetreat 2016\nStarts At: 8:00 AM\n249 NW Park Ave Portland, OR 97209\nDevelopmentNow Little Hackathon of Horrors\nStarts At: 10:00 AM\n9 SE 3rd Ave Ste 220, Portland, OR 97214'

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
        let mockRequest = mockHelper.load("whats_happening_wednesday_request.json");

        it("should end session", ()=>{
          return app.request(mockRequest).then( (response)=>{
            let subject = response.response;
            console.log(subject)
            expect(subject).to.have.property("shouldEndSession", false);
           });
        });

        describe("response", ()=>{
          it("should reprompt", ()=>{
            const expected = '<speak>Would you like to hear more?</speak>';
            return app.request(mockRequest).then( (response)=>{
              let subject = response.response.reprompt.outputSpeech
              expect(subject.ssml).to.equal(expected);
            });
          });

          it("should set targetDate in session", ()=>{
            return app.request(mockRequest).then( (response)=>{
              let subject = response.sessionAttributes
              expect(subject.relativeTargetDay).to.equal('wednesday');
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
            const expected = '<speak>Would you like to hear more?</speak>';
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
