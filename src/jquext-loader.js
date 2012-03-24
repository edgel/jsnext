
///////////////////////////////////////////////////////////////////////////////
// define the loader extension
$$('loader', ['util'], function($util){
	return { load : function(url, callback) {
		var fileLoaded = function(url, ele) {
            ele.removeAttribute('pending');
			if (callback) {
				callback(url, ele);
			}
		};

		var parent = $util.eles('head').item(0);
		if (/^.*\.css$/.test(url)) {
			var link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = url;
			link.setAttribute('loading', 'true');
			link.setAttribute('loader', 'jquext');
			if (link.attachEvent) { /* for ie */
				link.onload = function() {
					link.onload = null;
					if (fileLoaded) {
						fileLoaded(url, link);
					}
				};
			} else { /* for others */
				var timer = setInterval(function() {
					var isLoaded = false;
					if (navigator.userAgent.indexOf('AppleWebKit') !== -1) {
						if (link.sheet) {
							isLoaded = true;
						}
					} else if (link.sheet) { /* for Firefox */
						try {
							if (link.sheet.cssRules) {
								isLoaded = true;
							}
						} catch (e) {
							if (e.name === 'NS_ERROR_DOM_SECURITY_ERR') {
								isLoaded = true;
							}
						}
					}
					if (isLoaded) {
						clearInterval(timer); // remove timer
						if (fileLoaded) {
							fileLoaded(url, link);
						}
					}
				}, 1000); // check css loaded every 1s
			}
			parent.appendChild(link);

		} else {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			script.setAttribute('loading', 'true');
			script.setAttribute('loader', 'jquext');
			script.onreadystatechange = function() {
				if (this.readyState != 'loaded' &&
						this.readyState != 'complete') {
					return;
				}
				script.onreadystatechange = null;
				script.onload = null;
				script.onerror = null;
				if (fileLoaded) {
					fileLoaded(url, script);
				}
			};
			script.onload = script.onerror = function() {
				script.onreadystatechange = null;
				script.onload = null;
				script.onerror = null;
				if (fileLoaded) {
					fileLoaded(url, script);
				}
			};
			parent.insertBefore(script, parent.firstChild);
		}
	}};
});
