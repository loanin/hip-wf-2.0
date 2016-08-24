$define("dependency.hip.mod.modBase", {
	create : function(dom, args, callback) {
		this.cdom = dom;// 容器dom
		this.args = args;// 参数
		// 加载css
		$addStyle(this.$className, this._css);
		// 加载HTML
		this.dom = this.addHtml(dom, this._html);
		var sendLoad = true;
		if ($tool.isFunction(callback))
			sendLoad = callback();
		if (sendLoad)
			this._sendOnLoad(dom, args);
	},
	remove : function() {
		if (this.cdom && this.dom) {
			if ($tool.isArray(this.dom))
				for (var i = 0; i < length; i++) {
					this.cdom.removeChild(this.dom[i]);
				}
			else
				this.cdom.removeChild(this.dom);
		}
	},
	addHtml : function(dom, htmlStr) {
		if (htmlStr && dom) {
			var div = document.createElement("div");
			div.innerHTML = htmlStr;
			var lcd = [];
			for (var i = 0; i < div.childNodes.length;) {
				lcd.push(div.childNodes[i]);
				if (dom.append)// jquery
					dom.append(div.childNodes[i]);
				else
					dom.appendChild(div.childNodes[i]);
			}
			if (lcd.length == 1)
				return lcd[0];
			else
				return lcd;
		}
	},
	onLoad : function(dom, args) {

	},
	_sendOnLoad : function(dom, args) {
		this.onLoad(dom, args);
	}
});
