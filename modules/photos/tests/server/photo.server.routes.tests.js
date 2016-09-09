'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Photo = mongoose.model('Photo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  photo;

/**
 * Photo routes tests
 */
describe('Photo CRUD tests', function () {

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

    // Save a user to the test db and create new Photo
    user.save(function () {
      photo = {
        name: 'Photo name'
      };

      done();
    });
  });

  it('should be able to save a Photo if logged in', function (done) {
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

        // Save a new Photo
        agent.post('/api/photos')
          .send(photo)
          .expect(200)
          .end(function (photoSaveErr, photoSaveRes) {
            // Handle Photo save error
            if (photoSaveErr) {
              return done(photoSaveErr);
            }

            // Get a list of Photos
            agent.get('/api/photos')
              .end(function (photosGetErr, photosGetRes) {
                // Handle Photos save error
                if (photosGetErr) {
                  return done(photosGetErr);
                }

                // Get Photos list
                var photos = photosGetRes.body;

                // Set assertions
                (photos[0].user._id).should.equal(userId);
                (photos[0].name).should.match('Photo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Photo if not logged in', function (done) {
    agent.post('/api/photos')
      .send(photo)
      .expect(403)
      .end(function (photoSaveErr, photoSaveRes) {
        // Call the assertion callback
        done(photoSaveErr);
      });
  });

  it('should not be able to save an Photo if no name is provided', function (done) {
    // Invalidate name field
    photo.name = '';

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

        // Save a new Photo
        agent.post('/api/photos')
          .send(photo)
          .expect(400)
          .end(function (photoSaveErr, photoSaveRes) {
            // Set message assertion
            (photoSaveRes.body.message).should.match('Please fill Photo name');

            // Handle Photo save error
            done(photoSaveErr);
          });
      });
  });

  it('should be able to update an Photo if signed in', function (done) {
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

        // Save a new Photo
        agent.post('/api/photos')
          .send(photo)
          .expect(200)
          .end(function (photoSaveErr, photoSaveRes) {
            // Handle Photo save error
            if (photoSaveErr) {
              return done(photoSaveErr);
            }

            // Update Photo name
            photo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Photo
            agent.put('/api/photos/' + photoSaveRes.body._id)
              .send(photo)
              .expect(200)
              .end(function (photoUpdateErr, photoUpdateRes) {
                // Handle Photo update error
                if (photoUpdateErr) {
                  return done(photoUpdateErr);
                }

                // Set assertions
                (photoUpdateRes.body._id).should.equal(photoSaveRes.body._id);
                (photoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Photos if not signed in', function (done) {
    // Create new Photo model instance
    var photoObj = new Photo(photo);

    // Save the photo
    photoObj.save(function () {
      // Request Photos
      request(app).get('/api/photos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Photo if not signed in', function (done) {
    // Create new Photo model instance
    var photoObj = new Photo(photo);

    // Save the Photo
    photoObj.save(function () {
      request(app).get('/api/photos/' + photoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', photo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Photo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/photos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Photo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Photo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Photo
    request(app).get('/api/photos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Photo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Photo if signed in', function (done) {
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

        // Save a new Photo
        agent.post('/api/photos')
          .send(photo)
          .expect(200)
          .end(function (photoSaveErr, photoSaveRes) {
            // Handle Photo save error
            if (photoSaveErr) {
              return done(photoSaveErr);
            }

            // Delete an existing Photo
            agent.delete('/api/photos/' + photoSaveRes.body._id)
              .send(photo)
              .expect(200)
              .end(function (photoDeleteErr, photoDeleteRes) {
                // Handle photo error error
                if (photoDeleteErr) {
                  return done(photoDeleteErr);
                }

                // Set assertions
                (photoDeleteRes.body._id).should.equal(photoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Photo if not signed in', function (done) {
    // Set Photo user
    photo.user = user;

    // Create new Photo model instance
    var photoObj = new Photo(photo);

    // Save the Photo
    photoObj.save(function () {
      // Try deleting Photo
      request(app).delete('/api/photos/' + photoObj._id)
        .expect(403)
        .end(function (photoDeleteErr, photoDeleteRes) {
          // Set message assertion
          (photoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Photo error error
          done(photoDeleteErr);
        });

    });
  });

  it('should be able to get a single Photo that has an orphaned user reference', function (done) {
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

          // Save a new Photo
          agent.post('/api/photos')
            .send(photo)
            .expect(200)
            .end(function (photoSaveErr, photoSaveRes) {
              // Handle Photo save error
              if (photoSaveErr) {
                return done(photoSaveErr);
              }

              // Set assertions on new Photo
              (photoSaveRes.body.name).should.equal(photo.name);
              should.exist(photoSaveRes.body.user);
              should.equal(photoSaveRes.body.user._id, orphanId);

              // force the Photo to have an orphaned user reference
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

                    // Get the Photo
                    agent.get('/api/photos/' + photoSaveRes.body._id)
                      .expect(200)
                      .end(function (photoInfoErr, photoInfoRes) {
                        // Handle Photo error
                        if (photoInfoErr) {
                          return done(photoInfoErr);
                        }

                        // Set assertions
                        (photoInfoRes.body._id).should.equal(photoSaveRes.body._id);
                        (photoInfoRes.body.name).should.equal(photo.name);
                        should.equal(photoInfoRes.body.user, undefined);

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
      Photo.remove().exec(done);
    });
  });
});
