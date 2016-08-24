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
  type : {
    type:String,
    default:"Point"
  },
  coordinates:[Number],
  created: {
    type: Date,
    default: Date.now
  },
  leader_image:{
    type:String,
    default:""
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Landmark', LandmarkSchema);
