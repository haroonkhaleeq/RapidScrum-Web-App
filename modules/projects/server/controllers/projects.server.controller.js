'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a project
 */
exports.create = function (req, res) {

    var project = new Project(req.body);
    project.user = req.user;


    project.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(project);
        }
    });
};

/**
 * Show the current project
 */
exports.read = function (req, res) {
    res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function (req, res) {
    var project = req.project;

    project.title = req.body.title;
    project.status = req.body.status;
    project.startDate = req.body.startDate;
    project.endDate = req.body.endDate;
    project.content = req.body.content;
    project.teams = req.body.teams;

    project.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(project);
        }
    });
};

/**
 * Delete an project
 */
exports.delete = function (req, res) {
    var project = req.project;

    project.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(project);
        }
    });
};

/**
 * List
 */
exports.list = function (req, res) {
    Project.find().sort('-created').populate('user', 'displayName').exec(function (err, projects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(projects);
        }
    });
};

/**
 * Article middleware
 */
exports.projectByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Project is invalid'
        });
    }

    Project.findById(id).populate('user', 'displayName').exec(function (err, project) {
        if (err) {
            return next(err);
        } else if (!project) {
            return res.status(404).send({
                message: 'No project with that identifier has been found'
            });
        }
        req.project = project;
        next();
    });
};
