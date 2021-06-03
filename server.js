var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
(mongoose = require('mongoose')),
  (Customer = require('./api/models/customerModel')),
  (Account = require('./api/models/accountModel')),
  (bodyParser = require('body-parser'));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/BankDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var customer = require('./api/routes/customerRoute');
var account = require('./api/routes/accountRoute');

customer(app);
account(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

console.log('PayPerformance Challenge RESTful API server started on: ' + port);

module.exports = app.listen(port);
