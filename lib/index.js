const assert = require('assert');
const alipay = require('./alipay');

function checkConfig(config) {
  assert(config.appid, '[egg-alipay-f2f] appid is missing!');
  assert(config.private_key, '[egg-alipay-f2f] private_key is missing!');
  assert(config.alipay_public_key, '[egg-alipay-f2f] alipay_public_key is missing!');
}
class AlipayF2f {
	constructor (app) {
  		const config = app.config.alipayF2f;
		checkConfig(config);
		this.config = Object.assign({
			// 支付宝分配给开发者的应用ID
			appid: '',
			// 支付宝服务器主动通知商户服务器里指定的页面
			notify_url: '',
			// 支付宝网关默认为沙盒 详见 https://openhome.alipay.com/platform/appDaily.htm
			gateway_url: 'https://openapi.alipaydev.com/gateway.do',
			// 开发者应用私钥，由开发者自己生成
			private_key: '',
			// 支付宝公钥，由支付宝生成
			alipay_public_key: ''
		}, config);
		this.config.private_key = `-----BEGIN RSA PRIVATE KEY-----\n${this.config.private_key}\n-----END RSA PRIVATE KEY-----`;
		this.config.alipay_public_key = `-----BEGIN PUBLIC KEY-----\n${this.config.alipay_public_key}\n-----END PUBLIC KEY-----`;
		this.app = app;
	}
	
	/**
     * 创建二维码订单
     * @param {Object} options 支付参数
     * 	必填 out_trade_no(String)             商户订单号,64个字符以内、可包含字母、数字、下划线；需保证在商户端不重复
     * 	必填 subject(String)              订单标题。
     *  必填 total_amount(Float)        	订单总金额，单位为元，精确到小数点后两位
     *  选填 body(String)                 订单描述
     *  选填 timeout_express(Int)         该笔订单允许的最晚付款时间单位分钟(m)，默认5分钟
     * @return {Promise}
   	 */
	createQRPay (options) {
		var options = Object.assign({
			timeout_express: 5
		}, options);
		var checkOptions = function () {
			assert(options.out_trade_no, '商户订单号不能为空');
		  assert(options.subject, '订单总金额标题不能为空');
		  assert(options.total_amount && !isNaN(options.total_amount), '订单总金额参数非法');
		  assert(options.timeout_express && !isNaN(options.timeout_express), '付款时效参数非法');
		};
		options.total_amount = parseFloat(options.total_amount);
		options.timeout_express = parseInt(options.timeout_express);
		checkOptions(options);
	  options.timeout_express += 'm';
		return alipay.proxy(this.app, "alipay.trade.precreate", this.config, options);
	}
	
	/**
	 * 使用商户订单号||支付宝交易号检测订单状况
	 * @param  {options} options 参数
	 * 		out_trade_no(String) 商户订单号
	 * 		trade_no(String) 支付宝交易号
	 * @return {Promise}
	 */
	checkStatus (options) {
		assert(options.out_trade_no || options.trade_no, '商户订单号/支付宝交易号不能同时为空');
		return alipay.proxy(this.app, "alipay.trade.query", this.config, options);
	}
	
	/**
	 * 使用商户订单号||支付宝交易号请求退款操作
	 * @param {String} 特殊可选 out_trade_no 商户订单号
	 * @param {String} 特殊可选 trade_no 支付宝交易号
	 * @param {Object} options
	 *   必填 refund_amount(Price) 需要退款的金额，该金额不能大于订单金额,单位为元，支持两位小数 
	 *   选填 out_request_no(String)  标识一次退款请求，同一笔交易多次退款需要保证唯一，如需部分退款，则此参数必传
	 *   选填 refund_reason(String) 退款原因说明
	 * @return {Promise}
	 */
	refund (options) {
		assert(options.out_trade_no || options.trade_no, '商户订单号/支付宝交易号不能同时为空');
		assert(options.refund_amount || !isNaN(options.refund_amount), '退款金额参数有误');
		return alipay.proxy(this.app, "alipay.trade.refund", this.config, options);
	}
}

module.exports = AlipayF2f;