'use strict';

// Backlogs controller
angular.module('backlogs').controller('BacklogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Backlogs', 'Projects',
    function ($scope, $stateParams, $location, Authentication, Backlogs, Projects) {
        $scope.authentication = Authentication;

        // Find a list of Project

        // Find a list of teams for project
        var projectsListData = [];
        $scope.projects = Projects.query(function (projects) {

            projects.filter(function (project) {
                projectsListData.push({
                    "id": project._id,
                    "label": project.title
                });
            });
        });

        $scope.projectsdata = projectsListData;


        // Create new Backlog
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'backlogForm');

                return false;
            }

            // Create new Backlog object
            var backlog = new Backlogs({
                title: this.title,
                description: this.description,
                project_id: this.project_id,
                type: this.type,
                priority: this.priority,
                status: this.status
            });


            // Redirect after save
            backlog.$save(function (response) {
                $location.path('backlogs/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.description = '';
                $scope.project_id = '';
                $scope.type = '';
                $scope.priority = '';
                $scope.status = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Backlog
        $scope.remove = function (backlog) {
            if (backlog) {
                backlog.$remove();

                for (var i in $scope.backlogs) {
                    if ($scope.backlogs[i] === backlog) {
                        $scope.backlogs.splice(i, 1);
                    }
                }
            } else {
                $scope.backlog.$remove(function () {
                    $location.path('backlogs');
                });
            }
        };

        $scope.removeById = function (backlog) {
            Backlogs.get({
                backlogId: backlog.backlogId
            }, function (backlog) {


                backlog.$remove(function () {
                    window.location.reload();
                });


            });


        };

        // Update existing Backlog
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'backlogForm');

                return false;
            }

            var backlog = $scope.backlog;

            backlog.$update(function () {
                $location.path('backlogs/' + backlog._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Backlog
        $scope.find = function () {
            $scope.backlogs = Backlogs.query();
        };

        // Find existing Backlog
        $scope.findOne = function () {
            $scope.backlog = Backlogs.get({
                backlogId: $stateParams.backlogId
            });

            $scope.backlog = Backlogs.get({
                backlogId: $stateParams.backlogId
            }, function (backlog) {

                $scope.project_id = backlog.project_id;

            });

        };

        $scope.findByProject = function () {

            var projectsListData = [];
            $scope.projets = Projects.query(function (projects) {


                projects.filter(function (project) {
                    projectsListData.push({
                        "id": project._id,
                        "label": project.title
                    });


                    $scope.projectsdata = projectsListData;

                });
            });


            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project_id = {
                    "id": project._id,
                    "label": project.title
                };
            });


            var pid = $stateParams.projectId;
            var backlogsData = [];
            Backlogs.query({
                project_id: pid
            }, function (backlogs) {

                backlogs.filter(function (backlog) {

                    if (backlog.project_id == pid) {
                        backlogsData.push(backlog);
                    }


                });

                $scope.backlogs = backlogsData;

            });


            $scope.projectChange = function (id) {
                $location.path('backlog/' + id);
            };

        };

    }
]);
