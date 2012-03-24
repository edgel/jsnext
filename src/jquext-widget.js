
///////////////////////////////////////////////////////////////////////////////
// define the widget extension
$$('widget', [], function(){
	return {create: function(){
		var $widget = function(parent, options) {
			return new $widget.fn.impl(parent, options);
		};
		$widget.fn = $widget.prototype = {
			impl:function(parent, options){
				this.parent = parent;
				this.options = options;
			}
		};
		$widget.fn.impl.prototype = $widget.fn;
		return $widget; // return the new widget object
	}};
});

$$('jQuery', [], function(){
	return window.jQuery.noConflict();
});

$$('ui', ['jQuery'], function($){
	return { setMinWidth : function(target, width) {
		var $win = $(window); // select the window
		var $tar = $(target); // select the target
		var dx = $win.width() - $tar.width();
		var resize_target = function(){
			 var old_width = $tar.data('_body_old_width');
			 var new_width = $win.width() - dx;
			 if(old_width == null || (new_width >= old_width + 5) ||
					(new_width <= old_width - 5)) {
				 new_width = new_width>width?'100%':width;
				 $tar.css('width', new_width);
				 new_width = $tar.width();
				 $tar.data('_body_old_width', new_width);
			 }
		};
		resize_target(); $win.resize(resize_target);
	}};
});
