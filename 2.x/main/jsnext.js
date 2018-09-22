
(function(){

	function _hex_to_str(hex) {
		var str = '';
		for ( var i = 0; i < hex.length; i += 2) {
			var v = parseInt(hex.substr(i, 2), 16);
			var c = String.fromCharCode(v);
			str += c;
		}
		return str;
	}

	function _str_to_hex(str) {
		var hex = '';
		for ( var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i);
			var hc = c.toString(16);
			if (hc.length == 1) {
				hc = '0' + hc;
			}
			hex += hc;
		}
		return hex;
	}

	function _url_to_path(URL) {
		return URL.replace(new RegExp("http[s]?://[^/]*"), "");
	}

	function _title_from_html(HTML) {
		var regex = new RegExp("<title>([^<]*)</title>");
		var matches = regex.exec(HTML);
		if (matches.length > 1) {
			return matches[1];
		} else {
			return document.domain;
		}
	}

	function _update_links(DOMLocation) {
		var baseURL = location.protocol + "//" + location.host + "/";
		var links = $(DOMLocation);
		for ( var i = 0; i < links.length; i++) {
			var el = links[i]
			if (el.onclick == null && el.href.indexOf(baseURL) == 0
					&& el.href.indexOf("#") < 0 && el.target == "") {
				el.onclick = Function("return jsnext.update_page(this.href);");
			}
		}
	}

	function _ajax_loaded(responseText, textStatus, XMLHttpRequest) {
		if (textStatus == "error") {
			prompt("URL Failed: ", XMLHttpRequest);
		} else {
			// update links
			_update_links("#jsnext-container a.jsnext-link");
			// update title
			document.title = _title_from_html(responseText);
		}
	}

	function _load_default() {
		var default_page=$("#jsnext").attr("default");
		if(default_page == null) {
			default_page=document.location;
		}
		$("#jsnext-container").load(default_page + " #jsnext-content", null, _ajax_loaded);
	}

	document.ready = function (callback) {
		if (document.addEventListener) { //FF
			document.addEventListener('DOMContentLoaded', function () {
				document.removeEventListener('DOMContentLoaded', arguments.callee, false);
				callback();
			}, false);
		} else if (document.attachEvent) { //IE
			document.attachEvent('onreadytstatechange', function () {
				  if (document.readyState == "complete") {
						document.detachEvent("onreadystatechange", arguments.callee);
						callback();
				   }
			});
		} else if (document.lastChild == document.body) {
			callback();
		}
	}

	document.ready(function() {
		$.ajaxSettings.cache=false; _update_links("a.jsnext-link");
		var hash = document.location.hash;
		if (hash.indexOf("#") != -1) {
			$("#jsnext-container").load(
					document.location.origin + _hex_to_str(hash.substring(1))
							+ " #jsnext-content", null, _ajax_loaded);
		} else {
			_load_default();
		}
	});

	window.onpopstate = function(event) {
		if (event.state != null && event.state.page != null) {
			$("#jsnext-container").load(event.state.page + " #jsnext-content", null,
					_ajax_loaded);
		} else {
			_load_default();
		}
	};

	window.jsnext={
		update_page:function (URL) {
			var browserUrl = document.location.origin + document.location.pathname;
			history.pushState({
				page : URL
			}, null, browserUrl + "#" + _str_to_hex(_url_to_path(URL)));
			$("#jsnext-container").load(URL + " #jsnext-content", null, _ajax_loaded);
			return false;
		}
	}

})();
