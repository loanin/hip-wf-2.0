$tool.o2s = function(jsObj) {
	var ths = this;
	if (jsObj == null)
		return "";
	var type = typeof jsObj;
	if (type == "object" && jsObj.length) {// 数组对象
		var r_str = new stringBuild();
		r_str.append("[");
		for (var i = 0; i < jsObj.length; i++) {
			if (i > 0)
				r_str.append(",");
			r_str.append($tool.o2s(jsObj[i]));
		}
		r_str.append("]");
		return r_str.join();
	} else if (type == "object" && !jsObj.length)// 对象类型
	{
		var r_str = new stringBuild();
		var i = 0;
		r_str.append("{");
		for ( var x in jsObj) {
			if (i > 0)
				r_str.append(",");
			r_str.append(x + ":" + $tool.o2s(jsObj[x]));
			i++;
		}
		r_str.append("}");
		return r_str.join();
	} else// 数值类型
	{
		return "\"" + jsObj + "\"";
	}
}

stringBuild = function() {
	var arr = new Array();
	this.append = appendfun;
	this.join = joinfun;
	this.toString = joinfun;
	function appendfun(string) {
		arr.push(string);
	}
	function joinfun() {
		if (arr.length == 0)
			return "";
		return arr.join("");
	}
}
Array.prototype.del = function(n) {
	if (n < 0)
		return this;
	else
		return this.slice(0, n).concat(this.slice(n + 1, this.length));
}

String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof (args) == "object") {
			for ( var key in args) {
				if (args[key] != undefined) {
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					var reg = new RegExp("\\{" + i + "\\}", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
}