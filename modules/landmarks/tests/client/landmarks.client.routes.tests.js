(function () {
  'use strict';

  describe('Landmarks Route Tests', function () {
    // Initialize global variables
    var $scope,
      LandmarksService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LandmarksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LandmarksService = _LandmarksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('landmarks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/landmarks');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          LandmarksController,
          mockLandmark;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('landmarks.view');
          $templateCache.put('modules/landmarks/client/views/view-landmark.client.view.html', '');

          // create mock Landmark
          mockLandmark = new LandmarksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Landmark Name'
          });

          //Initialize Controller
          LandmarksController = $controller('LandmarksController as vm', {
            $scope: $scope,
            landmarkResolve: mockLandmark
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:landmarkId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.landmarkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            landmarkId: 1
          })).toEqual('/landmarks/1');
        }));

        it('should attach an Landmark to the controller scope', function () {
          expect($scope.vm.landmark._id).toBe(mockLandmark._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/landmarks/client/views/view-landmark.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LandmarksController,
          mockLandmark;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('landmarks.create');
          $templateCache.put('modules/landmarks/client/views/form-landmark.client.view.html', '');

          // create mock Landmark
          mockLandmark = new LandmarksService();

          //Initialize Controller
          LandmarksController = $controller('LandmarksController as vm', {
            $scope: $scope,
            landmarkResolve: mockLandmark
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.landmarkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/landmarks/create');
        }));

        it('should attach an Landmark to the controller scope', function () {
          expect($scope.vm.landmark._id).toBe(mockLandmark._id);
          expect($scope.vm.landmark._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/landmarks/client/views/form-landmark.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LandmarksController,
          mockLandmark;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('landmarks.edit');
          $templateCache.put('modules/landmarks/client/views/form-landmark.client.view.html', '');

          // create mock Landmark
          mockLandmark = new LandmarksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Landmark Name'
          });

          //Initialize Controller
          LandmarksController = $controller('LandmarksController as vm', {
            $scope: $scope,
            landmarkResolve: mockLandmark
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:landmarkId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.landmarkResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            landmarkId: 1
          })).toEqual('/landmarks/1/edit');
        }));

        it('should attach an Landmark to the controller scope', function () {
          expect($scope.vm.landmark._id).toBe(mockLandmark._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/landmarks/client/views/form-landmark.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
