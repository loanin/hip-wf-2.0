$define("dependency.hip.log.appender.alert", {
	extend : "dependency.hip.log.appender.appender",
	append : function(event) {
		if (this.layout) {
			alert(this.layout.format(event));
		}
	}
});