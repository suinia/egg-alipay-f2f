'use strict';

const request = require('supertest');
const mm = require('egg-mock');

describe('test/alipay-f2f.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/alipay-f2f-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /', () => {
    return request(app.callback())
      .get('/')
      .expect('hi, alipayF2f')
      .expect(200);
  });
});
