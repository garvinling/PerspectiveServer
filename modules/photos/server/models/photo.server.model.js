'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Photo Schema
 */
var PhotoSchema = new Schema({

  created: {
    type: Date,
    default: Date.now
  },
  url : {
    type:String,
    default:''
  },
  landmark_id : {
    type:String,
    default:''
  },
  isLeader : {

    type:Boolean,
    default:false

  },
  likes:{
    type:Number,
    default:0
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Photo', PhotoSchema);
