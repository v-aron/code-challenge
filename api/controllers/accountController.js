'use strict';

var mongoose = require('mongoose'),
  Account = mongoose.model('Account');
var _ = require('lodash');

/**
 * GET
 * Route /customer/:owner_id/account
 * list accounts for customer with an ID of :owner_id
 */
exports.list_accounts = function (req, res) {
  Account.find(req.params, function (err, account) {
    if (err) res.send(err);
    res.json(account);
  });
};

/**
 * POST
 * Route /customer/:owner_id/account
 * Create a bank account for customer with an ID of :owner_id
 *
 * req.body contains
 * owner_id: Number (ID of the customer) required
 * account_name: String (Name of bank account) required
 * balance: Number (Put the initial deposit amount as balance) required
 */
exports.create_account = function (req, res) {
  var new_account = new Account(req.body);
  new_account.save(function (err, account) {
    if (err) res.send(err);
    res.json(account);
  });
};

/**
 * PUT
 * Route /customer/:owner_id/account/:account_name
 * Update a bank account for customer with an ID of :owner_id
 *
 * req.body contains but not necessarily all
 * account_name: String (Name of bank account)
 * balance: Number (Put the initial deposit amount as balance)
 */
exports.update_account = function (req, res) {
  Account.findOneAndUpdate(
    { owner_id: req.params.owner_id, account_name: req.params.account_name },
    req.body,
    { new: true },
    function (err, account) {
      if (err) res.send(err);
      res.json(account);
    }
  );
};

/**
 * DELETE
 * Route /customer/:owner_id/account/:account_name
 * Delete the bank accoount associated with the account name
 */
exports.delete_account = function (req, res) {
  Account.deleteOne(
    {
      owner_id: req.params.owner_id,
      account_name: req.params.account_name,
    },
    function (err, account) {
      if (err) res.send(err);
      res.json({ message: 'Account successfully deleted' });
    }
  );
};

/**
 * GET
 * Route /customer/:owner_id/account/:account_name
 * return the account details
 * For checking balance
 */
exports.get_account = function (req, res) {
  Account.findOne(req.params, function (err, account) {
    if (err) res.send(err);
    res.json(account);
  });
};

/**
 * POST
 * Route /customer/:owner_id/account/:account_name
 * transfer balance between accounts
 *
 * req.body
 * owner_id: Number (ID of the receiver)
 * account_name: String (Name of the account to transfer to)
 * transfer_amount: Number (The amount to be transferred)
 *
 * @todo
 * Refactor code for better readability and cleanliness
 * Separate findOne() functions?
 *
 */
exports.transfer_balance = function (req, res) {
  var body = req.body;
  var receiver_details = {
    owner_id: body.owner_id.toString(),
    account_name: body.account_name,
  };
  var transfer_amount = parseInt(body.transfer_amount);
  var new_sender_balance = null;
  var new_receiver_balance = null;

  if (!_.isEqual(receiver_details, req.params)) {
    //Check receiver details
    Account.findOne(receiver_details, function (err, receiver_account) {
      //If receiver details is invalid, return error
      if (_.isEqual(receiver_account, null)) {
        res.send({ error: 'Invalid receiver details' });
      } else {
        //if receiver details is valid, assign response to local variable receiver
        let receiver = receiver_account;
        //Check sender details
        Account.findOne(req.params, function (err, sender_account) {
          if (err) res.send(err);
          //assign response to local variable sender_balance
          let sender_balance = parseInt(sender_account.balance);
          //check if sender balance is enough for transfer, else return 'not enough balance'
          if (_.subtract(sender_balance, transfer_amount) >= 0) {
            //if sender has enough balance, subtract the amount
            Account.findOneAndUpdate(
              req.params,
              {
                balance: _.subtract(sender_balance, transfer_amount),
              },
              { new: true },
              function (err, sender_update) {
                if (err) res.send(err);
                //assign the new balance into local variable new_sender_balance for response
                new_sender_balance = sender_update.balance;
                //Add the transfer_amount into receiver balance
                Account.findOneAndUpdate(
                  receiver_details,
                  {
                    balance: receiver.balance + transfer_amount,
                  },
                  { new: true },
                  function (err, receiver_update) {
                    if (err) res.send(err);
                    new_receiver_balance = receiver_update.balance;
                    const updatePromise = updateHistory(
                      sender_account,
                      receiver,
                      transfer_amount
                    );
                    updatePromise.then(() => {
                      res.send({ new_receiver_balance, new_sender_balance });
                    });
                  }
                );
              }
            );
          } else {
            res.send({ error: 'Not enough balance' });
          }
        });
      }
    });
  } else {
    res.send({ error: 'Cannot transfer to similar accounts' });
  }
};

// helper functions

/**
 * Pushes done transactions
 *
 * @param {Object} sender
 * @param {Object} receiver
 * @param {Number} amount
 * @returns promise
 */
const updateHistory = function (sender, receiver, amount) {
  return new Promise(function (resolve) {
    const transaction_history = {
      sender_id: sender.owner_id,
      sender_account: sender.account_name,
      receiver_id: receiver.owner_id,
      receiver_account: receiver.account_name,
      transfer_amount: amount,
    };
    Account.updateMany(
      {
        owner_id: [sender.owner_id, receiver.owner_id],
        account_name: [sender.account_name, receiver.account_name],
      },
      { $push: { transaction_history } },
      { new: true },
      function (err, res) {
        if (err) resolve(err);
        resolve(res);
      }
    );
  });
};
