'use strict';

// Sprints controller
angular.module('sprints').controller('SprintsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sprints', 'Projects', 'Backlogs',
  function ($scope, $stateParams, $location, Authentication, Sprints , Projects, Backlogs) {
    $scope.authentication = Authentication;


      // Find a list of teams for project
      var projectsListData = [];
      $scope.projects = Projects.query(function(projects) {

          projects.filter(function(project) {
              projectsListData.push({
                  "id" : project._id,
                  "label"  : project.title
              });
          }) ;
      });
      
      $scope.projectsdata = projectsListData;

      $scope.backlogsmodel = [];
               

      $scope.customTexts = {buttonDefaultText: 'Select Backlog Iitems'};
      $scope.backlog_settings = {
          enableSearch: true ,
          smartButtonMaxItems: 10,
          smartButtonTextConverter: function(itemText, originalItem) {
              if (itemText === 'Jhon') {
                  return 'Jhonny!';
              }

              return itemText;
          }
      };


    $scope.onProjectChange = function (selectedProject){

        // clear the selected backlogs items
        $scope.backlogsmodel = [];

        // container for the fitered backlog items related to the selected project
          var filteredBacklogList = [];

        $scope.backlog_items = Backlogs.query(function(backlogs) {
          backlogs.filter(function(backlog) {

                if(backlog.project_id == selectedProject){                  
                    filteredBacklogList.push({
                      "id" : backlog._id,
                      "label"  : backlog.title
                    });                    
                }
  
              });        

              $scope.backlogsdata = filteredBacklogList;
              
        });
    };
     
    // Create new Sprint
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'sprintForm');

        return false;
      }

      // Create new Sprint object
      var sprint = new Sprints({
        title: this.title,
        content: this.content,          
          start_date: this.start_date,
          end_date: this.end_date,
          project_id: this.project_id
      });

      // storing the backlog items
      var items_list = [];
        angular.forEach(this.backlogsmodel, function (single) {        
        items_list.push(single.id);
      });
      sprint.backlog_items = items_list;

      // Redirect after save
      sprint.$save(function (response) {
        $location.path('sprints/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        $scope.project_id = '';
        $scope.start_date = '';
        $scope.end_date = '';
        $scope.backlog_items = [];

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Sprint
    $scope.remove = function (sprint) {
      if (sprint) {
        sprint.$remove();

        for (var i in $scope.sprints) {
          if ($scope.sprints[i] === sprint) {
            $scope.sprints.splice(i, 1);
          }
        }
      } else {
        $scope.sprint.$remove(function () {
          $location.path('sprints');
        });
      }
    };

    // Update existing Sprint
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'sprintForm');
        return false;
      }

      var sprint = $scope.sprint;

      // storing the backlog items
      var items_list = [];
        angular.forEach(this.backlogsmodel, function (single) {        
        items_list.push(single.id);
      });
            
      sprint.backlog_items = items_list;


      sprint.$update(function () {
        $location.path('sprints/' + sprint._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Sprint
    $scope.find = function () {
      $scope.sprints = Sprints.query();
      
    };

    // Find existing Sprint
    $scope.findOne = function () {
      $scope.sprint = Sprints.get({
          sprintId: $stateParams.sprintId          
      }, function (sprint) {
          $scope.project_id = sprint.project_id;

          // container for the fitered backlog items related to the selected project
          var filteredBacklogList = [];
          $scope.backlog_items = Backlogs.query(function(backlogs) {
            backlogs.filter(function(backlog) {
                  if(backlog.project_id == $scope.project_id._id){
                      filteredBacklogList.push({
                        "id" : backlog._id,
                        "label"  : backlog.title
                      });                    
                  }
                });
                $scope.backlogsdata = filteredBacklogList;                
          });

          var items_backlog = [];
          var items_b = [];
          angular.forEach(sprint.backlog_items, function (single) {
              items_backlog.push({id:single});
              items_b.push(single);
          });
          $scope.backlogsmodel = items_backlog;

          // for creating the links of backog items
          var backlog_links = [];
          $scope.backlog_items = Backlogs.query(function(backlogs) {
            backlogs.filter(function(backlog) {
                  if((backlog.project_id == $scope.project_id._id) && (items_b.indexOf(backlog._id) !== -1)) {
                      backlog_links.push({
                            "id" : backlog._id,
                            "label"  : backlog.title
                          });                                          
                  }
                });
                $scope.backlog_links = backlog_links;          
          });

      });
    };


      $scope.today = function() {
          $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function() {
          $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
          return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      };

      $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
      };

      $scope.toggleMin();
      $scope.maxDate = new Date(2020, 5, 22);

      $scope.open1 = function() {
          $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
          $scope.popup2.opened = true;
      };

      $scope.setDate = function(year, month, day) {
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

      $scope.getDayClass = function(date, mode) {
          if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i = 0; i < $scope.events.length; i++) {
                  var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                  if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                  }
              }
          }

          return '';
      };
  }
]);
