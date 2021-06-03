'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  owner_id: {
    type: Number,
    required: true,
  },
  account_name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  transaction_history: [
    {
      sender_id: {
        type: String,
      },
      sender_account: {
        type: String,
      },
      receiver_id: {
        type: String,
      },
      receiver_account: {
        type: String,
      },
      transfer_amount: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model('Account', AccountSchema);
