//基于angularjs的组件
$import([ "dependency.angular.146.angular" ]);
$define("dependency.hip.mod.angularModBase", {
	extend : "dependency.hip.mod.modBase",
	init : function() {
		var angAppName = "angApp";
		this.angApp = $globalObj.angApp;
		if (!this.angApp) {
			$globalObj.angApp = angular.module(angAppName, []);
			this.angApp = $globalObj.angApp;
		}
	},
	addHtml : function(dom, htmlStr) {
		if (htmlStr && dom) {
			var ths = this;
			var angDom = $(htmlStr);
			if (!$globalObj.angControllerIndex)
				$globalObj.angControllerIndex = 1;
			else
				$globalObj.angControllerIndex++;
			this._angControllerName = this.$className + "_" + $globalObj.angControllerIndex;
			angDom.attr("ng-controller", this._angControllerName);
			$(dom).append(angDom);
			return angDom;
		}
	},
	_sendOnLoad : function(dom, args) {
		var ths = this;
		if (this._angBind)
			ths.onLoad(dom, args, ths.$scope, ths._injectObj[0], ths._injectObj[1], ths._injectObj[2], ths._injectObj[3], ths._injectObj[4], ths._injectObj[5]);
		else {// 如果尚未进行angluar绑定的，则进行绑定
			var angAppName = "angApp";
			// angl module 不能重复构建，否则controller会被洗掉
			// var app = $globalObj.angApp;
			// if (!app) {
			// app = angular.module(angAppName, []);
			// $globalObj.angApp = app;
			// }
			var contrInject = [ '$scope' ];
			if (this.angInject) {
				for (var i = 0; i < this.angInject.length; i++) {
					contrInject.push(this.angInject[i]);
				}
			}
			contrInject.push(function($scope, inject1, inject2, inject3, inject4, inject5, inject6) {
				ths._injectObj = [];
				for (var i = 1; i < arguments.length; i++) {
					ths._injectObj.push(arguments[i]);
				}
				ths.onLoad(dom, args, $scope, ths._injectObj[0], ths._injectObj[1], ths._injectObj[2], ths._injectObj[3], ths._injectObj[4], ths._injectObj[5]);
				ths.$scope = $scope;
			});
			this.angApp.controller(this._angControllerName, contrInject);
			angular.bootstrap(this.dom[0], [ angAppName ]);
			this._angBind = true;
		}
	}
});