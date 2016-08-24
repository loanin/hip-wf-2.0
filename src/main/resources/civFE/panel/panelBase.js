$define("civFE.panel.panelBase", {
	civContext : $ref("civFE.panel.context.commonContext"),
	components : [],
	init : function(parent, context) {
		this.parent = parent;
		if (context)
			this.civContext = context;
	},
	draw : function(args) {
		this.clear();
		this.panel = this._createPanel(args);
		this._createComponent(this.panel, args);
		return this.panel;
	},
	clear : function() {
		if (this.panel) {
			this.panel.remove();
			this.civContext.clear();
		}
	},
	_createPanel : function(args) {
	},
	_createComponent : function(penl, args) {
		var ths = this;
		var clases = [];
		var cops = [];
		for (var i = 0; i < args.components.length; i++) {
			var comp = args.components[i];
			if (!$tool.listContain(clases, comp.clas))
				clases.push(comp.clas);
			comp.panel = penl;
			comp.gridPosition.gridPixel = args.gridPixel;
			comp.context = this.civContext;
			cops.push(comp);
		}
		$import(clases, function() {
			for (var i = 0; i < cops.length; i++) {
				$new(cops[i].clas, cops[i]).then(function(obj) {
					obj.initComponent();
					ths.components.push(obj);
				});
			}
		});
	}
});