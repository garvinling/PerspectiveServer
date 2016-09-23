'use strict';

/**
 * Module dependencies
 */
var photofavoritesPolicy = require('../policies/photofavorites.server.policy'),
  photofavorites = require('../controllers/photofavorites.server.controller');

module.exports = function(app) {
  // Photofavorites Routes
  app.route('/api/photofavorites').all(photofavoritesPolicy.isAllowed)
    .get(photofavorites.list)
    .post(photofavorites.create);

  app.route('/api/photofavorites/:photofavoriteId').all(photofavoritesPolicy.isAllowed)
    .get(photofavorites.read)
    .put(photofavorites.update)
    .delete(photofavorites.delete);

  // Finish by binding the Photofavorite middleware
  app.param('photofavoriteId', photofavorites.photofavoriteByID);
};
