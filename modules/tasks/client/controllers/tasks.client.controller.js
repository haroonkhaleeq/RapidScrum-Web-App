'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$http','$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Backlogs', 'Sprints', 'Projects', 'Teams', 'Admin' ,
    function ($http , $scope, $stateParams, $location, Authentication, Tasks, Backlogs , Sprints, Projects, Teams, Admin) {
        $scope.authentication = Authentication;



// Find a list of backlog items for tasks
        var backlogsListData = [];
        $scope.backlogs = Backlogs.query(function (backlogs) {

            backlogs.filter(function (backlog) {
                backlogsListData.push({
                    "id": backlog._id,
                    "label": backlog.title
                });
            });
        });


        $scope.backlogsdata = backlogsListData;

        $scope.dev_models = [];

        $scope.customTexts = {buttonDefaultText: 'Assigned Developers'};
        $scope.dev_settings = {
            enableSearch: true ,
            smartButtonMaxItems: 10,
            smartButtonTextConverter: function(itemText, originalItem) {
                if (itemText === 'Jhon') {
                    return 'Jhonny!';
                }

                return itemText;
            }
        };

        $scope.onBacklogChange = function (selectedBacklog){


            console.log("comming in change");
            $scope.dev_models = [];
            var list_of_members_id = [];

            $scope.backlog_id = selectedBacklog;

            $scope.backlog = Backlogs.get({
                backlogId: selectedBacklog
            },function(backlog) {

                $scope.project = Projects.get({
                    projectId: backlog.project_id
                },function(project) {

                    angular.forEach(project.teams, function (team) {

                        $scope.team = Teams.get({
                            teamId: team
                        },function(team) {
                            angular.forEach(team.members, function (member) {
                                list_of_members_id.push(member);
                            });

                        });

                    });

                });

            });




            setTimeout(function () {

                var user_list_data = [];
                angular.forEach(list_of_members_id, function (member) {

                    $scope.abc = Admin.get({
                        userId: member
                    },function(user) {

                        user_list_data.push({
                            "id": user._id,
                            "label": user.displayName,
                        });
                    });

                });

                $scope.assigned_user = user_list_data;

            }, 1000);




        };



        // Create new Task
        $scope.create = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'taskForm');

                return false;
            }

            // Create new Task object
            var task = new Tasks({
                title: this.title,
                status: this.status,
                backlog_id: this.backlog_id,
                assigned_user: this.assigned_user,
                content: this.content
            });

            // Redirect after save
            task.$save(function (response) {
                $location.path('tasks/' + response._id);

                // Clear form fields
                $scope.title = '';
                $scope.content = '';
                $scope.backlog_id = '';
                $scope.assigned_user = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Task
        $scope.remove = function (task) {
            if (task) {
                task.$remove();

                for (var i in $scope.tasks) {
                    if ($scope.tasks[i] === task) {
                        $scope.tasks.splice(i, 1);
                    }
                }
            } else {
                $scope.task.$remove(function () {
                    $location.path('tasks');
                });
            }
        };
        $scope.removeById = function (task) {
            Tasks.get({
                taskId: task.taskId
            }, function (task) {


                task.$remove(function () {
                    window.location.reload();
                });


            });


        };

        // Update existing Task
        $scope.update = function (isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'taskForm');

                return false;
            }

            var task = $scope.task;

            // storing the Assigned User
            var users_list = [];
            angular.forEach($scope.dev_models, function (single) {
                users_list.push(single.id);
            });

            console.log(users_list);
            task.assigned_user = users_list;


            task.$update(function () {
                $location.path('tasks/' + task._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });


        };

        // Find a list of Task
        $scope.find = function () {
            $scope.tasks = Tasks.query();
        };

        // Find existing Task
        $scope.findOne = function () {


            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            });

            var list_of_members_id = [];

            $scope.task = Tasks.get({
                taskId: $stateParams.taskId
            }, function (task) {

                $scope.backlog_id = task.backlog_id;

                $scope.backlog = Backlogs.get({
                    backlogId: task.backlog_id
                },function(backlog) {

                    $scope.project = Projects.get({
                        projectId: backlog.project_id
                    },function(project) {

                        angular.forEach(project.teams, function (team) {

                            $scope.team = Teams.get({
                                teamId: team
                            },function(team) {
                                angular.forEach(team.members, function (member) {
                                    list_of_members_id.push(member);
                                });

                            });

                        });

                    });

                });

                var user_selected_data = [];
                angular.forEach(task.assigned_user, function (member) {

                    $scope.dev_models = Admin.get({
                        userId: member
                    },function(user) {

                        user_selected_data.push({
                            "id": user._id,
                            "label": user.displayName
                        });
                    });

                });

                $scope.dev_models = user_selected_data;



            });

            setTimeout(function () {

                var user_list_data = [];
                angular.forEach(list_of_members_id, function (member) {

                    $scope.abc = Admin.get({
                        userId: member
                    },function(user) {

                        user_list_data.push({
                            "id": user._id,
                            "label": user.displayName,
                        });
                    });

                });

                $scope.assigned_user = user_list_data;

            }, 1000);


        };

        // Find a list of Sprints
        var sprintsListData = [];

        function getAllDays(startDate, endDate) {


            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];
            //var s = new Date($('#hfEventStartDate').val() - 0);
            //var e = new Date($('#hfEventEndDate').val() - 0);

            var s = new Date(startDate);
            s.setDate(s.getDate());
            var e = new Date(endDate);
            e.setDate(e.getDate() + 1);


            var a = [];

            while (s < e) {
                a.push(s.getDate() + "-" + (s.getMonth() + 1) + "-" + s.getFullYear());


                s = new Date(s.setDate(
                    s.getDate() + 1
                ));

            }

            return a;
        };

        $scope.findChart = function () {

            $scope.sprints = Sprints.query(function (sprints) {


                sprints.filter(function (sprint) {

                    sprintsListData.push({
                        "id": sprint._id,
                        "label": sprint.title
                    });


                    $scope.sprintsdata = sprintsListData;


                });
            });


            $scope.sprint = Sprints.get({
                sprintId: $stateParams.sprintId
            });


            // get current sprint start date and end date

            $scope.sprint_id = $stateParams.sprintId;

            Sprints.get({
                sprintId: $stateParams.sprintId
            }, function (sprint) {

                $scope.sprint_id = {
                    "id": sprint._id,
                    "label": sprint.title
                };


                var spStartDate = sprint.start_date;
                var spEndDate = sprint.end_date;

                var sprintDaysList = getAllDays(spStartDate.split("T")[0], spEndDate.split("T")[0]);

                var numberOfDaysInSprint = sprintDaysList.length;


                var backlogItems = sprint.backlog_items;

                $scope.totalEffortForThisSprint = 0;

                var completedWorkByDays = [];
                angular.forEach(backlogItems, function (backlogItemId, key) {


                    var list1 = [];
                    var list2 = [];
                    var list3 = [];


                    Tasks.query({
                        backlog_id: backlogItemId
                    }, function (tasks) {


                        tasks.filter(function (task) {


                            if (task.backlog_id == backlogItemId) {

                                if (task.status == "done") {

                                    var s = new Date(task.completed);

                                    var completedOn = s.getDate() + "-" + ( s.getMonth() + 1) + "-" + s.getFullYear();


                                    if (completedWorkByDays[completedOn] == undefined) {
                                        completedWorkByDays[completedOn] = task.estimate;
                                    } else {
                                        completedWorkByDays[completedOn] = completedWorkByDays[completedOn] + task.estimate
                                    }


                                }


                                $scope.totalEffortForThisSprint = $scope.totalEffortForThisSprint + task.estimate;


                            }


                        });


                    });


                });


                setTimeout(function () {

                    var idealOneDayWork = $scope.totalEffortForThisSprint / numberOfDaysInSprint;

                    var dset1 = [
                        {x: 0, val_0: $scope.totalEffortForThisSprint}
                    ];
                    var dset2 = [
                        {x: 0, val_0: $scope.totalEffortForThisSprint}
                    ];
                    var doneSoFar = 0;


                    for (var i = 1; i < numberOfDaysInSprint + 1; i++) {


                        var completedOn = sprintDaysList[i];


                        if (completedWorkByDays[completedOn] != undefined) {

                            // dset2.push(  {x: i, val_0: ($scope.totalEffortForThisSprint - doneSoFar ) });

                            doneSoFar = doneSoFar + completedWorkByDays[completedOn];


                        } else {

                            // dset2.push(  {x: i, val_0: ($scope.totalEffortForThisSprint - ((i + 1 ) * idealOneDayWork ))});

                        }
                        dset2.push({x: i, val_0: ($scope.totalEffortForThisSprint - doneSoFar ) });


                        dset1.push({x: i, val_0: ($scope.totalEffortForThisSprint - ((i) * idealOneDayWork ))});


                    }

                    $scope.data = {
                        dataset0: dset2,
                        dataset1: dset1
                    };

                    $scope.options = {
                        margin: {
                            top: 50,
                            right: 30,
                            bottom: 50,
                            left: 50
                        },
                        tooltipHook: function (d) {
                            return {
                                abscissas: "Number of Days Work left",
                                rows: d.map(function (s) {
                                    return {
                                        label: "" + s.series.label,
                                        value: s.row.y1,
                                        color: s.series.color,
                                        id: s.series.id
                                    }
                                })
                            }
                        },
                        series: [
                            {
                                axis: "y",
                                dataset: "dataset0",
                                key: "val_0",
                                label: "Real BurnDown Chart",
                                color: "#1f77b4",
                                type: ['line', 'dot'],

                                id: 'mySeries0'
                            },
                            {
                                axis: "y",
                                dataset: "dataset1",
                                key: "val_0",
                                label: "Ideal BurnDown Chart",
                                color: "green",
                                type: ['line', 'dot'],

                                id: 'mySeries1'
                            }
                        ],
                        axes: {x: {key: "x"}}
                    };


                }, 500)


            });


        };


        $scope.findBoard = function () {


            $scope.sprint_id = $stateParams.sprintId;

            Sprints.get({
                sprintId: $stateParams.sprintId
            }, function (sprint) {


                var backlogItems = sprint.backlog_items;
                angular.forEach(backlogItems, function (backlogItemId, key) {


                    var list1 = [];
                    var list2 = [];
                    var list3 = [];


                    Tasks.query({
                        backlog_id: backlogItemId
                    }, function (tasks) {


                        tasks.filter(function (task) {


                            if (task.backlog_id == backlogItemId) {

                                if (task.status == "todo") {


                                    list1.push({
                                        "title": task.title,
                                        "taskId": task._id,
                                        'drag': true

                                    });

                                } else if (task.status == "inprogress") {


                                    list2.push({
                                        "title": task.title,
                                        "taskId": task._id,
                                        'drag': true

                                    });


                                } else if (task.status == "done") {


                                    list3.push({
                                        "title": task.title,
                                        "taskId": task._id,
                                        'drag': true

                                    });


                                }


                            }


                        });

                        $scope.list1 = list1;
                        $scope.list2 = list2;
                        $scope.list3 = list3;


                    });


                });


                $scope.backlogs = Backlogs.query(function (backlogs) {

                    backlogs.filter(function (backlog) {
                        backlogsListData.push({
                            "id": backlog._id,
                            "label": backlog.title
                        });
                    });
                });


                $scope.sprint_id = {
                    "id": sprint._id,
                    "label": sprint.title
                };


                // now get all backlog items assigned to this sprint


            });


            $scope.sprints = Sprints.query(function (sprints) {


                sprints.filter(function (sprint) {

                    sprintsListData.push({
                        "id": sprint._id,
                        "label": sprint.title
                    });


                    $scope.sprintsdata = sprintsListData;


                });
            });


            $scope.sprint = Sprints.get({
                sprintId: $stateParams.sprintId
            });


            // Limit items to be dropped in list1
            /*
             $scope.optionsList1 = {
             accept: function(dragEl) {
             if ($scope.list1.length >= 2) {
             return false;
             } else {
             return true;
             }
             }
             };

             */
            $scope.startCallback = function (event, ui, task) {

                $scope.draggedTaskId = task.taskId;
            };


            $scope.dropCallback = function (event, ui) {


            };

            $scope.overCallback = function (event, ui) {

            };

            $scope.outCallback = function (event, ui) {

            };


            $scope.dropCallback1 = function (event, ui) {



                // update status of this task to inprogress


                $scope.task = Tasks.get({
                    taskId: $scope.draggedTaskId
                }, function (task) {


                    task.status = "todo";


                    $http({
                        method: 'PUT',
                        url: '/api/tasks/' + $scope.draggedTaskId + '',
                        data: task
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


                });


            };

            $scope.dropCallback2 = function (event, ui) {



                // update status of this task to inprogress


                $scope.task = Tasks.get({
                    taskId: $scope.draggedTaskId
                }, function (task) {


                    task.status = "inprogress";


                    $http({
                        method: 'PUT',
                        url: '/api/tasks/' + $scope.draggedTaskId + '',
                        data: task
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


                });


            };
            $scope.dropCallback3 = function (event, ui) {


                // update status of this task to inprogress


                $scope.task = Tasks.get({
                    taskId: $scope.draggedTaskId
                }, function (task) {


                    task.status = "done";


                    $http({
                        method: 'PUT',
                        url: '/api/tasks/' + $scope.draggedTaskId + '',
                        data: task
                    }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });


                });


            };
            /*
             $scope.dropCallback = function(event, ui , item) {
             console.log('hey, you dumped me :-(' , item);
             };
             */


        };

        $scope.sprintChange = function (id) {
            //  console.log("change"+id);
            $location.path('taskboard/' + id);
        };

        $scope.sprintChangeChart = function (id) {
            //  console.log("change"+id);
            $location.path('chart/' + id);
        };


    }
]);


