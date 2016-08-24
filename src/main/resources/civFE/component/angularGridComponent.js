//基于angularjs的组件
$import([ "dependency.angular.146.angular" ]);
$define("civFE.component.angularGridComponent", {
	extend : "civFE.component.gridComponent",
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
	_onComponentLoad : function() {
		if (this.civContext.isLoad) {
			var ths = this;
			if (this._angBind)
				ths.onLoad(ths.dom, ths.civContext.getContext(), ths.config, ths.$scope);
			else {// 如果尚未进行angluar绑定的，则进行绑定
				var angAppName = "angApp";
				// angl module 不能重复构建，否则controller会被洗掉
				var app = $globalObj.angApp;
				if (!app) {
					app = angular.module(angAppName, []);
					$globalObj.angApp = app;
				}
				app.controller(this._angControllerName, function($scope) {
					ths.onLoad(ths.dom, ths.civContext.getContext(), ths.config, $scope);
					ths.$scope = $scope;
				});
				angular.bootstrap(this.dom[0], [ angAppName ]);
				this._angBind = true;
			}
		}
	}
});