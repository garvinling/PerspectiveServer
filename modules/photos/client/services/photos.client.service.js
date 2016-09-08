// Photos service used to communicate Photos REST endpoints
(function () {
  'use strict';

  angular
    .module('photos')
    .factory('PhotosService', PhotosService);

  PhotosService.$inject = ['$resource'];

  function PhotosService($resource) {
    return $resource('api/photos/:photoId', {
      photoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
