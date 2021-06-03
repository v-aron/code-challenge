const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../server');

describe('/customer', () => {
  it('GET', (done) => {
    request(app)
      .get('/customer')
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
      .post('/customer')
      .send({ id: 99, name: 'Test User' })
      .then((res) => {
        const body = res.body;
        expect(body).to.contain.property('id');
        expect(body).to.contain.property('name');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('DELETE', (done) => {
    request(app)
      .delete('/customer')
      .send({ id: '99' })
      .then((res) => {
        expect(res.body).to.contain.property('message');
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
