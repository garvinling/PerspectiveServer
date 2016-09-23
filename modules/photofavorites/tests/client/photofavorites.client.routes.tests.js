(function () {
  'use strict';

  describe('Photofavorites Route Tests', function () {
    // Initialize global variables
    var $scope,
      PhotofavoritesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PhotofavoritesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PhotofavoritesService = _PhotofavoritesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('photofavorites');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/photofavorites');
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
          PhotofavoritesController,
          mockPhotofavorite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('photofavorites.view');
          $templateCache.put('modules/photofavorites/client/views/view-photofavorite.client.view.html', '');

          // create mock Photofavorite
          mockPhotofavorite = new PhotofavoritesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Photofavorite Name'
          });

          // Initialize Controller
          PhotofavoritesController = $controller('PhotofavoritesController as vm', {
            $scope: $scope,
            photofavoriteResolve: mockPhotofavorite
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:photofavoriteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.photofavoriteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            photofavoriteId: 1
          })).toEqual('/photofavorites/1');
        }));

        it('should attach an Photofavorite to the controller scope', function () {
          expect($scope.vm.photofavorite._id).toBe(mockPhotofavorite._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/photofavorites/client/views/view-photofavorite.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PhotofavoritesController,
          mockPhotofavorite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('photofavorites.create');
          $templateCache.put('modules/photofavorites/client/views/form-photofavorite.client.view.html', '');

          // create mock Photofavorite
          mockPhotofavorite = new PhotofavoritesService();

          // Initialize Controller
          PhotofavoritesController = $controller('PhotofavoritesController as vm', {
            $scope: $scope,
            photofavoriteResolve: mockPhotofavorite
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.photofavoriteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/photofavorites/create');
        }));

        it('should attach an Photofavorite to the controller scope', function () {
          expect($scope.vm.photofavorite._id).toBe(mockPhotofavorite._id);
          expect($scope.vm.photofavorite._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/photofavorites/client/views/form-photofavorite.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PhotofavoritesController,
          mockPhotofavorite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('photofavorites.edit');
          $templateCache.put('modules/photofavorites/client/views/form-photofavorite.client.view.html', '');

          // create mock Photofavorite
          mockPhotofavorite = new PhotofavoritesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Photofavorite Name'
          });

          // Initialize Controller
          PhotofavoritesController = $controller('PhotofavoritesController as vm', {
            $scope: $scope,
            photofavoriteResolve: mockPhotofavorite
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:photofavoriteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.photofavoriteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            photofavoriteId: 1
          })).toEqual('/photofavorites/1/edit');
        }));

        it('should attach an Photofavorite to the controller scope', function () {
          expect($scope.vm.photofavorite._id).toBe(mockPhotofavorite._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/photofavorites/client/views/form-photofavorite.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
