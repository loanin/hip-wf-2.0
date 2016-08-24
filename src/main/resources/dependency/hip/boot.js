var $globalObj = {};
var $tool = new function() {
	this.isFunction = function(obj) {
		return typeof obj == "function";
	}
	this.isString = function(obj) {
		return typeof obj == "string";
	}

	this.isObject = function(obj) {
		return typeof obj == "object";
	}
	this.isArray = function(obj) {
		if (this.isObject(obj) && obj.length >= 0)
			return true;
		else
			return false;
	}

	this.deepCopy = function(p, c) {
		var c = c || {};
		for ( var i in p) {
			if (typeof p[i] === 'object') {
				c[i] = (p[i].constructor === Array) ? [] : {};
				deepCopy(p[i], c[i]);
			} else {
				c[i] = p[i];
			}
		}
		return c;
	}
	this.listContain = function(list, key) {
		for (var i = 0; i < list.length; i++) {
			if (list[i] == key)
				return true;
		}
		return false;
	}
}

var $addScript;
var $addStyle;
var $addHtml;
var $import;
var $append;
// resLoad~~~~~~~~~~~~~~~~~~~~~~~~~~
(function() {
	var addedCss = [];//   已经加载的css字符串
	// var addedHtml = [];//   已经加载的html字符串
	var head = document.getElementsByTagName("head").item(0);

	var resType = {
		js : "js",
		css : "css"
	};

	$addStyle = function(key, cssStr) {
		if (!$tool.listContain(addedCss, key) && cssStr) {
			var style = document.createElement("style");
			style.innerHTML = cssStr;
			head.appendChild(style);
			addedCss.push(key);
		}
	}

	$append = function(dom, path, callback) { // 生成modid var modid = path;
		$import(path, function() {
			var mod = $package(path, true);
			if (mod) {// 处理css
				$addStyle(path, mod.prototype._css);
				$addHtml(dom, mod.prototype._html);
			}
			if (callback)
				callback(mod);
		});
	}

	var importCB = new function() {// importCallb
		var cbFun = [];// 被顶掉的fun
		this.push = function(funObj) {
			cbFun.push(funObj);
		}
		this.invoke = function(id) {
			// 将方法至为就绪
			for (var i = 0; i < cbFun.length; i++) {
				if (cbFun[i].id == id)
					cbFun[i].state = 1;
			}

			// 推出栈并执行fun最后一项不是就绪的
			while (cbFun.length > 0) {
				var funObj = cbFun[cbFun.length - 1];
				if (funObj.state == 1) {
					funObj.state == 2;
					cbFun.length = cbFun.length - 1;
					if ($tool.isFunction(funObj.fun))
						funObj.fun();
				} else
					break;
			}
		}
	}

	$import = function(paths, callback) {
		if (!paths)
			return;

		if (!$tool.isArray(paths))
			if ($tool.isString(paths))
				paths = paths.split(";");
			else
				return;
		else {
			var pathsGroup = [];
			var noGroupPath = [];
			for (var i = 0; i < paths.length; i++) {
				if ($tool.isArray(paths[i])) {
					pathsGroup.push(paths[i]);
				} else {
					noGroupPath.push(paths[i]);
				}
			}
			if (pathsGroup.length > 0) {// 多分组依赖的情况
				if (noGroupPath.length > 0)
					$import(noGroupPath);
				var groupIndex = 0;

				function loadGroup() {
					if (groupIndex == pathsGroup.length - 1)
						$import(pathsGroup[groupIndex], callback);
					else
						$import(pathsGroup[groupIndex], function() {
							groupIndex++;
							loadGroup();
						})
				}
				loadGroup();
				return;
			}
		}
		var backID = {};
		importCB.push({
			id : backID,
			fun : callback,
			state : 0
		});

		var index = 0;
		for (var i = 0; i < paths.length; i++) {
			var path = paths[i];
			var type = path.split(".");
			type = type[type.length - 1];
			if (type == resType.css) {
				path = path.substring(0, path.length - 4);
				path = "resources/" + path.replace(/[.]/gi, "/") + ".css";
			} else if (type == resType.js)
				path = "script/" + path;
			else {
				path = "script/" + path + ".js";
				type = resType.js;
			}

			importRes(path, function() {
				index++;
				if (index == paths.length) {
					importCB.invoke(backID);
				}
			}, type);
		}
	}

	// 加载资源
	var resObjs = {};// 已经加载的资源
	function importRes(path, callback, type) {
		if (!resObjs[path]) {
			resObjs[path] = {};
			resObjs[path].state = 0;// 0:未加载中 1:加载结束 2：加载中
			resObjs[path].backFun = [];
		}
		var resObj = resObjs[path];
		// 判断重复加载
		if (resObj.state != 1) {
			resObj.backFun.push(callback);
			if (resObj.state == 0) {
				resObj.state = 2;
				var targ = null;
				if (type == resType.js) {
					targ = document.createElement("script");
					targ.setAttribute("src", path);
					targ.setAttribute("type", "text/javascript");
				} else if (type == resType.css) {
					targ = document.createElement("link");
					targ.setAttribute('href', path);
					targ.setAttribute('rel', 'stylesheet');
					targ.setAttribute('type', 'text/css');
				}
				if (targ != null) {
					targ.setAttribute("async", "async");
					targ.setAttribute("defer", "defer");

					if (targ.readtState)// IE
						targ.readtState = targLoad;
					else
						targ.onload = targLoad;
					head.appendChild(targ);
				}
			}
		} else {
			if (callback)
				callback();
		}

		function targLoad() {
			resObj.state = 1;
			for (var i = 0; i < resObj.backFun.length; i++) {
				if (resObj.backFun[i])
					resObj.backFun[i]();
			}
			resObj.backFun = undefined;
			if (type != resType.css)
				// 删除脚本节点
				head.removeChild(targ);
		}
	}
})(this);

