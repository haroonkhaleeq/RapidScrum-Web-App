'use strict';

(function () {
  // Sprints Controller Spec
  describe('Sprints Controller Tests', function () {
    // Initialize global variables
    var SprintsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Sprints,
      mockSprint;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Sprints_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Sprints = _Sprints_;

      // create mock sprint
      mockSprint = new Sprints({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Sprint about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Sprints controller.
      SprintsController = $controller('SprintsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one sprint object fetched from XHR', inject(function (Sprints) {
      // Create a sample sprints array that includes the new sprint
      var sampleSprints = [mockSprint];

      // Set GET response
      $httpBackend.expectGET('api/sprints').respond(sampleSprints);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.sprints).toEqualData(sampleSprints);
    }));

    it('$scope.findOne() should create an array with one sprint object fetched from XHR using a sprintId URL parameter', inject(function (Sprints) {
      // Set the URL parameter
      $stateParams.sprintId = mockSprint._id;

      // Set GET response
      $httpBackend.expectGET(/api\/sprints\/([0-9a-fA-F]{24})$/).respond(mockSprint);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.sprint).toEqualData(mockSprint);
    }));

    describe('$scope.create()', function () {
      var sampleSprintPostData;

      beforeEach(function () {
        // Create a sample sprint object
        sampleSprintPostData = new Sprints({
          title: 'An Sprint about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Sprint about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Sprints) {
        // Set POST response
        $httpBackend.expectPOST('api/sprints', sampleSprintPostData).respond(mockSprint);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the sprint was created
        expect($location.path.calls.mostRecent().args[0]).toBe('sprints/' + mockSprint._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/sprints', sampleSprintPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock sprint in scope
        scope.sprint = mockSprint;
      });

      it('should update a valid sprint', inject(function (Sprints) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/sprints\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/sprints/' + mockSprint._id);
      }));

      it('should set scope.error to error response message', inject(function (Sprints) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/sprints\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(sprint)', function () {
      beforeEach(function () {
        // Create new sprints array and include the sprint
        scope.sprints = [mockSprint, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/sprints\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockSprint);
      });

      it('should send a DELETE request with a valid sprintId and remove the sprint from the scope', inject(function (Sprints) {
        expect(scope.sprints.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.sprint = mockSprint;

        $httpBackend.expectDELETE(/api\/sprints\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to sprints', function () {
        expect($location.path).toHaveBeenCalledWith('sprints');
      });
    });
  });
}());
