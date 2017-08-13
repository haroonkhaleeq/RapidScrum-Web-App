'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var BacklogSchema = new Schema({
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
    description: {
        type: String,
        default: '',
        trim: true
    },
    project_id: {
        type: Schema.ObjectId,
        ref: 'Project'
    },


    type: {
        type: String,
        default: '',
        trim: true,
        required: 'Type cannot be blank'
    },


    priority: {
        type: String,
        default: '',
        trim: true,
        required: 'Priority cannot be blank'
    },
    status: {
        type: String,
        default: 'In Sprint',
        trim: true,
        required: 'Status cannot be blank'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Backlog', BacklogSchema);
