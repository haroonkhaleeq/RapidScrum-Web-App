'use strict';

// Setting up route
angular.module('backlogs').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('backlogs', {
                abstract: true,
                url: '/backlogs',
                template: '<ui-view/>'
            })
            .state('backlogs.list', {
                url: '',
                templateUrl: 'modules/backlogs/client/views/list-backlogs.client.view.html'
            })
            .state('backlogs.create', {
                url: '/create',
                templateUrl: 'modules/backlogs/client/views/create-backlog.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            })
            .state('backlogs.view', {
                url: '/:backlogId',
                templateUrl: 'modules/backlogs/client/views/view-backlog.client.view.html'
            })
            .state('backlogs.edit', {
                url: '/:backlogId/edit',
                templateUrl: 'modules/backlogs/client/views/edit-backlog.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            }).state('backlog', {
                url: '/backlog/:projectId',
                templateUrl: 'modules/backlogs/client/views/project-backlog.client.view.html',
                data: {
                    roles: ['user', 'admin']
                }
            });
    }
]);
