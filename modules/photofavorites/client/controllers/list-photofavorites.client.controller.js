(function () {
  'use strict';

  angular
    .module('photofavorites')
    .controller('PhotofavoritesListController', PhotofavoritesListController);

  PhotofavoritesListController.$inject = ['PhotofavoritesService'];

  function PhotofavoritesListController(PhotofavoritesService) {
    var vm = this;

    vm.photofavorites = PhotofavoritesService.query();
  }
}());
