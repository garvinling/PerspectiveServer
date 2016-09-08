(function () {
  'use strict';

  angular
    .module('photos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('photos', {
        abstract: true,
        url: '/photos',
        template: '<ui-view/>'
      })
      .state('photos.list', {
        url: '',
        templateUrl: 'modules/photos/client/views/list-photos.client.view.html',
        controller: 'PhotosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Photos List'
        }
      })
      .state('photos.create', {
        url: '/create',
        templateUrl: 'modules/photos/client/views/form-photo.client.view.html',
        controller: 'PhotosController',
        controllerAs: 'vm',
        resolve: {
          photoResolve: newPhoto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Photos Create'
        }
      })
      .state('photos.edit', {
        url: '/:photoId/edit',
        templateUrl: 'modules/photos/client/views/form-photo.client.view.html',
        controller: 'PhotosController',
        controllerAs: 'vm',
        resolve: {
          photoResolve: getPhoto
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Photo {{ photoResolve.name }}'
        }
      })
      .state('photos.view', {
        url: '/:photoId',
        templateUrl: 'modules/photos/client/views/view-photo.client.view.html',
        controller: 'PhotosController',
        controllerAs: 'vm',
        resolve: {
          photoResolve: getPhoto
        },
        data: {
          pageTitle: 'Photo {{ photoResolve.name }}'
        }
      });
  }

  getPhoto.$inject = ['$stateParams', 'PhotosService'];

  function getPhoto($stateParams, PhotosService) {
    return PhotosService.get({
      photoId: $stateParams.photoId
    }).$promise;
  }

  newPhoto.$inject = ['PhotosService'];

  function newPhoto(PhotosService) {
    return new PhotosService();
  }
}());
