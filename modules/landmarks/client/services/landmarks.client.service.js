//Landmarks service used to communicate Landmarks REST endpoints
(function () {
  'use strict';

  angular
    .module('landmarks')
    .factory('LandmarksService', LandmarksService);

  LandmarksService.$inject = ['$resource'];

  function LandmarksService($resource) {
    return $resource('api/landmarks/:landmarkId', {
      landmarkId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
