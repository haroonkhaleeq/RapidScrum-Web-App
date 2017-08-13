'use strict';

// Configuring the Sprints module
angular.module('sprints').run(['Menus',
  function (Menus) {
    // Add the sprints dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Sprints',
      state: 'sprints',
      type: 'dropdown',
        position: 5,
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'sprints', {
      title: 'List Sprints',
      state: 'sprints.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'sprints', {
      title: 'Create Sprints',
      state: 'sprints.create',
      roles: ['*']
    });
  }
]);
