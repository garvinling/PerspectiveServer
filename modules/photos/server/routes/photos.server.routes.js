'use strict';

/**
 * Module dependencies
 */
var photosPolicy = require('../policies/photos.server.policy'),
  photos = require('../controllers/photos.server.controller');

module.exports = function(app) {
  // Photos Routes
  app.route('/api/photos').all(photosPolicy.isAllowed)
    .get(photos.list)
    .post(photos.create);



  //Single photo operations
  app.route('/api/photos/:photoId').all(photosPolicy.isAllowed)
    .get(photos.read)
    .put(photos.update)
    .delete(photos.delete);



  //Photo Favoriting
  app.route('/api/1.0/photos/favorites/create').all(photosPolicy.isAllowed)
    .post(photos.favoritePhoto);




  //Photofeed operations 
  app.route('/api/photos/feed/:landmarkId').all(photosPolicy.isAllowed)
    .get(photos.getFeed);



  // Finish by binding the Photo middleware
  app.param('photoId', photos.photoByID);
};
