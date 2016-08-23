'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Landmark = mongoose.model('Landmark'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Landmark
 */
exports.create = function(req, res) {
  var landmark  = new Landmark(req.body);
  landmark.user = req.user;

  console.log(landmark);
  console.log(req.body);
  
  landmark.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(landmark);
    }
  });
};

/**
 * Show the current Landmark
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var landmark = req.landmark ? req.landmark.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  landmark.isCurrentUserOwner = req.user && landmark.user && landmark.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(landmark);
};

/**
 * Update a Landmark
 */
exports.update = function(req, res) {
  var landmark = req.landmark ;

  landmark = _.extend(landmark , req.body);

  landmark.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(landmark);
    }
  });
};

/**
 * Delete an Landmark
 */
exports.delete = function(req, res) {
  var landmark = req.landmark ;

  landmark.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(landmark);
    }
  });
};


/**
 * List of Landmarks
 */
exports.list = function(req, res) { 
  Landmark.find().sort('-created').populate('user', 'displayName').exec(function(err, landmarks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(landmarks);
    }
  });
};

/**
 * Landmark middleware
 */
exports.landmarkByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Landmark is invalid'
    });
  }

  Landmark.findById(id).populate('user', 'displayName').exec(function (err, landmark) {
    if (err) {
      return next(err);
    } else if (!landmark) {
      return res.status(404).send({
        message: 'No Landmark with that identifier has been found'
      });
    }
    req.landmark = landmark;
    next();
  });
};
