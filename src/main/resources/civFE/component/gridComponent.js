$import("dependency.jquery.jquery-191");
$define("civFE.component.gridComponent", {
	extend : "dependency.hip.mod.modBase",
	init : function(ciArgs) { // 组件构造函数传入组件初始参数 ciArgs=componentBaseInitArgs
		if (ciArgs) {
			this.style = ciArgs.style;
			if (!this.style)
				this.style = "";
			this.styleClass = ciArgs.styleClass;
			this.panel = ciArgs.panel;
			this.gridPosition = ciArgs.gridPosition;// 容器的 尺寸相关参数
			this.civContext = ciArgs.context;// 上下文
			this.config = ciArgs.config;// 组件配置
			// position（网格高，网格宽，网格起点，网格尺寸）
		}
	},
	initComponent : function() {
		var ths = this;
		var top = this.gridPosition.gTop * this.gridPosition.gridPixel.h;
		var left = this.gridPosition.gLeft * this.gridPosition.gridPixel.w;
		var height = this.gridPosition.gHeight * this.gridPosition.gridPixel.h;
		var width = this.gridPosition.gWidth * this.gridPosition.gridPixel.w;
		this.container = $("<div class='civComponent' style='" + this.style + "top:" + top + "px;left:" + left + "px;height:" + height + "px;width:" + width + "px;'></div>");
		if (this.styleClass)
			this.container.addClass(this.styleClass);
		this.panel.append(this.container);

		this.create(ths.container[0], null, function() {
			return false;
		});
		this.civContext.onLoad(function() {
			ths._onComponentLoad();
		});
	},
	remove : function() {
		// 清理组件
		this.$callSuper(arguments)();
	},
	_onComponentLoad : function() {
		this.onLoad(this.dom, this.civContext.getContext(), this.config);
	}
});