$define("dependency.hip.H5.webSocketBase", {
	init : function() {
		// websockte 对象
		this.websocket = window.WebSocket || window.MozWebSocket;
		this.isConnected = false;
	},
	connection : function(wcUrl) {
		if (window.WebSocket) {
			this.websocket = new WebSocket(encodeURI(wcUrl));
			this.websocket.onopen = this._noConnection;
			this.websocket.onerror = this._noError;
			this.websocket.onclose = this._noClose;
			this.websocket.onmessage = this.messageArrive;
		} else {
			// 不支持的处理
			this.nonsupport();
		}
	},
	nonsupport : function() {

	},
	closeConnection : function() {

	},
	_noConnection : function() {
		this.isConnected = true;
		this.noConnection();
	},
	_onError : function() {

	},
	_onClose : function() {
		this.isConnected = false;
	},
	noConnection : function() {
	},
	onError : function() {

	},
	onClose : function() {

	},
	messageArrive : function(message) {

	}
});