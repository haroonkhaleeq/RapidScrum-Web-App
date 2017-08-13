'use strict';


angular.module('backlogs').run(['Menus',
    function (Menus) {
        // Add the backlogs dropdown item
        Menus.addMenuItem('topbar', {
            title: 'Backlogs',
            state: 'backlogs',
            type: 'dropdown',
            position: 4,
            roles: ['*']
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'backlogs', {
            title: 'List Backlog Items',
            state: 'backlogs.list'
        });

        // Add the dropdown list item
        Menus.addSubMenuItem('topbar', 'backlogs', {
            title: 'Project Backlog Items',
            state: 'backlog'
        });

        // Add the dropdown create item
        Menus.addSubMenuItem('topbar', 'backlogs', {
            title: 'Create Backlog Item',
            state: 'backlogs.create',
            roles: ['*']
        });
    }
]);
