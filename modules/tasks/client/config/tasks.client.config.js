'use strict';

// Configuring the module
angular.module('tasks' , ['ngDragDrop','n3-line-chart']).run(['Menus',
  function (Menus) {
    // Add the tasks dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Task',
      state: 'tasks',
      type: 'dropdown',
        position: 4,
      roles: ['*']
    });

      Menus.addMenuItem('topbar', {
          title: 'TaskBoard',
          state: 'taskboard',
          type: '',
          position: 6,
          roles: ['*']
      });
      Menus.addMenuItem('topbar', {
          title: 'Charts',
          state: 'chart',
          type: '',
          position: 7,
          roles: ['*']
      });


      // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Tasks List',
      state: 'tasks.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'tasks', {
      title: 'Create Tasks',
      state: 'tasks.create',
      roles: ['user', 'admin']
    });
  }
]);
