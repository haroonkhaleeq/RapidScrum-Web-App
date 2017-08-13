'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Backlog = mongoose.model('Backlog'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a backlog
 */
exports.create = function (req, res) {
    var backlog = new Backlog(req.body);
    backlog.user = req.user;

    backlog.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(backlog);
        }
    });
};

/**
 * Show the current backlog
 */
exports.read = function (req, res) {
    res.json(req.backlog);
};

/**
 * Update a backlog
 */
exports.update = function (req, res) {
    var backlog = req.backlog;


    console.log(backlog);

    backlog.title = req.body.title;
    backlog.description = req.body.description;
    backlog.project_id = req.body.project_id;
    backlog.type = req.body.type;
    backlog.priority = req.body.priority;
    backlog.status = req.body.status;

    backlog.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(backlog);
        }
    });
};

/**
 * Delete an backlog
 */
exports.delete = function (req, res) {
    var backlog = req.backlog;

    backlog.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(backlog);
        }
    });
};

/**
 * List
 */
exports.list = function (req, res) {
    Backlog.find().sort('-created').populate('user', 'displayName').exec(function (err, backlogs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(backlogs);
        }
    });
};

/**
 * Article middleware
 */
exports.backlogByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Backlog is invalid'
        });
    }

    Backlog.findById(id).populate('user', 'displayName').exec(function (err, backlog) {
        if (err) {
            return next(err);
        } else if (!backlog) {
            return res.status(404).send({
                message: 'No backlog with that identifier has been found'
            });
        }
        req.backlog = backlog;
        next();
    });
};
