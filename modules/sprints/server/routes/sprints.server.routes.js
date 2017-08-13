'use strict';

/**
 * Module dependencies.
 */
var sprintsPolicy = require('../policies/sprints.server.policy'),
  sprints = require('../controllers/sprints.server.controller');

module.exports = function (app) {
  // Sprints collection routes
  app.route('/api/sprints').all(sprintsPolicy.isAllowed)
    .get(sprints.list)
    .post(sprints.create);

  // Single sprint routes
  app.route('/api/sprints/:sprintId').all(sprintsPolicy.isAllowed)
    .get(sprints.read)
    .put(sprints.update)
    .delete(sprints.delete);

  // Finish by binding the sprint middleware
  app.param('sprintId', sprints.sprintByID);
};
