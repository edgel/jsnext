
/******************************************************************************
 * Define the jQuext extension framework as the following:
 *
 * $$.window;
 *
 * $$.modules;
 * $$(id, deps, entry);
 *
 * $$.actions;
 * $$.execute(name);
 *
 * Author: Edgel Young (edgel.young@gmail.com)
 *
 *****************************************************************************/
var $$ = window.$$ = (function() {
	var console=window.console, jQuext = function(id, deps, entry) {
		var args = [];
		for(var i=0;i<deps.length;i++) {
			var ext = jQuext.modules[deps[i]];
			args.push(ext);
		}
		try {
			jQuext.modules[id] = entry.apply(null, args);
		} catch(e) {
			console && console.error('failed to load: ' + id + '!', e);
		}
	};
	jQuext.modules = [];

	jQuext.execute = function(name) {
		var action = jQuext.actions[name];
		if(action!=null) {
			var args = [];
			for(var i=1;i<arguments.length;i++) {
				args.push(arguments[i]);
			}
			action.apply(jQuext.actions, args);
		} else {
			console && console.log('invalid action: '+name);
		}
	};
	jQuext.actions = {};

	jQuext.window = window;  return jQuext;

})();
