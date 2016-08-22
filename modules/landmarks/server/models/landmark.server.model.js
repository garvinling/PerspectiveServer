'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Landmark Schema
 */
var LandmarkSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Landmark name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Landmark', LandmarkSchema);
