'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var TaskSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
    completed: {
        type: Date,
        default: ''
    },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
    estimate: {
        type: Number,
        default: 1,
        trim: true,
        required: 'Estimate cannot be blank'
    },
    status: {
        type: String,
        default: 'Planning',
        trim: true,
        required: 'Status cannot be blank'
    },

    backlog_id: {
    type: Schema.ObjectId,
    ref: 'Backlog'
  },
    assigned_user: {
        type: [Schema.ObjectId],
        ref: 'User'
    },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Task', TaskSchema);
