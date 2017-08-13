'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Rapid Chat',
        position: 8,
      state: 'chat'
    });
  }
]);
