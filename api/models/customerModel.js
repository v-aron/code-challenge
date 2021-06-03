'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  id: {
    required: true,
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Customer', CustomerSchema);
