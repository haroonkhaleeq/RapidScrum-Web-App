'use strict';

//Sprints service used for communicating with the sprints REST endpoints
angular.module('sprints').factory('Sprints', ['$resource',
  function ($resource) {
    return $resource('api/sprints/:sprintId', {
      sprintId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
