'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Task = mongoose.model('Task'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a task
 */
exports.create = function (req, res) {
    var task = new Task(req.body);
    task.user = req.user;

    task.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(task);
        }
    });
};

/**
 * Show the current task
 */
exports.read = function (req, res) {
    res.json(req.task);
};

/**
 * Update a task
 */
exports.update = function (req, res) {
    var task = req.task;

    task.title = req.body.title;
    task.status = req.body.status;
    task.content = req.body.content;
    task.estimate = req.body.estimate;
    task.assigned_user = req.body.assigned_user;


    if ( req.body.status == 'done' ){
        var today = new Date();
        task.completed = today;
    }




    task.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(task);
        }
    });
};

/**
 * Delete an task
 */
exports.delete = function (req, res) {
    var task = req.task;

    task.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(task);
        }
    });
};

/**
 * List
 */
exports.list = function (req, res) {
    Task.find().sort('-created').populate('user', 'displayName').exec(function (err, tasks) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(tasks);
        }
    });
};

/**
 * Article middleware
 */
exports.taskByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Task is invalid'
        });
    }

    Task.findById(id).populate('user', 'displayName').exec(function (err, task) {
        if (err) {
            return next(err);
        } else if (!task) {
            return res.status(404).send({
                message: 'No task with that identifier has been found'
            });
        }
        req.task = task;
        next();
    });
};
