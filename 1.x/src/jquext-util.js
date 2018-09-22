
///////////////////////////////////////////////////////////////////////////////
// define the util object
$$('util', [], function(){
    var $util = {log_to_console:false,
		log_levels:{'1' : 'debug', '2' : 'info', '4' : 'warn', '8' : 'error'}};

	$util.log = function(level, msg, e) {
		var info = ($util.log_levels[level] || level) + ' - ' + msg;
		if ($util.log_to_console) { // use console
			if (window.console) {
				if (e) {
					window.console.log(info, e);
				} else {
					window.console.log(info);
				}
			} // no console then do nothing

		} else { // use debug console div
			var debug = $util.ele('debug_console');
			if (!debug) {
				debug = document.createElement('div');
				debug.id = 'debug_console';
				debug.style.margin = '5px 0px';
				debug.style.border = '1px solid red';
				document.body.appendChild(debug);
			} else {
				if (e) {
					info += ' Caused by: ' + e;
				}
				debug.innerHTML += info + '<br>';
			}
		}
	};

    $util.debug = function(msg, e){
        $util.log(1, msg, e);
    };

    $util.info = function(msg, e){
        $util.log(2, msg, e);
    };

    $util.warn = function(msg, e){
        $util.log(4, msg, e);
    };

    $util.error = function(msg, cause){
        $util.log(8, msg, cause);
    };

	$util.has = function(vals, val) {
		for ( var i=0; i<vals.length; i++) {
			if (vals[i] == val) {
				return true;
			}
		}
		return false;
	};

	$util.rm = function(vals, val) {
		for ( var i=0; i<vals.length; i++) {
			if (vals[i] == val) {
				vals.splice(i, 1);
				break;
			}
		}
	};

	$util.str = function(obj) {
		if (obj == null) {
			return null;
		}
		var doc = '{', n, v, t;
		for (n in obj) {
			v = obj[n];
			if (v instanceof Array) { // value is []
				t = n + ':[' + v + ']';
			} else if (typeof (v) == 'object') {
				t = n + ':' + $util.str(v);
			} else if (typeof (v) == 'function') {
				t = n + ':' + v + '';
			} else {
				t = n + ':"' + v + '"';
			}
			if (doc == '{') {
				doc += '\n<br>' + t;
			} else {
				doc += ', \n<br>' + t;
			}
		}
		doc += '\n<br>}\n<br>';
		return doc;
	};

	$util.ele = function(id, doc) {
		var element = null;
		if (id != null) {
			doc = doc || window.document; // fix the doc
			element = doc.getElementById(id);
			if (element == null) {
				element = doc.getElementsByName(id).item(0);
			}
		}
		return element;
	};

	$util.eles = function(tag, doc) {
		var elements = null;
		if (tag != null) {
			doc = doc || window.document; // fix the doc
			elements = doc.getElementsByTagName(tag);
		}
		return elements;
	};

	$util.attr = function(ele, name) {
		var value = null;
		if (ele != null && name != null) {
			value = ele.getAttribute(name);
		}
		return value;
	};

	$util.invoke = function(fn, args) {
		return fn.apply(window, args);
	};

	$util.getUrlParam = function(paramName, url) {
		if(url==null){
			url = location.href;
		}
		var name = paramName
			.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
		var regexPattern = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp(regexPattern);
		var results = regex.exec(url);
		if( results == null ) {
			return "";
		} else {
			return results[1];
		}
	};

	$util.setCookie = function (name, value, expiredays){
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie=name+ "=" +window.escape(value)+
			((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
	};

	$util.getCookie = function (name) {
		if (document.cookie.length>0) {
			var c_start=document.cookie.indexOf(name + "=");
			if (c_start!=-1) {
				c_start=c_start + name.length+1;
				var c_end=document.cookie.indexOf(";",c_start);
				if (c_end==-1) {
					c_end=document.cookie.length;
				}
				var val = document.cookie.substring(c_start,c_end);
				return window.unescape(val);
			}
		}
		return "";
	};
	
	$util.getUrlQuery = function(url, name) {
		var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)"), rs;
		if ((rs = url.match(reg)) != null) {
			return window.unescape(rs[2]);
		}
		return null;
	};
	
    $util.getJsRootDir = function(ele){
		var js_root_path = $util.attr($util.ele('jQuextScript'), 'src');
        return js_root_path.substring(0, js_root_path.lastIndexOf('/') + 1);
    };

	return $util;
});
