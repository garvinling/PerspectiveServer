(function () {
  'use strict';

  angular
    .module('favorites')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('favorites', {
        abstract: true,
        url: '/favorites',
        template: '<ui-view/>'
      })
      .state('favorites.list', {
        url: '',
        templateUrl: 'modules/favorites/client/views/list-favorites.client.view.html',
        controller: 'FavoritesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Favorites List'
        }
      })
      .state('favorites.create', {
        url: '/create',
        templateUrl: 'modules/favorites/client/views/form-favorite.client.view.html',
        controller: 'FavoritesController',
        controllerAs: 'vm',
        resolve: {
          favoriteResolve: newFavorite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Favorites Create'
        }
      })
      .state('favorites.edit', {
        url: '/:favoriteId/edit',
        templateUrl: 'modules/favorites/client/views/form-favorite.client.view.html',
        controller: 'FavoritesController',
        controllerAs: 'vm',
        resolve: {
          favoriteResolve: getFavorite
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Favorite {{ favoriteResolve.name }}'
        }
      })
      .state('favorites.view', {
        url: '/:favoriteId',
        templateUrl: 'modules/favorites/client/views/view-favorite.client.view.html',
        controller: 'FavoritesController',
        controllerAs: 'vm',
        resolve: {
          favoriteResolve: getFavorite
        },
        data: {
          pageTitle: 'Favorite {{ favoriteResolve.name }}'
        }
      });
  }

  getFavorite.$inject = ['$stateParams', 'FavoritesService'];

  function getFavorite($stateParams, FavoritesService) {
    return FavoritesService.get({
      favoriteId: $stateParams.favoriteId
    }).$promise;
  }

  newFavorite.$inject = ['FavoritesService'];

  function newFavorite(FavoritesService) {
    return new FavoritesService();
  }
}());
