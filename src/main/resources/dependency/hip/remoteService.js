(function(global) {
	var transportFactory = [ function() {
		return new ActiveXObject('Msxml2.XMLHTTP');
	}, function() {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}, function() {
		return new XMLHttpRequest();
	} ];

	var createNewTransport = function() {
		var factory = transportFactory;
		var transport = null;
		for (var i = 0, length = factory.length; i < length; i++) {
			var lambda = factory[i];
			try {
				transport = lambda();
				break;
			} catch (e) {
			}
		}
		return transport;
	};

	// for json
	var isNativeJson = window.JSON && JSON.toString() == '[object JSON]'
	var jsonDecode, jsonEncode;
	if (isNativeJson) {
		jsonDecode = JSON.parse
		jsonEncode = JSON.stringify;
	} else {
		jsonDecode = function(json) {
			return eval("(" + json + ")");
		}

		jsonEncode = function() {
			var toString = Object.prototype.toString, charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g, m = {
				"\b" : '\\b',
				"\t" : '\\t',
				"\n" : '\\n',
				"\f" : '\\f',
				"\r" : '\\r',
				'"' : '\\"',
				"\\" : '\\\\',
				'\x0b' : '\\u000b'
			}, useHasOwn = !!{}.hasOwnProperty, isDate = function(value) {
				return toString.call(value) === '[object Date]'
			}, isObject = (toString.call(null) === '[object Object]') ? function(value) {
				return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
			} : function(value) {
				return toString.call(value) === '[object Object]';
			}, isBoolean = function(value) {
				return typeof value === 'boolean';
			}, isArray = ('isArray' in Array) ? Array.isArray : function(value) {
				return toString.call(value) === '[object Array]';
			}
			encodeString = function(s) {
				return '"' + s.replace(charToReplace, function(a) {
					var c = m[a];
					return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"';
			}, pad = function(n) {
				return n < 10 ? "0" + n : n;
			}, encodeDate = function(o) {
				return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
			}, encodeArray = function(o) {
				var a = [ "[", "" ], len = o.length, i;
				for (i = 0; i < len; i += 1) {
					a.push(doEncode(o[i]), ',');
				}

				a[a.length - 1] = ']';
				return a.join("");
			}, encodeObject = function(o) {
				var a = [ "{", "" ], i;
				for (i in o) {
					if (!useHasOwn || o.hasOwnProperty(i)) {
						a.push(doEncode(i), ":", doEncode(o[i]), ',');
					}
				}
				a[a.length - 1] = '}';
				return a.join("");
			}, doEncode = function(o) {
				if (o === null || o === undefined) {
					return "null";
				} else if (isDate(o)) {
					return encodeDate(o);
				} else if (typeof o === 'string') {
					return encodeString(o);
				} else if (typeof o === "number") {
					return isFinite(o) ? String(o) : "null";
				} else if (isBoolean(o)) {
					return String(o);
				} else if (o.toJSON) {
					return o.toJSON();
				} else if (isArray(o)) {
					return encodeArray(o);
				} else if (isObject(o)) {
					return encodeObject(o);
				} else if (typeof o === "function") {
					return "null";
				}
				return 'undefined';
			};
			return doEncode;
		}();
	}
	global.$decode = jsonDecode;
	global.$encode = jsonEncode;

	// remoteService ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	var syncRemoteService = function(beanName, method, entityClass, scope, relogonFunc, relogonArgs, actionId) {// 同步远程方法调用
		return (function() {
			var parameters = [];
			for (var i = 0; i < arguments.length; i++) {
				parameters[i] = arguments[i];
			}
			var cb = new remoteServiceCallback();
			miniJsonRequest({
				actionId : actionId,
				serviceId : beanName,
				method : method,
				body : parameters,
			}, function(ctx, code, msg, json, con) {
				cb.complete({
					'code' : code,
					'msg' : msg,
					'json' : json
				});
			}, scope, relogonFunc, relogonArgs, entityClass, false);
			return cb;
		});
	}
	var remoteService = function(beanName, method, entityClass, scope, relogonFunc, relogonArgs, actionId) {// 异步方法调用
		return (function() {
			var parameters = [];
			for (var i = 0; i < arguments.length; i++) {
				parameters[i] = arguments[i];
			}
			var cb = new remoteServiceCallback(entityClass);
			miniJsonRequest({
				actionId : actionId,
				serviceId : beanName,
				method : method,
				body : parameters,
			}, function(ctx, code, msg, json, con) {
				cb.complete({
					'code' : code,
					'msg' : msg,
					'json' : json
				});
			}, scope, relogonFunc, relogonArgs, entityClass, true);
			return cb;
		});
	}

	global.$syncRemoteService = syncRemoteService;
	global.$remoteService = remoteService;

	var remoteServiceCallback = function(entityClass) {
		var successfun;
		var errorfun;
		var ths = this;
		var iscomplete = false;
		var data;
		ths.complete = function(result) {
			data = result;
			// 处理entityClass
			if (entityClass && data.json.body) {
				var clas = $package(entityClass, true);
				if (clas) {
					if ($tool.isArray(data.json.body)) {
						var objs = [];
						for (var i = 0; i < data.json.body.length; i++) {
							objs.push(createObj(clas, data.json.body[i]));
						}
						data.json.body = objs;
					} else {
						data.json.body = createObj(clas, data.json.body);
					}
				}
			}
			iscomplete = true;
			sendsuccess();
			senderror();
		}

		var sendsuccess = function() {
			if (iscomplete && data.code == 200 && typeof successfun == 'function') {
				successfun(data.json.body);
			}
		}

		var createObj = function(clas, item) {
			var obj = new clas();
			// 赋值
			for ( var k in item) {
				var set = "set" + k.replace(/(\w)/, function(v) {
					return v.toUpperCase()
				});
				if ($tool.isFunction(obj[set])) {
					obj[set](item[k]);
				} else {
					obj[k] = item[k];
				}
			}
			return obj;
		}

		ths.success = function(fun) {
			successfun = fun;
			sendsuccess();
			return ths;
		}

		var senderror = function() {
			if (iscomplete && data.code != 200 && typeof errorfun == 'function') {
				errorfun(data.msg, data.code);
			}
		}

		ths.error = function(fun) {
			errorfun = fun;
			senderror();
			return ths;
		}
	}

	var miniJsonRequest = function(jsonData, callback, scope, reLogonFunc, relogonArgs, entityClass, async) {
		var con = createNewTransport.apply();
		var url = jsonData.url || "*.jsonRequest";
		var method = jsonData.httpMethod || "POST";
		function ajaxSend() {
			try {
				con.open(method, "json/" + url, async);
				con.onreadystatechange = complete;
				con.setRequestHeader('encoding', 'utf-8');
				con.setRequestHeader("content-Type", 'application/json');
				con.send($encode(jsonData));
			} catch (e) {
				if (typeof callback == "function") {
					var ctx = typeof scope == "object" ? scope : this;
					callback(ctx, 500, "ConnectionError", null, con);
				}
			}
		}

		function complete() {
			var readyState = con.readyState;
			if (readyState == 4) {
				var json = {};
				var code = 400;
				var msg = "";
				con.onreadystatechange = function() {
				};
				var status = con.status;
				if (status == 200 || status == 304 || status == 500) {
					try {
						json = $decode(con.responseText);
						code = json["code"] || status;
						msg = json["msg"];
					} catch (e) {
						code = 500;
						msg = "ParseResponseError";
					}
				} else if (status == 403) {
					var notLogonCall = $AppContext.notLogonCallback;
					if (typeof notLogonCall == "function") {
						notLogonCall(reLogonFunc, relogonArgs, scope);
					}
					code = 403;
					msg = "AccessDenied";
				}

				if (typeof callback == "function") {
					var ctx = typeof scope == "object" ? scope : this;
					callback(ctx, code, msg, json, con);
				}

			}
		}

		if (entityClass) {// 实现了数据转jsClass
			$import(entityClass, function() {
				ajaxSend();
			});
		} else {
			ajaxSend();
		}
	};
	// var miniJsonRequestSync = function(jsonData, reLogonFunc, relogonArgs,
	// scope) {
	// var con = createNewTransport();
	// var url = jsonData.url || "*.jsonRequest";
	// var method = jsonData.httpMethod || "POST";
	// try {
	// con.open(method, "json/" + url, false);
	// con.setRequestHeader('encoding', 'utf-8');
	// con.setRequestHeader("content-Type", 'application/json');
	// con.send($encode(jsonData));
	// } catch (e) {
	// return {
	// code : 500,
	// msg : "ConnectionError"
	// };
	// }
	//
	// var json = {};
	// var code = 400;
	// var msg = "";
	// if (con.readyState == 4) {
	// var status = con.status;
	// if (status == 200 || status == 304 || status == 500) {
	// try {
	// json = $decode(con.responseText);
	// code = json["code"] || status;
	// msg = json["msg"];
	// } catch (e) {
	// code = 500;
	// msg = "ParseResponseError";
	// }
	// }
	// if (status == 403) {
	// var notLogonCall = $AppContext.notLogonCallback
	// if (typeof notLogonCall == "function") {
	// notLogonCall(reLogonFunc, relogonArgs, scope);
	// }
	// }
	// }
	// return {
	// code : code,
	// msg : msg,
	// json : json
	// };
	// };
})(this);