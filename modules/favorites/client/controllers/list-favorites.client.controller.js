(function () {
  'use strict';

  angular
    .module('favorites')
    .controller('FavoritesListController', FavoritesListController);

  FavoritesListController.$inject = ['FavoritesService'];

  function FavoritesListController(FavoritesService) {
    var vm = this;

    vm.favorites = FavoritesService.query();
  }
}());
