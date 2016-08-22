(function () {
  'use strict';

  angular
    .module('landmarks')
    .controller('LandmarksListController', LandmarksListController);

  LandmarksListController.$inject = ['LandmarksService'];

  function LandmarksListController(LandmarksService) {
    var vm = this;

    vm.landmarks = LandmarksService.query();
  }
})();
