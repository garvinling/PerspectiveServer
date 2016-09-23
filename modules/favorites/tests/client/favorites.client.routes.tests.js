(function () {
  'use strict';

  describe('Favorites Route Tests', function () {
    // Initialize global variables
    var $scope,
      FavoritesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FavoritesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FavoritesService = _FavoritesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('favorites');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/favorites');
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
          FavoritesController,
          mockFavorite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('favorites.view');
          $templateCache.put('modules/favorites/client/views/view-favorite.client.view.html', '');

          // create mock Favorite
          mockFavorite = new FavoritesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Favorite Name'
          });

          // Initialize Controller
          FavoritesController = $controller('FavoritesController as vm', {
            $scope: $scope,
            favoriteResolve: mockFavorite
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:favoriteId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.favoriteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            favoriteId: 1
          })).toEqual('/favorites/1');
        }));

        it('should attach an Favorite to the controller scope', function () {
          expect($scope.vm.favorite._id).toBe(mockFavorite._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/favorites/client/views/view-favorite.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FavoritesController,
          mockFavorite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('favorites.create');
          $templateCache.put('modules/favorites/client/views/form-favorite.client.view.html', '');

          // create mock Favorite
          mockFavorite = new FavoritesService();

          // Initialize Controller
          FavoritesController = $controller('FavoritesController as vm', {
            $scope: $scope,
            favoriteResolve: mockFavorite
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.favoriteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/favorites/create');
        }));

        it('should attach an Favorite to the controller scope', function () {
          expect($scope.vm.favorite._id).toBe(mockFavorite._id);
          expect($scope.vm.favorite._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/favorites/client/views/form-favorite.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FavoritesController,
          mockFavorite;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('favorites.edit');
          $templateCache.put('modules/favorites/client/views/form-favorite.client.view.html', '');

          // create mock Favorite
          mockFavorite = new FavoritesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Favorite Name'
          });

          // Initialize Controller
          FavoritesController = $controller('FavoritesController as vm', {
            $scope: $scope,
            favoriteResolve: mockFavorite
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:favoriteId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.favoriteResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            favoriteId: 1
          })).toEqual('/favorites/1/edit');
        }));

        it('should attach an Favorite to the controller scope', function () {
          expect($scope.vm.favorite._id).toBe(mockFavorite._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/favorites/client/views/form-favorite.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
