'use strict';
//angular.module('projects', ['ngAnimate', 'ui.bootstrap']);
// Configuring the  module
angular.module('projects').run(['Menus',
    function (Menus) {
        // Add the projects dropdown item
        Menus.addMenuItem('topbar', {
            title: 'Projects',
            state: 'projects',
            type: 'dropdown',
            position: 3,
            roles: ['*']
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'projects', {
            title: 'List Projects',
            state: 'projects.list'
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'projects', {
            title: 'Create Projects',
            state: 'projects.create',
            roles: ['admin']
        });
    }
]);
