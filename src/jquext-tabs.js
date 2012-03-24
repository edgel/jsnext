
///////////////////////////////////////////////////////////////////////////////
// define the tabs extension
$$('tabs', ['jQuery', 'util', 'widget'], function($, $util, $widget){
	var $tabs = $widget.create(); // create the tabs widget
	$tabs.fn.init = function() {
		var pages = $(".tabPage", this.parent).toArray(); // .reverse()
		var titles = "<div style='clear: both;'></div><div class='tabTitle'>";
		for ( var i = 0; i < pages.length; i++) {
			var clazz = $(pages[i]).attr('isFiller');
			if (clazz == "true") {
				var width = $(pages[i]).attr('width');
				titles += "<div style='float: left; width: " + width +
					"'>&nbsp;</div>";
				continue;
			}
			var title = $(pages[i]).attr('name');
			var url = $(pages[i]).attr('url');
			titles += "<div class='tab'>" + "<a href='" + url + "'>" + title +
				"</a></div>";
		}
		titles += "<div style='clear: both;'></div></div>";
		$('.tabPage', this.parent).first().before(titles);
		$('.ui-tabs .tabPage').css('display', 'none');
		$(this.parent).css('display', 'block');
	};
	$tabs.fn.show = function(index){
		var pages = $(".tabPage", this.parent).toArray();
		var refer = 0;
		for ( var i = 0; i < pages.length; i++) {
			var clazz = $(pages[i]).attr('isFiller');
			if (clazz == "true") {
				refer++;
				continue;
			}
			if (index + refer == i) {
				$(pages[i]).css('display', 'block');
			}
		}
		var tabs = $(".tab", this.parent).toArray();
		$(tabs[index]).removeClass("tab");
		$(tabs[index]).addClass("selected");
	};
	return $tabs;
});
