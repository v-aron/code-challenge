('use strict');
module.exports = function (app) {
  var customer = require('../controllers/customerController');
  app
    .route('/customer')
    .get(customer.list_customers)
    .post(customer.create_customer)
    .delete(customer.delete_customer);
};
