(function () {
  'use strict';

  // Landmarks controller
  angular
    .module('landmarks')
    .controller('LandmarksController', LandmarksController);

  LandmarksController.$inject = ['$scope', '$state', 'Authentication', 'landmarkResolve'];

  function LandmarksController ($scope, $state, Authentication, landmark) {
    var vm = this;

    vm.authentication = Authentication;
    vm.landmark = landmark;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Landmark
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.landmark.$remove($state.go('landmarks.list'));
      }
    }

    // Save Landmark
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.landmarkForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.landmark._id) {
        vm.landmark.$update(successCallback, errorCallback);
      } else {
        vm.landmark.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('landmarks.view', {
          landmarkId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
