const helper = require("./helper.js");

module.exports = {
	/**
     * 请求 api
     * @param  {String}  method    接口名称
     * @param  {Object}  config    配置信息
     * @param  {Object}  params    api自有参数
     * @return {Promise}
     */
	proxy (app, method, config, params) {
		return new Promise((resolve, reject) => {
			// 公共参数
			var commonParams = {
      		app_id: config.appid,
        	version: '1.0',
        	sign_type: 'RSA2',
        	method: method,
        	timestamp: helper.timeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        	notify_url: config.notify_url,
        	charset: "UTF-8"
    		};
    		// api自有参数
    		var apiParams = JSON.stringify(params);
    		var signContent = helper.getSignContent(commonParams, { biz_content: apiParams });
    		var sign = null;
    		try {
          sign = helper.getSign(signContent, config.private_key);
      } catch (e) {
        return reject({ message: "生成请求签名时错误", info : e });
      }
    		// 构造请求 url
      var requestUrl = config.gateway_url + "?";
      requestUrl += helper.formatParams(commonParams, false, true);
      requestUrl += `&sign=${encodeURIComponent(sign)}`;
      // 请求支付宝 api
    		app.curl(requestUrl, {
			  method: 'POST',
			  dataType: 'json',
			  data: { biz_content: apiParams }
			}).then(res=>{
				/* alipay.trade.precreate 转成 alipay_trade_precreate_response */
        var keyName = method.replace(/\./g, "_") + "_response";
				if( !res || !res.data || !res.data[keyName]) {
					return reject({ message: "发生未知错误", info: res });
				}
				var data = res.data, apiResponse = data[keyName];
				if( apiResponse.code && apiResponse.code !== '10000' ) {
					return reject({ message: apiResponse.sub_msg || apiResponse.msg || '发生未知错误' });
				}
				if( !data.sign ) {
        		return reject({ message: "获取支付宝签名失败" });
        }
				var dataString = JSON.stringify(apiResponse).replace(/\//g, "\\/");
				try {
          	if(!helper.verifyContent(dataString , data.sign, config.alipay_public_key)) {
            	return reject({ message: "支付宝签名验证失败", info : data });
          	}
        	} catch (e) {
          	return reject({ message: "支付宝签名验证过程中出现异常", info : e });
        	}
      		return resolve(apiResponse);
			}).catch(err=>{
      		return reject({ message: "请求支付宝网关时发生错误", info : err });
			});
		});
	}
}