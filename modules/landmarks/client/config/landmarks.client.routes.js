(function () {
  'use strict';

  angular
    .module('landmarks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('landmarks', {
        abstract: true,
        url: '/landmarks',
        template: '<ui-view/>'
      })
      .state('landmarks.list', {
        url: '',
        templateUrl: 'modules/landmarks/client/views/list-landmarks.client.view.html',
        controller: 'LandmarksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Landmarks List'
        }
      })
      .state('landmarks.create', {
        url: '/create',
        templateUrl: 'modules/landmarks/client/views/form-landmark.client.view.html',
        controller: 'LandmarksController',
        controllerAs: 'vm',
        resolve: {
          landmarkResolve: newLandmark
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Landmarks Create'
        }
      })
      .state('landmarks.edit', {
        url: '/:landmarkId/edit',
        templateUrl: 'modules/landmarks/client/views/form-landmark.client.view.html',
        controller: 'LandmarksController',
        controllerAs: 'vm',
        resolve: {
          landmarkResolve: getLandmark
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Landmark {{ landmarkResolve.name }}'
        }
      })
      .state('landmarks.view', {
        url: '/:landmarkId',
        templateUrl: 'modules/landmarks/client/views/view-landmark.client.view.html',
        controller: 'LandmarksController',
        controllerAs: 'vm',
        resolve: {
          landmarkResolve: getLandmark
        },
        data:{
          pageTitle: 'Landmark {{ articleResolve.name }}'
        }
      });
  }

  getLandmark.$inject = ['$stateParams', 'LandmarksService'];

  function getLandmark($stateParams, LandmarksService) {
    return LandmarksService.get({
      landmarkId: $stateParams.landmarkId
    }).$promise;
  }

  newLandmark.$inject = ['LandmarksService'];

  function newLandmark(LandmarksService) {
    return new LandmarksService();
  }
})();
