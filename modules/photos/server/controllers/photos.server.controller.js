'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose       = require('mongoose'),
  Photo          = mongoose.model('Photo'),
  errorHandler   = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  PhotoFavorites = require(path.resolve('./modules/photofavorites/server/controllers/photofavorites.server.controller')),
  Q              = require('q'),
  _              = require('lodash');

















/**
 * Create a Photo
 */
exports.create = function(req, res) {
  var photo = new Photo(req.body);
  photo.user = req.user;

  //TODO: Check if the landmark has no photos. Automatically make the image = leaderImage.
  
  photo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photo);
    }
  });
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var photo = req.photo ? req.photo.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  photo.isCurrentUserOwner = req.user && photo.user && photo.user._id.toString() === req.user._id.toString();

  res.jsonp(photo);
};

/**
 * Update a Photo
 */
exports.update = function(req, res) {
  var photo = req.photo;

  photo = _.extend(photo, req.body);

  photo.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photo);
    }
  });
};

/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
  var photo = req.photo;

  photo.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photo);
    }
  });
};

/**
 * List of Photos
 */
exports.list = function(req, res) {
  Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(photos);
    }
  });
};




/**
 * Returns photo feed for the landmark ID
 */

exports.getFeed = function(req,res){ 

  Photo.find(
  {
    landmark_id : req.params.landmarkId
  }).lean().exec(function(err,data){

    if(err){

        console.log('Error: ' + err);
        return res.status(400).send({
          message : errorHandler.getErrorMessage(err)
        });
      
      } else {

        console.log(data);
        res.jsonp(data);

      }


  });


};



exports.favoritePhoto = function(req,res){

  var photoID = req.body.photo_id;
  var userID  = req.body.user_id;

  if(!photoID) {

    return res.status(400).send({

      message : 'Missing required field `photo_id` '

    });

  }

  if(!userID) {

    return res.status(400).send({

      message : 'Missing required field `user_id` '

    });
  }

  PhotoFavorites.createFavoriteLink(userID,photoID)
    .then(function(result){
        if(result === true) {

          Photo.update({_id : photoID},{$inc : {likes:1}}).exec(function(err,data){

            if(err){
              return res.status(400).send({
                message : errorHandler.getErrorMessage(err)
              });
            } 

            return res.status(200).send({

                message : 'Photo Liked!'

            });
          });

        } else {

          return res.status(200).send({

              message : 'Cannot like an already liked photo!'
          });

        }
    });
};


exports.unfavoritePhoto = function(req,res){

  var photoID = req.body.photo_id;
  var userID  = req.body.user_id;

  if(!photoID) {

    return res.status(400).send({

      message : 'Missing required field `photo_id` '

    });

  }

  if(!userID) {

    return res.status(400).send({

      message : 'Missing required field `user_id` '

    });
  }


  PhotoFavorites.destroyFavoriteLink(userID,photoID)
    .then(function(result){

      if(result){
        Photo.update({_id : photoID},{$inc : {likes:-1}}).exec(function(err,data){

            if(err){
              return res.status(400).send({
                message : errorHandler.getErrorMessage(err)
              });
            } 

            return res.status(200).send({

               message:'Unfavorite successful'

            });
          });
      } else {

        res.send({message:'User has not favorited this photo.'});
     
      }
    });
};




/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Photo is invalid'
    });
  }

  Photo.findById(id).populate('user', 'displayName').exec(function (err, photo) {
    if (err) {
      return next(err);
    } else if (!photo) {
      return res.status(404).send({
        message: 'No Photo with that identifier has been found'
      });
    }
    req.photo = photo;
    next();
  });
};







