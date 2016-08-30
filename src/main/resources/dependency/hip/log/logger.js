$import([ "dependency.hip.log.appender.console" ]);

$define("dependency.hip.log.logger", {
	level : 2,
	appenders : [],
	init : function(config) {
		this.setConfig(config);
	},
	setConfig : function(config) {
		var ths = this;
		if (config.level.toUpperCase() == "DEBUG")
			this.level = $log4js.DEBUG;
		else if (config.level.toUpperCase() == "INFO")
			this.level = $log4js.INFO;
		else if (config.level.toUpperCase() == "ERROR")
			this.level = $log4js.ERROR;

		this.appenders = [];
		for (var i = 0; i < config.append.length; i++) {
			if (config.append[i].layout)
				$import(config.append[i].layout);
			$new(config.append[i].clas, config.append[i]).then(function(obj) {
				ths.appenders.push(obj);
			});
		}
	},
	debug : function(msg, ex) {
		if (this.isDebug())
			this._output(msg, ex, "DEBUG");
	},
	info : function(msg, ex) {
		if (this.isInfo())
			this._output(msg, ex, "INFO");
	},
	error : function(msg, ex) {
		if (this.isError())
			this._output(msg, ex, "ERROR");
	},

	isDebug : function() {
		return this.level <= 1;
	},
	isInfo : function() {
		return this.level <= 2;
	},
	isError : function() {
		return this.level <= 3;
	},
	_createEvent : function(msg, ex, lev) {
		return {
			message : msg,
			exception : ex,
			date : new Date(),
			url : window.location.href,
			agent : navigator.userAgent,
			level : lev,
			logger : this.name
		};
	},
	_output : function(msg, ex, lev) {
		for (var i = 0; i < this.appenders.length; i++) {
			this.appenders[i].append(this._createEvent(msg, ex, lev));
		}
	}
});