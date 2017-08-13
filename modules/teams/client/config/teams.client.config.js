'use strict';

// Configuring the Teams module
angular.module('teams', ['angularjs-dropdown-multiselect']).run(['Menus',
    function (Menus) {
        // Add the teams dropdown item
        Menus.addMenuItem('topbar', {
            title: 'Teams',
            state: 'teams',
            type: 'dropdown',
            position: 2,
            roles: ['*']
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'teams', {
            title: 'List Teams',
            state: 'teams.list'
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'teams', {
            title: 'Create Teams',
            state: 'teams.create',
            roles: ['admin']
        });
    }
]);
