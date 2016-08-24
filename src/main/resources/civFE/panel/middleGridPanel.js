//居中排版的panel
$import([ "dependency.jquery.jquery-191", "civFE.common.civBase.css" ]);
$define("civFE.panel.middleGridPanel", {
	extend : "civFE.panel.panelBase",
	_createPanel : function(args) {
		this.parent = $(this.parent);
		this.panelGWidth = args.panelGWidth;
		this.panelGHeight = args.panelGHeight;
		var wEqh = false;
		if (!$tool.isObject(args.gridPixel)) {
			wEqh = true;
			args.gridPixel = {
				w : args.gridPixel,
				h : args.gridPixel
			}
		}
		if (!this.panelGHeight || !this.panelGWidth) {// 如果没有指定高度或宽度，则根据容器尺寸进行计算
			var maxh = 0;
			var maxw = 0;
			for (var i = 0; i < args.components.length; i++) {
				var comp = args.components[i];
				var h = comp.gridPosition.gTop + comp.gridPosition.gHeight;
				if (h > maxh)
					maxh = h;

				var w = comp.gridPosition.gLeft + comp.gridPosition.gWidth;
				if (w > maxw)
					maxw = w;

			}
			if (!this.panelGHeight)
				this.panelGHeight = maxh;

			if (!this.panelGWidth)
				this.panelGWidth = maxw;
		}

		// 根据父容器宽度自动调整尺寸 fixMod 0:不适应 ，1:宽度适应 2：宽度高度都适应
		if (args.fixMod) {
			if (args.fixMod == 1 || args.fixMod == 2)
				args.gridPixel.w = this.parent.width() / this.panelGWidth;
			if (args.fixMod == 2) {
				// 如果父容器是body，要特殊处理一下
				var browH;
				if (this.parent.get(0).tagName == "BODY")
					browH = document.documentElement.clientHeight;
				else
					browH = this.parent.height();
				args.gridPixel.h = browH / this.panelGHeight;// this.parent.height()
			}
			if (args.fixMod == 1 && wEqh)// 如果宽度高度相同，并且是宽度适应模式，则等比例缩放
				args.gridPixel.h = args.gridPixel.w;
		}
		this.gridPixel = args.gridPixel;

		var pw = this.gridPixel.w * this.panelGWidth;
		var ph = this.gridPixel.h * this.panelGHeight;

		var panel = $('<div class="civMiddlePanel" style="width:' + pw + 'px;height:' + ph + 'px;"></div>');
		this.parent.append(panel);
		return panel;
	}
});