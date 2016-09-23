(function () {
  'use strict';

  angular
    .module('photofavorites')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('photofavorites', {
        abstract: true,
        url: '/photofavorites',
        template: '<ui-view/>'
      })
      .state('photofavorites.list', {
        url: '',
        templateUrl: 'modules/photofavorites/client/views/list-photofavorites.client.view.html',
        controller: 'PhotofavoritesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Photofavorites List'
        }
      })
      .state('photofavorites.create', {
        url: '/create',
        templateUrl: 'modules/photofavorites/client/views/form-photofavorite.client.view.html',
        controller: 'PhotofavoritesController',
        controllerAs: 'vm',
        resolve: {
          photofavoriteResolve: newPhotofavorite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Photofavorites Create'
        }
      })
      .state('photofavorites.edit', {
        url: '/:photofavoriteId/edit',
        templateUrl: 'modules/photofavorites/client/views/form-photofavorite.client.view.html',
        controller: 'PhotofavoritesController',
        controllerAs: 'vm',
        resolve: {
          photofavoriteResolve: getPhotofavorite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Photofavorite {{ photofavoriteResolve.name }}'
        }
      })
      .state('photofavorites.view', {
        url: '/:photofavoriteId',
        templateUrl: 'modules/photofavorites/client/views/view-photofavorite.client.view.html',
        controller: 'PhotofavoritesController',
        controllerAs: 'vm',
        resolve: {
          photofavoriteResolve: getPhotofavorite
        },
        data: {
          pageTitle: 'Photofavorite {{ photofavoriteResolve.name }}'
        }
      });
  }

  getPhotofavorite.$inject = ['$stateParams', 'PhotofavoritesService'];

  function getPhotofavorite($stateParams, PhotofavoritesService) {
    return PhotofavoritesService.get({
      photofavoriteId: $stateParams.photofavoriteId
    }).$promise;
  }

  newPhotofavorite.$inject = ['PhotofavoritesService'];

  function newPhotofavorite(PhotofavoritesService) {
    return new PhotofavoritesService();
  }
}());
