// Favorites service used to communicate Favorites REST endpoints
(function () {
  'use strict';

  angular
    .module('favorites')
    .factory('FavoritesService', FavoritesService);

  FavoritesService.$inject = ['$resource'];

  function FavoritesService($resource) {
    return $resource('api/favorites/:favoriteId', {
      favoriteId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
