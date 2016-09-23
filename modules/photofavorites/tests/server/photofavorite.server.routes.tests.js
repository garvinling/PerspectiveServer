'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Photofavorite = mongoose.model('Photofavorite'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  photofavorite;

/**
 * Photofavorite routes tests
 */
describe('Photofavorite CRUD tests', function () {

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

    // Save a user to the test db and create new Photofavorite
    user.save(function () {
      photofavorite = {
        name: 'Photofavorite name'
      };

      done();
    });
  });

  it('should be able to save a Photofavorite if logged in', function (done) {
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

        // Save a new Photofavorite
        agent.post('/api/photofavorites')
          .send(photofavorite)
          .expect(200)
          .end(function (photofavoriteSaveErr, photofavoriteSaveRes) {
            // Handle Photofavorite save error
            if (photofavoriteSaveErr) {
              return done(photofavoriteSaveErr);
            }

            // Get a list of Photofavorites
            agent.get('/api/photofavorites')
              .end(function (photofavoritesGetErr, photofavoritesGetRes) {
                // Handle Photofavorites save error
                if (photofavoritesGetErr) {
                  return done(photofavoritesGetErr);
                }

                // Get Photofavorites list
                var photofavorites = photofavoritesGetRes.body;

                // Set assertions
                (photofavorites[0].user._id).should.equal(userId);
                (photofavorites[0].name).should.match('Photofavorite name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Photofavorite if not logged in', function (done) {
    agent.post('/api/photofavorites')
      .send(photofavorite)
      .expect(403)
      .end(function (photofavoriteSaveErr, photofavoriteSaveRes) {
        // Call the assertion callback
        done(photofavoriteSaveErr);
      });
  });

  it('should not be able to save an Photofavorite if no name is provided', function (done) {
    // Invalidate name field
    photofavorite.name = '';

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

        // Save a new Photofavorite
        agent.post('/api/photofavorites')
          .send(photofavorite)
          .expect(400)
          .end(function (photofavoriteSaveErr, photofavoriteSaveRes) {
            // Set message assertion
            (photofavoriteSaveRes.body.message).should.match('Please fill Photofavorite name');

            // Handle Photofavorite save error
            done(photofavoriteSaveErr);
          });
      });
  });

  it('should be able to update an Photofavorite if signed in', function (done) {
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

        // Save a new Photofavorite
        agent.post('/api/photofavorites')
          .send(photofavorite)
          .expect(200)
          .end(function (photofavoriteSaveErr, photofavoriteSaveRes) {
            // Handle Photofavorite save error
            if (photofavoriteSaveErr) {
              return done(photofavoriteSaveErr);
            }

            // Update Photofavorite name
            photofavorite.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Photofavorite
            agent.put('/api/photofavorites/' + photofavoriteSaveRes.body._id)
              .send(photofavorite)
              .expect(200)
              .end(function (photofavoriteUpdateErr, photofavoriteUpdateRes) {
                // Handle Photofavorite update error
                if (photofavoriteUpdateErr) {
                  return done(photofavoriteUpdateErr);
                }

                // Set assertions
                (photofavoriteUpdateRes.body._id).should.equal(photofavoriteSaveRes.body._id);
                (photofavoriteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Photofavorites if not signed in', function (done) {
    // Create new Photofavorite model instance
    var photofavoriteObj = new Photofavorite(photofavorite);

    // Save the photofavorite
    photofavoriteObj.save(function () {
      // Request Photofavorites
      request(app).get('/api/photofavorites')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Photofavorite if not signed in', function (done) {
    // Create new Photofavorite model instance
    var photofavoriteObj = new Photofavorite(photofavorite);

    // Save the Photofavorite
    photofavoriteObj.save(function () {
      request(app).get('/api/photofavorites/' + photofavoriteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', photofavorite.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Photofavorite with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/photofavorites/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Photofavorite is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Photofavorite which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Photofavorite
    request(app).get('/api/photofavorites/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Photofavorite with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Photofavorite if signed in', function (done) {
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

        // Save a new Photofavorite
        agent.post('/api/photofavorites')
          .send(photofavorite)
          .expect(200)
          .end(function (photofavoriteSaveErr, photofavoriteSaveRes) {
            // Handle Photofavorite save error
            if (photofavoriteSaveErr) {
              return done(photofavoriteSaveErr);
            }

            // Delete an existing Photofavorite
            agent.delete('/api/photofavorites/' + photofavoriteSaveRes.body._id)
              .send(photofavorite)
              .expect(200)
              .end(function (photofavoriteDeleteErr, photofavoriteDeleteRes) {
                // Handle photofavorite error error
                if (photofavoriteDeleteErr) {
                  return done(photofavoriteDeleteErr);
                }

                // Set assertions
                (photofavoriteDeleteRes.body._id).should.equal(photofavoriteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Photofavorite if not signed in', function (done) {
    // Set Photofavorite user
    photofavorite.user = user;

    // Create new Photofavorite model instance
    var photofavoriteObj = new Photofavorite(photofavorite);

    // Save the Photofavorite
    photofavoriteObj.save(function () {
      // Try deleting Photofavorite
      request(app).delete('/api/photofavorites/' + photofavoriteObj._id)
        .expect(403)
        .end(function (photofavoriteDeleteErr, photofavoriteDeleteRes) {
          // Set message assertion
          (photofavoriteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Photofavorite error error
          done(photofavoriteDeleteErr);
        });

    });
  });

  it('should be able to get a single Photofavorite that has an orphaned user reference', function (done) {
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

          // Save a new Photofavorite
          agent.post('/api/photofavorites')
            .send(photofavorite)
            .expect(200)
            .end(function (photofavoriteSaveErr, photofavoriteSaveRes) {
              // Handle Photofavorite save error
              if (photofavoriteSaveErr) {
                return done(photofavoriteSaveErr);
              }

              // Set assertions on new Photofavorite
              (photofavoriteSaveRes.body.name).should.equal(photofavorite.name);
              should.exist(photofavoriteSaveRes.body.user);
              should.equal(photofavoriteSaveRes.body.user._id, orphanId);

              // force the Photofavorite to have an orphaned user reference
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

                    // Get the Photofavorite
                    agent.get('/api/photofavorites/' + photofavoriteSaveRes.body._id)
                      .expect(200)
                      .end(function (photofavoriteInfoErr, photofavoriteInfoRes) {
                        // Handle Photofavorite error
                        if (photofavoriteInfoErr) {
                          return done(photofavoriteInfoErr);
                        }

                        // Set assertions
                        (photofavoriteInfoRes.body._id).should.equal(photofavoriteSaveRes.body._id);
                        (photofavoriteInfoRes.body.name).should.equal(photofavorite.name);
                        should.equal(photofavoriteInfoRes.body.user, undefined);

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
      Photofavorite.remove().exec(done);
    });
  });
});
