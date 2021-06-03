'use strict';

var mongoose = require('mongoose'),
  Customer = mongoose.model('Customer');

/**
 * GET
 * Route /customer
 * list customers
 */
exports.list_customers = function (req, res) {
  Customer.find({}, function (err, customer) {
    if (err) res.send(err);
    res.json(customer);
  });
};

/**
 * POST
 * Route /customer
 * create a customer
 */
exports.create_customer = function (req, res) {
  var new_customer = new Customer(req.body);
  new_customer.save(function (err, customer) {
    if (err) res.send(err);
    res.json(customer);
  });
};

/**
 * DELETE
 * Route /customer
 * delete a customer
 */
exports.delete_customer = function (req, res) {
  Customer.deleteOne(
    {
      id: req.body.id,
    },
    function (err, account) {
      if (err) res.send(err);
      res.json({ message: 'Account successfully deleted' });
    }
  );
};
