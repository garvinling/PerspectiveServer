(function () {
  'use strict';

  // Photos controller
  angular
    .module('photos')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['$scope', '$state', '$window', 'Authentication', 'photoResolve'];

  function PhotosController ($scope, $state, $window, Authentication, photo) {
    var vm = this;

    vm.authentication = Authentication;
    vm.photo = photo;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Photo
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.photo.$remove($state.go('photos.list'));
      }
    }

    // Save Photo
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.photoForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.photo._id) {
        vm.photo.$update(successCallback, errorCallback);
      } else {
        vm.photo.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('photos.view', {
          photoId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
