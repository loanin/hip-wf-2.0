$define("civFE.panel.context.urlContext", {
	extend : "civFE.panel.context.contextBase",
	init : function() {
		var urlParams = {};
		(function() {
			var match, pl = /\+/g, // Regex for replacing addition symbol with
			// a space
			search = /([^&=]+)=?([^&]*)/g, decode = function(s) {
				return decodeURIComponent(s.replace(pl, " "));
			}, query = window.location.search.substring(1);

			while (match = search.exec(query))
				urlParams[decode(match[1])] = decode(match[2]);
		})();
		this._loadFinish(urlParams);
	}
});