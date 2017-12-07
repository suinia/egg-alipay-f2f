# egg-alipay-f2f

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-alipay-f2f.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-alipay-f2f
[travis-image]: https://img.shields.io/travis/eggjs/egg-alipay-f2f.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-alipay-f2f
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-alipay-f2f.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-alipay-f2f?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-alipay-f2f.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-alipay-f2f
[snyk-image]: https://snyk.io/test/npm/egg-alipay-f2f/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-alipay-f2f
[download-image]: https://img.shields.io/npm/dm/egg-alipay-f2f.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-alipay-f2f

<!--
Description here.
-->

## Install

```bash
$ npm i egg-alipay-f2f --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.alipayF2f = {
  enable: true,
  package: 'egg-alipay-f2f',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.alipayF2f = {
  appid: 20170xxxxxx, // 支付宝应用ID
  notify_url: 'http://xxx.com/notify_url', // 回调地址
  gateway_url: "https://openapi.alipay.com/gateway.do", // 支付宝网关地址
  private_key: 'Mxxxx', //开发者应用私钥
  alipay_public_key: 'mN+Pxxxx' // 支付宝公钥
};
```

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/suinia/egg-alipay-f2f/issues).

## License

[MIT](LICENSE)
