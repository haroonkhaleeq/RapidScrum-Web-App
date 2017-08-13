'use strict';

/**
 * Module dependencies.
 */
var backlogsPolicy = require('../policies/backlogs.server.policy'),
  backlogs = require('../controllers/backlogs.server.controller');

module.exports = function (app) {
  //  collection routes
  app.route('/api/backlogs').all(backlogsPolicy.isAllowed)
    .get(backlogs.list)
    .post(backlogs.create);

  // Single backlog routes
  app.route('/api/backlogs/:backlogId').all(backlogsPolicy.isAllowed)
    .get(backlogs.read)
    .put(backlogs.update)
    .delete(backlogs.delete);

  // Finish by binding the backlog middleware
  app.param('backlogId', backlogs.backlogByID);
};
