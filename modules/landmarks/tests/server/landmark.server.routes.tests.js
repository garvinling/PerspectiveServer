'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Landmark = mongoose.model('Landmark'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, landmark;

/**
 * Landmark routes tests
 */
describe('Landmark CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Landmark
    user.save(function () {
      landmark = {
        name: 'Landmark name'
      };

      done();
    });
  });

  it('should be able to save a Landmark if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Landmark
        agent.post('/api/landmarks')
          .send(landmark)
          .expect(200)
          .end(function (landmarkSaveErr, landmarkSaveRes) {
            // Handle Landmark save error
            if (landmarkSaveErr) {
              return done(landmarkSaveErr);
            }

            // Get a list of Landmarks
            agent.get('/api/landmarks')
              .end(function (landmarksGetErr, landmarksGetRes) {
                // Handle Landmark save error
                if (landmarksGetErr) {
                  return done(landmarksGetErr);
                }

                // Get Landmarks list
                var landmarks = landmarksGetRes.body;

                // Set assertions
                (landmarks[0].user._id).should.equal(userId);
                (landmarks[0].name).should.match('Landmark name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Landmark if not logged in', function (done) {
    agent.post('/api/landmarks')
      .send(landmark)
      .expect(403)
      .end(function (landmarkSaveErr, landmarkSaveRes) {
        // Call the assertion callback
        done(landmarkSaveErr);
      });
  });

  it('should not be able to save an Landmark if no name is provided', function (done) {
    // Invalidate name field
    landmark.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Landmark
        agent.post('/api/landmarks')
          .send(landmark)
          .expect(400)
          .end(function (landmarkSaveErr, landmarkSaveRes) {
            // Set message assertion
            (landmarkSaveRes.body.message).should.match('Please fill Landmark name');

            // Handle Landmark save error
            done(landmarkSaveErr);
          });
      });
  });

  it('should be able to update an Landmark if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Landmark
        agent.post('/api/landmarks')
          .send(landmark)
          .expect(200)
          .end(function (landmarkSaveErr, landmarkSaveRes) {
            // Handle Landmark save error
            if (landmarkSaveErr) {
              return done(landmarkSaveErr);
            }

            // Update Landmark name
            landmark.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Landmark
            agent.put('/api/landmarks/' + landmarkSaveRes.body._id)
              .send(landmark)
              .expect(200)
              .end(function (landmarkUpdateErr, landmarkUpdateRes) {
                // Handle Landmark update error
                if (landmarkUpdateErr) {
                  return done(landmarkUpdateErr);
                }

                // Set assertions
                (landmarkUpdateRes.body._id).should.equal(landmarkSaveRes.body._id);
                (landmarkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Landmarks if not signed in', function (done) {
    // Create new Landmark model instance
    var landmarkObj = new Landmark(landmark);

    // Save the landmark
    landmarkObj.save(function () {
      // Request Landmarks
      request(app).get('/api/landmarks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Landmark if not signed in', function (done) {
    // Create new Landmark model instance
    var landmarkObj = new Landmark(landmark);

    // Save the Landmark
    landmarkObj.save(function () {
      request(app).get('/api/landmarks/' + landmarkObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', landmark.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Landmark with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/landmarks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Landmark is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Landmark which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Landmark
    request(app).get('/api/landmarks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Landmark with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Landmark if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Landmark
        agent.post('/api/landmarks')
          .send(landmark)
          .expect(200)
          .end(function (landmarkSaveErr, landmarkSaveRes) {
            // Handle Landmark save error
            if (landmarkSaveErr) {
              return done(landmarkSaveErr);
            }

            // Delete an existing Landmark
            agent.delete('/api/landmarks/' + landmarkSaveRes.body._id)
              .send(landmark)
              .expect(200)
              .end(function (landmarkDeleteErr, landmarkDeleteRes) {
                // Handle landmark error error
                if (landmarkDeleteErr) {
                  return done(landmarkDeleteErr);
                }

                // Set assertions
                (landmarkDeleteRes.body._id).should.equal(landmarkSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Landmark if not signed in', function (done) {
    // Set Landmark user
    landmark.user = user;

    // Create new Landmark model instance
    var landmarkObj = new Landmark(landmark);

    // Save the Landmark
    landmarkObj.save(function () {
      // Try deleting Landmark
      request(app).delete('/api/landmarks/' + landmarkObj._id)
        .expect(403)
        .end(function (landmarkDeleteErr, landmarkDeleteRes) {
          // Set message assertion
          (landmarkDeleteRes.body.message).should.match('User is not authorized');

          // Handle Landmark error error
          done(landmarkDeleteErr);
        });

    });
  });

  it('should be able to get a single Landmark that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Landmark
          agent.post('/api/landmarks')
            .send(landmark)
            .expect(200)
            .end(function (landmarkSaveErr, landmarkSaveRes) {
              // Handle Landmark save error
              if (landmarkSaveErr) {
                return done(landmarkSaveErr);
              }

              // Set assertions on new Landmark
              (landmarkSaveRes.body.name).should.equal(landmark.name);
              should.exist(landmarkSaveRes.body.user);
              should.equal(landmarkSaveRes.body.user._id, orphanId);

              // force the Landmark to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Landmark
                    agent.get('/api/landmarks/' + landmarkSaveRes.body._id)
                      .expect(200)
                      .end(function (landmarkInfoErr, landmarkInfoRes) {
                        // Handle Landmark error
                        if (landmarkInfoErr) {
                          return done(landmarkInfoErr);
                        }

                        // Set assertions
                        (landmarkInfoRes.body._id).should.equal(landmarkSaveRes.body._id);
                        (landmarkInfoRes.body.name).should.equal(landmark.name);
                        should.equal(landmarkInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Landmark.remove().exec(done);
    });
  });
});
