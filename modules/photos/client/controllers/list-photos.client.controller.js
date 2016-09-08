(function () {
  'use strict';

  angular
    .module('photos')
    .controller('PhotosListController', PhotosListController);

  PhotosListController.$inject = ['PhotosService'];

  function PhotosListController(PhotosService) {
    var vm = this;

    vm.photos = PhotosService.query();
  }
}());
