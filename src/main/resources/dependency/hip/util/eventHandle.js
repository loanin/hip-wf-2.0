$define("dependency.hip.util.eventHandle", {
	_callbacks : [],
	on : function(callback) {
		if ($tool.isFunction(callback))
			this._callbacks.push(callback);
	},
	send : function(event) {
		for (var i = 0; i < this._callbacks.length; i++) {
			this._send(event, this._callbacks[i]);
		}
	},
	_send : function(event, fun) {
		try {
			fun(event);
		} catch (e) {

		}
	},
	remove : function(fun) {
		var cbs = [];
		for (var i = 0; i < this._callbacks.length; i++) {
			if (this._callbacks[i] != fun)
				cbs.push(this._callbacks[i]);
		}
		this._callbacks = cbs;
	},
	clear : function() {
		this._callbacks = [];
	},
	size : function() {
		return this._callbacks.length;
	}
});