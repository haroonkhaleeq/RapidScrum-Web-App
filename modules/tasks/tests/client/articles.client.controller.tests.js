'use strict';

(function () {
  // Articles Controller Spec
  describe('Articles Controller Tests', function () {
    // Initialize global variables
    var ProjectsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Articles,
      mockArticle;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Articles_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Articles = _Articles_;

      // create mock project
      mockArticle = new Articles({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Article about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Articles controller.
      ProjectsController = $controller('ProjectsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one project object fetched from XHR', inject(function (Articles) {
      // Create a sample projects array that includes the new project
      var sampleArticles = [mockArticle];

      // Set GET response
      $httpBackend.expectGET('api/projects').respond(sampleArticles);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.projects).toEqualData(sampleArticles);
    }));

    it('$scope.findOne() should create an array with one project object fetched from XHR using a articleId URL parameter', inject(function (Articles) {
      // Set the URL parameter
      $stateParams.articleId = mockArticle._id;

      // Set GET response
      $httpBackend.expectGET(/api\/projects\/([0-9a-fA-F]{24})$/).respond(mockArticle);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.project).toEqualData(mockArticle);
    }));

    describe('$scope.create()', function () {
      var sampleArticlePostData;

      beforeEach(function () {
        // Create a sample project object
        sampleArticlePostData = new Articles({
          title: 'An Article about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Article about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Articles) {
        // Set POST response
        $httpBackend.expectPOST('api/projects', sampleArticlePostData).respond(mockArticle);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the project was created
        expect($location.path.calls.mostRecent().args[0]).toBe('projects/' + mockArticle._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/projects', sampleArticlePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock project in scope
        scope.project = mockArticle;
      });

      it('should update a valid project', inject(function (Articles) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/projects\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/projects/' + mockArticle._id);
      }));

      it('should set scope.error to error response message', inject(function (Articles) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/projects\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(project)', function () {
      beforeEach(function () {
        // Create new projects array and include the project
        scope.projects = [mockArticle, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/projects\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockArticle);
      });

      it('should send a DELETE request with a valid articleId and remove the project from the scope', inject(function (Articles) {
        expect(scope.projects.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.project = mockArticle;

        $httpBackend.expectDELETE(/api\/projects\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to projects', function () {
        expect($location.path).toHaveBeenCalledWith('projects');
      });
    });
  });
}());
