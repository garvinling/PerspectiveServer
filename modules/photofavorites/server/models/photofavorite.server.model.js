'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Photofavorite Schema
 */
var PhotofavoriteSchema = new Schema({
  user_id: {
    type: String
  },
  photo_id:{
    type: String
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

mongoose.model('Photofavorite', PhotofavoriteSchema);
