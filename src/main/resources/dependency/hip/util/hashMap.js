$define("dependency.hip.util.hashMap", {
	_length : 0,
	_obj : {},
	isEmpty : function() {
		return this._length == 0;
	},
	containsKey : function(key) {
		return (key in this._obj);
	},
	containsValue : function(value) {
		for ( var key in this._obj) {
			if (this._obj[key] == value) {
				return true;
			}
		}
		return false;
	},
	put : function(key, value) {
		if (!this.containsKey(key))
			this._length++;
		this._obj[key] = value;
	},
	get : function(key) {
		return this.containsKey(key) ? this._obj[key] : null;
	},
	remove : function(key) {
		if (this.containsKey(key) && (delete this._obj[key]))
			this._length--;
	},
	values : function() {
		var _values = new Array();
		for ( var key in this._obj) {
			_values.push(this._obj[key]);
		}
		return _values;
	},
	keySet : function() {
		var _keys = new Array();
		for ( var key in this._obj) {
			_keys.push(key);
		}
		return _keys;
	},
	size : function() {
		return this._length;
	},
	clear : function() {
		this._length = 0;
		this._obj = {};
	}
});