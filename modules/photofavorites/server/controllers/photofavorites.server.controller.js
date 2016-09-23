'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose      = require('mongoose'),
  Photofavorite = mongoose.model('Photofavorite'),
  errorHandler  = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Q             = require('q'),
  _             = require('lodash');




function isFavorited(userID,photoID){

  var deferred = Q.defer();

  Photofavorite.find({user_id : userID , photo_id : photoID}).exec(function(err,data){

      if(err){
      
        deferred.reject(new Error(errorHandler.getErrorMessage(err)));
      
      } else {
        
        if(data.length > 0){
          deferred.resolve(true);
        } else {
          deferred.resolve(false);
        }
      }

  });

  return deferred.promise;

}




exports.createFavoriteLink = function(userID , photoID) {


   var deferred      = Q.defer();
   var photoFavorite = new Photofavorite({user_id : userID , photo_id : photoID});

   
  isFavorited(userID,photoID)
    .then(function(favorited){

      if(!favorited) {

        photoFavorite.save(function(err){

          if(err){

            deferred.reject(new Error(errorHandler.getErrorMessage(err)));

          } else {

            deferred.resolve(true);

          }
        });

      } else {
        //TODO: Unliking a photo logic should be here
        deferred.resolve(false);

      }

    });

    return deferred.promise;
}








/**
 * Create a Photofavorite
 */
exports.create = function(req, res) {
  var photofavorite = new Photofavorite(req.body);
  photofavorite.user = req.user;

  photofavorite.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photofavorite);
    }
  });
};

/**
 * Show the current Photofavorite
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var photofavorite = req.photofavorite ? req.photofavorite.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  photofavorite.isCurrentUserOwner = req.user && photofavorite.user && photofavorite.user._id.toString() === req.user._id.toString();

  res.jsonp(photofavorite);
};

/**
 * Update a Photofavorite
 */
exports.update = function(req, res) {
  var photofavorite = req.photofavorite;

  photofavorite = _.extend(photofavorite, req.body);

  photofavorite.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photofavorite);
    }
  });
};

/**
 * Delete an Photofavorite
 */
exports.delete = function(req, res) {
  var photofavorite = req.photofavorite;

  photofavorite.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photofavorite);
    }
  });
};

/**
 * List of Photofavorites
 */
exports.list = function(req, res) {
  Photofavorite.find().sort('-created').populate('user', 'displayName').exec(function(err, photofavorites) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photofavorites);
    }
  });
};

/**
 * Photofavorite middleware
 */
exports.photofavoriteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Photofavorite is invalid'
    });
  }

  Photofavorite.findById(id).populate('user', 'displayName').exec(function (err, photofavorite) {
    if (err) {
      return next(err);
    } else if (!photofavorite) {
      return res.status(404).send({
        message: 'No Photofavorite with that identifier has been found'
      });
    }
    req.photofavorite = photofavorite;
    next();
  });
};
