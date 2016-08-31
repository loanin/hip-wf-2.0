$define("dependency.hip.log.layout.layout", {
	init : function(config) {
		this.setConfig(config);
	},
	format : function(event) {
		return event.message;
	},
	setConfig : function(config) {

	}
});