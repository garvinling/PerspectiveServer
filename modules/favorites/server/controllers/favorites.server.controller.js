'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Favorite = mongoose.model('Favorite'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Favorite
 */
exports.create = function(req, res) {
  var favorite = new Favorite(req.body);
  favorite.user = req.user;

  favorite.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(favorite);
    }
  });
};

/**
 * Show the current Favorite
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var favorite = req.favorite ? req.favorite.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  favorite.isCurrentUserOwner = req.user && favorite.user && favorite.user._id.toString() === req.user._id.toString();

  res.jsonp(favorite);
};

/**
 * Update a Favorite
 */
exports.update = function(req, res) {
  var favorite = req.favorite;

  favorite = _.extend(favorite, req.body);

  favorite.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(favorite);
    }
  });
};

/**
 * Delete an Favorite
 */
exports.delete = function(req, res) {
  var favorite = req.favorite;

  favorite.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(favorite);
    }
  });
};

/**
 * List of Favorites
 */
exports.list = function(req, res) {
  Favorite.find().sort('-created').populate('user', 'displayName').exec(function(err, favorites) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(favorites);
    }
  });
};

/**
 * Favorite middleware
 */
exports.favoriteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Favorite is invalid'
    });
  }

  Favorite.findById(id).populate('user', 'displayName').exec(function (err, favorite) {
    if (err) {
      return next(err);
    } else if (!favorite) {
      return res.status(404).send({
        message: 'No Favorite with that identifier has been found'
      });
    }
    req.favorite = favorite;
    next();
  });
};
