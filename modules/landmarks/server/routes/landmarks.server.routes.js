'use strict';

/**
 * Module dependencies
 */
var landmarksPolicy = require('../policies/landmarks.server.policy'),
  landmarks = require('../controllers/landmarks.server.controller');

module.exports = function(app) {
  // Landmarks Routes
  app.route('/api/landmarks').all(landmarksPolicy.isAllowed)
    .get(landmarks.list)
    .post(landmarks.create);

  app.route('/api/landmarks/:landmarkId').all(landmarksPolicy.isAllowed)
    .get(landmarks.read)
    .put(landmarks.update)
    .delete(landmarks.delete);











  // Finish by binding the Landmark middleware
  app.param('landmarkId', landmarks.landmarkByID);
};
