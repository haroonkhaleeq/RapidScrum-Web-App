'use strict';

//Backlogs service used for communicating with the backlogs REST endpoints
angular.module('backlogs').factory('Backlogs', ['$resource',
  function ($resource) {
    return $resource('api/backlogs/:backlogId', {
      backlogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
