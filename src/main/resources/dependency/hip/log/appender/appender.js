$define("dependency.hip.log.appender.appender", {
	init : function(config) {
		this.setConfig(config);
	},
	setConfig : function(config) {
		var ths = this;
		if (config.layout) {
			$new(config.layout, config).then(function(obj) {
				ths.layout = obj;
			});
		}
	},
	append : function(event) {
	}
});