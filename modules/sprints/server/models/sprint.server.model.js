'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Sprint Schema
 */
var SprintSchema = new Schema({
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
  start_date: {
    type: String,    
    trim: true,
    required: 'Start Date cannot be empty'
  },
  end_date: {
    type: String,    
    trim: true,
    required: 'End Date cannot be empty'
  },
    project_id: {
        type: Schema.ObjectId,
        ref: 'Project'
    },
  backlog_items: {
    type: [Schema.ObjectId],
    ref: 'Backlog'
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

mongoose.model('Sprint', SprintSchema);
