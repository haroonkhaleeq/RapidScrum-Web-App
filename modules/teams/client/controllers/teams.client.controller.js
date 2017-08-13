'use strict';

// Teams controller
angular.module('teams').controller('TeamsController', ['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Teams', 'Users',
    function ($scope, $stateParams, $location, $http, Authentication, Teams, Users) {
        $scope.authentication = Authentication;


        // Find a list of users for teams
        var usersListData = [];
        $scope.users = Users.query(function (users) {
            users.filter(function (user) {
                usersListData.push({
                    "id": user._id,
                    "label": user.displayName
                });
            });
        });


        $scope.membersmodel = [];
        //$scope.membersdata = [ {id: 1, label: "David"}, {id: 2, label: "Jhon"}, {id: 3, label: "Danny"}];
        $scope.membersdata = usersListData;

        $scope.memberscustomTexts = {buttonDefaultText: 'Select Member'};
        $scope.memberssettings = {
            enableSearch: true,
            smartButtonMaxItems: 10,
            smartButtonTextConverter: function (itemText, originalItem) {
                if (itemText === 'Jhon') {
                    return 'Jhonny!';
                }

                return itemText;
            }
        };


        // Create new Team
        $scope.create = function (isValid) {

            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'teamForm');

                return false;
            }

            // Create new Team object
            var team = new Teams({
                title: this.title,
                content: this.content
            });


            var membersArray = [];
            angular.forEach(this.membersmodel, function (single) {

                membersArray.push(single.id);
            });

            team.members = membersArray;


            // Redirect after save
            team.$save(function (response) {
                $location.path('teams/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.content = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Team
        $scope.remove = function (team) {
            if (team) {
                team.$remove();

                for (var i in $scope.teams) {
                    if ($scope.teams[i] === team) {
                        $scope.teams.splice(i, 1);
                    }
                }
            } else {
                $scope.team.$remove(function () {
                    $location.path('teams');
                });
            }
        };

        // Update existing Team
        $scope.update = function (isValid) {


            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'teamForm');

                return false;
            }

            var team = $scope.team;

            var membersArray = [];
            angular.forEach(this.membersmodel, function (single) {

                membersArray.push(single.id);
            });

            team.members = membersArray;

            team.$update(function () {
                $location.path('teams/' + team._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of teams
        $scope.find = function () {
            $scope.teams = Teams.query();
        };

        // Find existing Team
        $scope.findOne = function () {
            $scope.team = Teams.get({
                teamId: $stateParams.teamId
            }, function (team) {
                var selectedMembersArray = [];
                angular.forEach(team.members, function (single) {

                    selectedMembersArray.push({id: single});
                });


                $scope.membersmodel = selectedMembersArray;

            });


        };
    }
]);
