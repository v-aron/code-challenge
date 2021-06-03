'use strict';
module.exports = function (app) {
  var account = require('../controllers/accountController');

  // accountList Routes
  app
    .route('/customer/:owner_id/account')
    .get(account.list_accounts)
    .post(account.create_account);

  app
    .route('/customer/:owner_id/account/:account_name')
    .get(account.get_account)
    .post(account.transfer_balance)
    .put(account.update_account)
    .delete(account.delete_account);
};
