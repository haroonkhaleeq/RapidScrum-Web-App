
'use strict';

// Setting up route
angular.module('tasks').config(['$stateProvider',
  function ($stateProvider) {
    //  state routing
    $stateProvider
      .state('tasks', {
        abstract: true,
        url: '/tasks',
        template: '<ui-view/>'
      })
      .state('tasks.list', {
        url: '',
        templateUrl: 'modules/tasks/client/views/list-tasks.client.view.html'
      })
      .state('tasks.create', {
        url: '/create',
        templateUrl: 'modules/tasks/client/views/create-task.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('tasks.view', {
        url: '/:taskId',
        templateUrl: 'modules/tasks/client/views/view-task.client.view.html'
      })
      .state('tasks.edit', {
        url: '/:taskId/edit',
        templateUrl: 'modules/tasks/client/views/edit-task.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      }) .state('taskboard', {
            url: '/taskboard/:sprintId',
            templateUrl: 'modules/tasks/client/views/board-tasks.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        }).state('chart', {
            url: '/chart/:sprintId',
            templateUrl: 'modules/tasks/client/views/chart.client.view.html',
            data: {
                roles: ['user', 'admin']
            }
        });
  }
]);