// 类定义过程~~~~~~~~~~~~~~~~~~~~~~~~~~
var $package;
var $define;
var $new;
var $extend;
(function(global) {
	var singletonClass = {};

	var newResult = function(pkg, argm) {
		this.pkg = pkg;
		this.argm = argm;
	}
	newResult.prototype.callback = function() {
		if (singletonClass[this.pkg] && singletonClass[this.pkg].singleton) {
			this.clas = singletonClass[this.pkg];
		} else {
			var funstr = "";
			for (var i = 1; i < this.argm.length; i++) {
				if (i > 1)
					funstr += ",";
				funstr += "this.argm[" + i + "]";
			}
			funstr = "new " + this.pkg + "(" + funstr + ")";
			this.clas = eval(funstr);
			if (this.clas.singleton)
				singletonClass[this.pkg] = this.clas;
		}
		if (this.callBackFun)
			this.callBackFun(this.clas);
	}

	newResult.prototype.then = function(fun) {
		this.callBackFun = fun;
		if (this.callBackFun && this.clas)
			this.callBackFun(this.clas);
	}

	$new = function(pkg) {
		if (pkg) {
			var nr = new newResult(pkg, arguments);
			$import(pkg + ".js", function() {
				// var clas = $package(pkg, true);
				nr.callback();
			});
			return nr;
		}
	}

	function superFunToList(initlist, init) {
		if ($tool.isFunction(init))
			initlist.push(init);
		if (init.$super)
			for (var i = 0; i < init.$super.length; i++) {
				superFunToList(initlist, init.$super[i]);
			}
	}

	$ref = function(clsPath) {
		if ($tool.isString(clsPath) && clsPath != "") {
			return "$ref:" + clsPath;
		}
		return "";
	}

	var defineMap = {};
	$define = function(pkg, config) {
		if ($tool.isString(pkg) && pkg == "")
			throw "必须定义类名";
		if (defineMap[pkg])// 不能重复定义类
			throw "类型：" + pkg + "已经被定义";
		defineMap[pkg] = config;
		var _extend = config.extend;
		if (_extend == pkg)
			throw "类型：" + pkg + "不能继承自己";

		var pkgs = pkg.split(".");
		var name = pkgs[pkgs.length - 1];
		var npkg = pkg.substring(0, pkg.length - name.length - 1);

		var refList = [];
		var refCls = "";
		// 处理ref
		for ( var k in config) {
			if ($tool.isString(config[k]) && config[k].length > 5 && config[k].substring(0, 5) == "$ref:") {
				if (refCls != "")
					refCls += ";";
				var refs = config[k].substring(5, config[k].length);
				refCls += refs;
				refList.push({
					k : k,
					v : refs
				});
				config[k].undefined;
			}
		}
		if (refCls != "")
			$import(refCls);

		var pg = $package(npkg);
		// 如果用户自己定义了构造器，则使用用户定义的构造器
		pg[name] = function($scope) {
			if (_extend) {
				if ($tool.isString(_extend) && _extend != "") {
					var exts = _extend.split(";");
					for (var i = 0; i < exts.length; i++) {
						var extPto = $package(exts[i], true);
						// alert(exts[i] + "=" +
						// extPto.prototype.$className);
						if (extPto)
							extPto.apply(this, arguments);
					}

				} else if ($tool.isFunction(_extend))
					_extend.apply(this, arguments);

			}

			// 构建ref
			for (var i = 0; i < refList.length; i++) {
				var ths = this;
				$new(refList[i].v).then(function(obj) {
					ths[refList[i].k] = obj;
				});
				// var pg = $package(refList[i].v, true);
				// this[refList[i].k] = new pg();
			}

			// 调用（假）构造函数链
			if ($tool.isFunction(this.init) && this.init == config.init) {
				var initlist = [];
				superFunToList(initlist, this.init);
				while (initlist.length > 0) {
					var initFun = initlist.pop();
					if (!$tool.listContain(initlist, initFun))// 避免调用多次共同的构造函数
						initFun.apply(this, arguments);
				}
			}
		};

		pg[name].prototype.$className = pkg;
		pg[name].prototype.$callSuper = function(argmt) {
			var ths = this;
			return function() {
				if (argmt.callee.$super)
					for (var i = 0; i < argmt.callee.$super.length; i++) {
						argmt.callee.$super[i].apply(ths, arguments);
					}
			}
		};
		// 继承与绑定处理

		for ( var k in config) {
			if (k == "extend" || k == "constructor")
				config[k] = undefined;
			else {
				pg[name].prototype[k] = config[k];
			}
		}

		if ($tool.isString(_extend) && _extend != "") {// 加载依赖 包括基类和注入
			$import(_extend, function() {
				var exts = _extend.split(";");
				for (var i = 0; i < exts.length; i++) {
					// 处理继承
					var p = $package(exts[i], true);
					if ($tool.isFunction(p))
						pg[name] = $extend(pg[name], p);
				}
			});
		} else if ($tool.isFunction(_extend)) {
			pg[name] = $extend(pg[name], _extend);
		}
		// 处理组件注入

	}

	$package = function(ns, get) {
		if (!ns)
			return global;
		if (get) {
			var pkgs = ns.split(".");
			var obj = global;
			for (var i = 0; i < pkgs.length; i++) {
				obj = obj[pkgs[i]];
			}
			return obj;
		} else {
			var pkgs = ns.split(".");
			var root = pkgs[0];
			var obj = global[root];
			if (!obj) {
				global[root] = obj = {};
			}
			for (var i = 1; i < pkgs.length; i++) {
				var p = pkgs[i];
				obj[p] = obj[p] || {};
				obj = obj[p];
			}
			return obj;
		}
	}

	$extend = function(Sub, Super) {// SuperName
		if (Sub != Super) {
			// var ls = function() {
			// };
			// ls.prototype = Super.prototype;
			// Sub.prototype = new ls();
			for ( var k in Super.prototype) {
				if (k.substring(0, 1) != "$") {
					if (!Sub.prototype[k])
						Sub.prototype[k] = Super.prototype[k];
					else if ($tool.isFunction(Sub.prototype[k]) && $tool.isFunction(Super.prototype[k])) {
						if (!Sub.prototype[k]["$super"])
							Sub.prototype[k]["$super"] = [];
						Sub.prototype[k]["$super"].push(Super.prototype[k]);
					}
				}
			}

			Sub.prototype.__proto__ = Super.prototype;
		}
		return Sub;

	}
})(this);

// 后续的jsonp处理模块(待开发)
