'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ProjectSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    status: {
        type: String,
        default: 'Planning',
        trim: true,
        required: 'Status cannot be blank'
    }, startDate: {
        type: String,
        default: Date.now,
        trim: true,
        required: 'Start Date cannot be blank'
    }, endDate: {
        type: String,
        default: Date.now,
        trim: true,
        required: 'End Date cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    teams: {
        type: [Schema.ObjectId],
        ref: 'Team'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Project', ProjectSchema);
