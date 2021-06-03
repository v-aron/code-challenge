const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../server');

describe('/customer/:owner_id/account/', () => {
  it('GET', (done) => {
    request(app)
      .get('/customer/100/account')
      .then((res) => {
        expect(res.status).to.equal(200);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST', (done) => {
    request(app)
      .post('/customer/100/account')
      .send({ owner_id: 100, account_name: 'test', balance: 1000 })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('owner_id');
        expect(body).to.contain.property('account_name');
        expect(body).to.contain.property('balance');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});

describe('/customer/:owner_id/account/:account_name', () => {
  before((done) => {
    request(app)
      .post('/customer/200/account')
      .send({ owner_id: 200, account_name: 'test', balance: 1000 })
      .then((res) => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  after((done) => {
    request(app)
      .delete('/customer/200/account/test')
      .then((res) => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('GET', (done) => {
    request(app)
      .get('/customer/100/account/test')
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('owner_id');
        expect(body).to.contain.property('account_name');
        expect(body).to.contain.property('balance');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('PUT', (done) => {
    request(app)
      .put('/customer/100/account/test')
      .send({ balance: 50000 })
      .then((res) => {
        expect(res.body['balance']).to.equal(50000);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST SUCCESS', (done) => {
    request(app)
      .post('/customer/100/account/test')
      .send({ transfer_amount: 5000, owner_id: 200, account_name: 'test' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('new_receiver_balance');
        expect(body).to.contain.property('new_sender_balance');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST NOT ENOUGH BALANCE', (done) => {
    request(app)
      .post('/customer/100/account/test')
      .send({ transfer_amount: 100000, owner_id: 200, account_name: 'test' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('error', 'Not enough balance');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST CANNOT TRANSFER TO SIMILAR ACCOUNTS', (done) => {
    request(app)
      .post('/customer/100/account/test')
      .send({ transfer_amount: 1000, owner_id: 100, account_name: 'test' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property(
          'error',
          'Cannot transfer to similar accounts'
        );
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('POST INVALID RECEIVER DETAILS', (done) => {
    request(app)
      .post('/customer/100/account/test')
      .send({
        transfer_amount: 5000,
        owner_id: 200,
        account_name: 'not_existing',
      })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('error', 'Invalid receiver details');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('DELETE', (done) => {
    request(app)
      .delete('/customer/100/account/test')
      .then((res) => {
        expect(res.body).to.contain.property('message');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
