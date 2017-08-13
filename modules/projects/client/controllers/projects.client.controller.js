'use strict';

//angular.module('projects', ['ngAnimate', 'ui.bootstrap']);


// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', 'Teams',
    function ($scope, $stateParams, $location, Authentication, Projects, Teams) {
        $scope.authentication = Authentication;


        // Find a list of teams for project
        var teamsListData = [];
        $scope.teams = Teams.query(function (teams) {

            teams.filter(function (team) {
                teamsListData.push({
                    "id": team._id,
                    "label": team.title
                });
            });
        });


        $scope.teamsmodel = [];
        $scope.teamsdata = teamsListData;

        $scope.teamscustomTexts = {buttonDefaultText: 'Select Team'};
        $scope.teamssettings = {
            enableSearch: true,
            smartButtonMaxItems: 10,
            smartButtonTextConverter: function (itemText, originalItem) {
                return itemText;
            }
        };


        // Create new Article
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'projectForm');

                return false;
            }


            var stdate = new Date(this.startDate);
            stdate.setHours(stdate.getHours() + 1);

            var enddate = new Date(this.endDate);
            enddate.setHours(enddate.getHours() + 1);


            // Create new Article object
            var project = new Projects({
                title: this.title,
                content: this.content,
                status: this.status,
                startDate: stdate,
                endDate: enddate
            });

            var teamsArray = [];
            angular.forEach(this.teamsmodel, function (single) {

                teamsArray.push(single.id);
            });

            project.teams = teamsArray;


            // Redirect after save
            project.$save(function (response) {
                $location.path('projects/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Article
        $scope.remove = function (project) {
            if (project) {
                project.$remove();

                for (var i in $scope.projects) {
                    if ($scope.projects[i] === project) {
                        $scope.projects.splice(i, 1);
                    }
                }
            } else {
                $scope.project.$remove(function () {
                    $location.path('projects');
                });
            }
        };

        $scope.removeById = function (project) {
            Projects.get({
                projectId: project.projectId
            }, function (project) {


                project.$remove(function () {
                    window.location.reload();
                });


            });


        };

        // Update existing Article
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'projectForm');

                return false;
            }

            var project = $scope.project;

            var teamsArray = [];
            angular.forEach(this.teamsmodel, function (single) {

                teamsArray.push(single.id);
            });



            project.teams = teamsArray;


            project.$update(function () {
                $location.path('projects/' + project._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Project
        $scope.find = function () {
            $scope.projects = Projects.query();
        };

        // Find existing Article
        $scope.findOne = function () {
            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                var selectedTeamsArray = [];
                angular.forEach(project.teams, function (single) {

                    selectedTeamsArray.push({id: single});
                });


                $scope.teamsmodel = selectedTeamsArray;

            });
        };

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        $scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup1 = {
            opened: false
        };

        $scope.popup2 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };
    }
]);
