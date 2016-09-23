'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Favorite = mongoose.model('Favorite'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  favorite;

/**
 * Favorite routes tests
 */
describe('Favorite CRUD tests', function () {

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

    // Save a user to the test db and create new Favorite
    user.save(function () {
      favorite = {
        name: 'Favorite name'
      };

      done();
    });
  });

  it('should be able to save a Favorite if logged in', function (done) {
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

        // Save a new Favorite
        agent.post('/api/favorites')
          .send(favorite)
          .expect(200)
          .end(function (favoriteSaveErr, favoriteSaveRes) {
            // Handle Favorite save error
            if (favoriteSaveErr) {
              return done(favoriteSaveErr);
            }

            // Get a list of Favorites
            agent.get('/api/favorites')
              .end(function (favoritesGetErr, favoritesGetRes) {
                // Handle Favorites save error
                if (favoritesGetErr) {
                  return done(favoritesGetErr);
                }

                // Get Favorites list
                var favorites = favoritesGetRes.body;

                // Set assertions
                (favorites[0].user._id).should.equal(userId);
                (favorites[0].name).should.match('Favorite name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Favorite if not logged in', function (done) {
    agent.post('/api/favorites')
      .send(favorite)
      .expect(403)
      .end(function (favoriteSaveErr, favoriteSaveRes) {
        // Call the assertion callback
        done(favoriteSaveErr);
      });
  });

  it('should not be able to save an Favorite if no name is provided', function (done) {
    // Invalidate name field
    favorite.name = '';

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

        // Save a new Favorite
        agent.post('/api/favorites')
          .send(favorite)
          .expect(400)
          .end(function (favoriteSaveErr, favoriteSaveRes) {
            // Set message assertion
            (favoriteSaveRes.body.message).should.match('Please fill Favorite name');

            // Handle Favorite save error
            done(favoriteSaveErr);
          });
      });
  });

  it('should be able to update an Favorite if signed in', function (done) {
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

        // Save a new Favorite
        agent.post('/api/favorites')
          .send(favorite)
          .expect(200)
          .end(function (favoriteSaveErr, favoriteSaveRes) {
            // Handle Favorite save error
            if (favoriteSaveErr) {
              return done(favoriteSaveErr);
            }

            // Update Favorite name
            favorite.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Favorite
            agent.put('/api/favorites/' + favoriteSaveRes.body._id)
              .send(favorite)
              .expect(200)
              .end(function (favoriteUpdateErr, favoriteUpdateRes) {
                // Handle Favorite update error
                if (favoriteUpdateErr) {
                  return done(favoriteUpdateErr);
                }

                // Set assertions
                (favoriteUpdateRes.body._id).should.equal(favoriteSaveRes.body._id);
                (favoriteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Favorites if not signed in', function (done) {
    // Create new Favorite model instance
    var favoriteObj = new Favorite(favorite);

    // Save the favorite
    favoriteObj.save(function () {
      // Request Favorites
      request(app).get('/api/favorites')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Favorite if not signed in', function (done) {
    // Create new Favorite model instance
    var favoriteObj = new Favorite(favorite);

    // Save the Favorite
    favoriteObj.save(function () {
      request(app).get('/api/favorites/' + favoriteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', favorite.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Favorite with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/favorites/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Favorite is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Favorite which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Favorite
    request(app).get('/api/favorites/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Favorite with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Favorite if signed in', function (done) {
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

        // Save a new Favorite
        agent.post('/api/favorites')
          .send(favorite)
          .expect(200)
          .end(function (favoriteSaveErr, favoriteSaveRes) {
            // Handle Favorite save error
            if (favoriteSaveErr) {
              return done(favoriteSaveErr);
            }

            // Delete an existing Favorite
            agent.delete('/api/favorites/' + favoriteSaveRes.body._id)
              .send(favorite)
              .expect(200)
              .end(function (favoriteDeleteErr, favoriteDeleteRes) {
                // Handle favorite error error
                if (favoriteDeleteErr) {
                  return done(favoriteDeleteErr);
                }

                // Set assertions
                (favoriteDeleteRes.body._id).should.equal(favoriteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Favorite if not signed in', function (done) {
    // Set Favorite user
    favorite.user = user;

    // Create new Favorite model instance
    var favoriteObj = new Favorite(favorite);

    // Save the Favorite
    favoriteObj.save(function () {
      // Try deleting Favorite
      request(app).delete('/api/favorites/' + favoriteObj._id)
        .expect(403)
        .end(function (favoriteDeleteErr, favoriteDeleteRes) {
          // Set message assertion
          (favoriteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Favorite error error
          done(favoriteDeleteErr);
        });

    });
  });

  it('should be able to get a single Favorite that has an orphaned user reference', function (done) {
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

          // Save a new Favorite
          agent.post('/api/favorites')
            .send(favorite)
            .expect(200)
            .end(function (favoriteSaveErr, favoriteSaveRes) {
              // Handle Favorite save error
              if (favoriteSaveErr) {
                return done(favoriteSaveErr);
              }

              // Set assertions on new Favorite
              (favoriteSaveRes.body.name).should.equal(favorite.name);
              should.exist(favoriteSaveRes.body.user);
              should.equal(favoriteSaveRes.body.user._id, orphanId);

              // force the Favorite to have an orphaned user reference
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

                    // Get the Favorite
                    agent.get('/api/favorites/' + favoriteSaveRes.body._id)
                      .expect(200)
                      .end(function (favoriteInfoErr, favoriteInfoRes) {
                        // Handle Favorite error
                        if (favoriteInfoErr) {
                          return done(favoriteInfoErr);
                        }

                        // Set assertions
                        (favoriteInfoRes.body._id).should.equal(favoriteSaveRes.body._id);
                        (favoriteInfoRes.body.name).should.equal(favorite.name);
                        should.equal(favoriteInfoRes.body.user, undefined);

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
      Favorite.remove().exec(done);
    });
  });
});
