(function () {
  'use strict';

  // Photofavorites controller
  angular
    .module('photofavorites')
    .controller('PhotofavoritesController', PhotofavoritesController);

  PhotofavoritesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'photofavoriteResolve'];

  function PhotofavoritesController ($scope, $state, $window, Authentication, photofavorite) {
    var vm = this;

    vm.authentication = Authentication;
    vm.photofavorite = photofavorite;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Photofavorite
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.photofavorite.$remove($state.go('photofavorites.list'));
      }
    }

    // Save Photofavorite
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.photofavoriteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.photofavorite._id) {
        vm.photofavorite.$update(successCallback, errorCallback);
      } else {
        vm.photofavorite.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('photofavorites.view', {
          photofavoriteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
