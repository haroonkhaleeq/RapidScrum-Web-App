
'use strict';

// Setting up route
angular.module('sprints').config(['$stateProvider',
  function ($stateProvider) {
    // Sprints state routing
    $stateProvider
      .state('sprints', {
        abstract: true,
        url: '/sprints',
        template: '<ui-view/>'
      })
      .state('sprints.list', {
        url: '',
        templateUrl: 'modules/sprints/client/views/list-sprints.client.view.html'
      })
      .state('sprints.create', {
        url: '/create',
        templateUrl: 'modules/sprints/client/views/create-sprint.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('sprints.view', {
        url: '/:sprintId',
        templateUrl: 'modules/sprints/client/views/view-sprint.client.view.html'
      })
      .state('sprints.edit', {
        url: '/:sprintId/edit',
        templateUrl: 'modules/sprints/client/views/edit-sprint.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
