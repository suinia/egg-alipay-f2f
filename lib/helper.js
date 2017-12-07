const crypto = require("crypto");
const querystring = require('querystring');

module.exports = {
	/**
   * 时间戳转日期字符串
   * @param {Object} dateObj 日期对象： new Date(时间戳)
   * @param {String} format 格式：YYYY-MM-DDD HH:mm'
   * @returns 日期字符串
   */
	timeFormat: function(dateObj, format) {
    var date = {
      "M+": dateObj.getMonth() + 1,
      "D+": dateObj.getDate(),
      "H+": dateObj.getHours(),
      "m+": dateObj.getMinutes(),
      "s+": dateObj.getSeconds(),
    };
    if (/(Y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
          ? date[ k ] : ("00" + date[ k ]).substr(("" + date[ k ]).length));
      }
    }
    return format;
  },
  
  /**
   * 生成签名
   * @param   {String} content     签名内容
   * @param   {String} privateKey  私钥
   * @returns {String} 
   */
  getSign: function (content, private_key) {
    var cryptoSign = crypto.createSign("RSA-SHA256");
    cryptoSign.update(content, "utf8");
    return cryptoSign.sign(private_key, "base64");
  }, 
  
  /**
   * 生成签名内容
   * @param {Object} commonParams 公有参数
   * @param {Object} apiParams api自有参数
   */
  	getSignContent: function (commonParams, apiParams) {
    var temp = [];
	  Object.keys(commonParams).forEach(function(key) {
	      if( commonParams[key] ) {
	  				temp[key] = commonParams[key];
	  			}
	  });
	  Object.keys(apiParams).forEach(function(key) {
	  			if( apiParams[key] ) {
	  				temp[key] = apiParams[key];
	  			}
	  });
	  temp = this.sortObject(temp);
	  return this.formatParams(temp);
	},
	/**
   * 验证签名
   * @param   {String} content     签名串
   * @param   {String} content     签名
   * @param   {String} publicKey   公钥
   * @returns {Boolean}
   */
  verifyContent: function(content, sign, publicKey) {
    var verifySign = crypto.createVerify('RSA-SHA256');
    verifySign.update(content);
    return verifySign.verify(publicKey, sign, 'base64');
  },
	/**
   * 将 Object 对象格式化为 'x=1&y=2'
   * @param   {Object}   params       
   * @param   {Boolean}  skipEmpty 是否跳过 value 为空的object
   * @param   {Boolean}  encode 是否将value进行url编码
   * @returns {String}
   */
  formatParams: function(params, skipEmpty, encode) {
      var content = "";
      Object.keys(params).forEach(function(key, idx) {
          var value = params[key];
          if(!value && skipEmpty) {
              return;
          }
          if(encode) {
              value = encodeURIComponent(value);
          }
          if(idx == 0) {
              content += `${key}=${value}`;
          } else {
              content += `&${key}=${value}`;
          }
      });
      return content;
  },
	/**
 	* 根据Object键名来排序
 	* @param   {Object} obj 需要排序的Object
 	* @returns {Object}
 	*/
  sortObject: function (obj) {
      return Object.keys(obj).sort().reduce((r, k) => (r[k] = obj[k], r), {});
  }
}