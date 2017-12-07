'use strict';

const alipayF2f  = require('./lib/index.js');

module.exports = app => {
  console.log('app.config.env =', app.config.env);
  try {
    app.alipayF2f = new alipayF2f(app);
  } catch (e) {
    app.coreLogger.error('[egg-alipay-f2f] start fail, %s', e);
    return;
  }
};
