$define("civFE.panel.context.contextBase", {
	singleton : true,//  api为单例模式保证参数不会重复构建
	_onLoadEventFun : [],
	_context : {},//  上下文
	_loadFinish : function(cont) {
		this._context = cont;
		this.isLoad = true;
		for (var i = 0; i < this._onLoadEventFun.length; i++) {
			try {
				this._onLoadEventFun[i](cont);
			} catch (e) {

			}
		}
	},
	setContext : function(cont) {
		this._loadFinish(cont);
	},
	getContext : function() {
		return this._context;
	},
	onLoad : function(callback) {// 将已经加载的 component进行管理
		if (this.isLoad && callback)
			callback(this.context);
		this._onLoadEventFun.push(callback);
//		if (comp)
//			this.registComponent(comp);
	},
//	registComponent : function(comp) {
//		this.components.push(comp);
//	},
	clear : function() {
		this.components = [];
	}
});