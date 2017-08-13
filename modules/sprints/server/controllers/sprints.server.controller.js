'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Sprint = mongoose.model('Sprint'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a sprint
 */
exports.create = function (req, res) {
    var sprint = new Sprint(req.body);
    sprint.user = req.user;

    sprint.save(function (err) {

        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(sprint);
        }
    });
};

/**
 * Show the current sprint
 */
exports.read = function (req, res) {
    res.json(req.sprint);
};

/**
 * Update a sprint
 */
exports.update = function (req, res) {
    var sprint = req.sprint;

    sprint.title = req.body.title;
    sprint.start_date = req.body.start_date;
    sprint.end_date = req.body.end_date;
    sprint.project_id = req.body.project_id;
    sprint.backlog_items = req.body.backlog_items;
    sprint.content = req.body.content;

    sprint.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(sprint);
        }
    });
};

/**
 * Delete an sprint
 */
exports.delete = function (req, res) {
    var sprint = req.sprint;

    sprint.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(sprint);
        }
    });
};

/**
 * List of Sprints
 */
exports.list = function (req, res) {
    Sprint.find().sort('-created').populate('user', 'displayName').populate('project_id', 'title').exec(function (err, sprints) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(sprints);
        }
    });    
};

/**
 * Sprint middleware
 */
exports.sprintByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Sprint is invalid'
        });
    }

    Sprint.findById(id).populate('user', 'displayName').populate('project_id', 'title').exec(function (err, sprint) {
        if (err) {
            return next(err);
        } else if (!sprint) {
            return res.status(404).send({
                message: 'No sprint with that identifier has been found'
            });
        }
        req.sprint = sprint;
        next();
    });
};
