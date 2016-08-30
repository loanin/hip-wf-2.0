$define("dependency.hip.log.layout.patternLayout", {
	extend : "dependency.hip.log.layout.layout",
	formatStr : "{date} [{level}]  {message}",
	format : function(event) {
		event.date = this._dateFormat(event.date, "yyyy-MM-dd hh:mm:ss");
		return this._stringFormat(event);
	},
	setConfig : function(config) {
		if (config.conversionPattern)
			this.formatStr = config.conversionPattern;
	},
	_stringFormat : function() {
		var result = this.formatStr;
		if (arguments.length > 0) {
			if (arguments.length == 1 && typeof (arguments[0]) == "object") {
				var args = arguments[0];
				for ( var key in args) {
					if (args[key] != undefined) {
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			} else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] != undefined) {
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	},
	_dateFormat : function(date, fmt) { // author: meizz
		var o = {
			"M+" : date.getMonth() + 1, // 月份
			"d+" : date.getDate(), // 日
			"h+" : date.getHours(), // 小时
			"m+" : date.getMinutes(), // 分
			"s+" : date.getSeconds(), // 秒
			"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
			"S" : date.getMilliseconds()
		// 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for ( var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
});