(function () {
  'use strict';

  // Favorites controller
  angular
    .module('favorites')
    .controller('FavoritesController', FavoritesController);

  FavoritesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'favoriteResolve'];

  function FavoritesController ($scope, $state, $window, Authentication, favorite) {
    var vm = this;

    vm.authentication = Authentication;
    vm.favorite = favorite;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Favorite
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.favorite.$remove($state.go('favorites.list'));
      }
    }

    // Save Favorite
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.favoriteForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.favorite._id) {
        vm.favorite.$update(successCallback, errorCallback);
      } else {
        vm.favorite.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('favorites.view', {
          favoriteId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
