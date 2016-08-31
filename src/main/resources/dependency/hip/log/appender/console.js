//浏览器控制台日志
$define("dependency.hip.log.appender.console", {
	extend : "dependency.hip.log.appender.appender",
	append : function(event) {
		if (this.layout) {
			console.log(this.layout.format(event));
		}
	}
});