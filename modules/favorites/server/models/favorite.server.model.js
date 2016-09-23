'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Favorite Schema
 */
var FavoriteSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Favorite name',
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

mongoose.model('Favorite', FavoriteSchema);
