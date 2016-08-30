//将日志数据发送到后台
$define("dependency.hip.log.appender.service", {
	extend : "dependency.hip.log.appender.appender",
	append : function(event) {
		if (this.sendLog) {
			this.sendLog(event);
		}
	},
	setConfig : function(config) {
		if (config.method)
			this.method = config.method;
		else
			this.method = "sendLog";
		if (config.service)
			this.service = config.service;
		else
			this.service = "frontLogService";
		if (config.domain)
			this.domain = config.domain;
		else {
			var pathname = window.location.pathname;
			this.domain = pathname.trim().split("/")[1];
		}

		this.sendLog = $remoteService(this.domain + "." + this.service, this.method);
		this.$callSuper(arguments)(config);
	}
});