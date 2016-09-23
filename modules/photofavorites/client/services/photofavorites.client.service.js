// Photofavorites service used to communicate Photofavorites REST endpoints
(function () {
  'use strict';

  angular
    .module('photofavorites')
    .factory('PhotofavoritesService', PhotofavoritesService);

  PhotofavoritesService.$inject = ['$resource'];

  function PhotofavoritesService($resource) {
    return $resource('api/photofavorites/:photofavoriteId', {
      photofavoriteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
