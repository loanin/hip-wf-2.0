/*
 * loanin log4js 前端日志处理
 */
$define("dependency.hip.log.log4js", {
	OFF : 99,
	DEBUG : 1,
	INFO : 2,
	ERROR : 3,
	init : function() {
		this.loadConfig();
	},
	getLogger : function(loggerName) {
		if (loggerName) {
			var allLogger = this.getAllLogger();
			if (allLogger.containsKey(loggerName))
				return allLogger.get(loggerName);
			else {
				var logger = this._createLogger(loggerName);
				logger.name = loggerName;
				allLogger.put(loggerName, logger);
				return logger;
			}
		}
		return this.getLogger("root");
	},
	getAllLogger : function() {
		if (!this._loggers)
			this._loggers = new dependency.hip.util.hashMap();
		return this._loggers;
	},
	_createLogger : function(loggerName) {
		var logger = new dependency.hip.log.logger(this._getLoggerConfig(loggerName));
		return logger;
	},
	_getLoggerConfig : function(loggerName) {
		var loggerConfig = {};
		this._mergeArgs(loggerConfig, this.allConfig);
		if (this.allConfig[loggerName]) {
			loggerConfig = this._mergeArgs(loggerConfig, this.allConfig[loggerName]);
		}
		return loggerConfig;
	},
	setConfig : function(conf) {
		if (!this.allConfig)
			this.allConfig = conf;
		else {
			// 合并参数
			this.allConfig = this.__mergeArgs(this.allConfig, conf);
		}
		var logers = this.getAllLogger().values();
		for (var i = 0; i < logers.length; i++) {
			logers[i].setConfig(this._getLoggerConfig(logers[i].name));
		}
	},
	getConfig : function() {
		return this.allConfig;
	},
	loadConfig : function() {
		var config = {
			level : "INFO",
			append : [ {
				clas : "dependency.hip.log.appender.console",
				layout : "dependency.hip.log.layout.patternLayout"
			} ]
		};
		// 合并参数
		if (typeof (log4jsConfig) != "undefined") {
			config = this._mergeArgs(config, log4jsConfig);
		}
		this.setConfig(config);
	},
	_mergeArgs : function(obj1, obj2) {
		for (k in obj2) {
			if ($tool.isObject(obj1[k]) && $tool.isObject(obj2[k]) && !$tool.isArray(obj1[k]) && !$tool.isArray(obj2[k])) {
				obj1[k] = this._mergeArgs(obj1[k], obj2[k]);
			} else if ($tool.isObject(obj2[k]) && !$tool.isArray(obj2[k])) {
				obj1[k] = this._mergeArgs({}, obj2[k]);
			} else {
				obj1[k] = obj2[k];
			}
		}
		return obj1;
	}
});

var $log4js;
$import([ "dependency.hip.util.hashMap", "dependency.hip.log.logger" ], function() {
	$log4js = new dependency.hip.log.log4js();
});
