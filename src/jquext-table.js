
///////////////////////////////////////////////////////////////////////////////
// define the table extension
/**
 * Methods of jQuext table widget module.
 *     .add(row_data [,index]);
 *     .remove(index);
 *     .getAll();
 *     .get(index);
 *     .select();
 *     .select(index);
 *     .dispose();
 */
$$('table', ['jQuery', 'util', 'widget'], function($, $util, $widget){
	var table = $widget.create(); // create the table widget

	table.fn.init = function(settings){
        this.context = $(this.parent); // set the context

		this.context.data('settings',  settings);

		// init table class
		if(!this.context.hasClass('ui_table')){
			this.context.addClass('ui_table');
		}

		// init column titles
		var colTitles = settings.col_titles;
		if(colTitles != null) {
			var headRowParent = $('.ui_table_head', this.context);
			if(headRowParent.size() === 0){
				headRowParent = $('<div class="ui_table_head"></div>');
				this.context.append(headRowParent);
			} else {
				headRowParent.empty();
			}
			this._add('ui_table_head', colTitles);
		}

		// init table data
		var tableData = settings.table_data;
		if(tableData == null) {
			tableData = [];
		}
		var dataRowParent = $('.ui_table_data', this.context);
		if(dataRowParent.size() === 0){
			dataRowParent = $('<div class="ui_table_data"></div>');
			this.context.append(dataRowParent);
		} else {
			dataRowParent.empty();
		}
		for(var i=0; i<tableData.length; i++){
			this._add('ui_table_data', tableData[i]);
		}

		var width = settings.table_width;
		if(width != null){
			this.context.css('width', width);
		}

		var height = settings.table_height;
		if(height != null){
			$('.ui_table_data', this.context).css('height', height);
		}
		$util.log('info:table', 'init table data: ' + tableData + ' for table: ' + this.parent);
	};

	table.fn.add = function(row_data, index){
		this._add('ui_table_data', row_data, index);
	};

	table.fn._add = function(target, row_data, index){
		var settings = this.context.data('settings');

		var dataRowParent = $('.' + target, this.context);
		var rowDoc = '<ul class="ui_table_row">';
		for(var j=0; j<row_data.length; j++) {
			rowDoc += '<li>' +row_data[j] + '</li>';
		}
		rowDoc += '</ul>';
		var row = $(rowDoc);
		if(index == null){
			dataRowParent.append(row);
		} else {
			dataRowParent.children().eq(index).before(row);
		}
		
		var colWidths = settings.col_widths;
		if (colWidths != null)	{
			var colSize = colWidths.length;
			var cols = row.children();
			var maxHeight = 18;
			for(var i=0; i<cols.length; i++){
				var colWidth = colWidths[i%colSize];
				cols.eq(i).css('width', colWidth);
				var height = cols.eq(i).height();
				maxHeight = height>maxHeight?height:maxHeight;
			}
			if(maxHeight > 18){
				if($.browser.msie){
					cols.css('height', maxHeight + 12 + 'px');
				} else {
					cols.css('height', maxHeight + 'px');
				}
				row.css('height', maxHeight + 12 + 'px');
			}
		}

		var showColSep = settings.show_col_separater;
		if(showColSep == null){
			showColSep = false;
		}
		if(showColSep){
			row.children().css('border-left', '1px dotted #aaa');
		}

		if(target == 'ui_table_data') {
			this._add_select_support(row);
		}
		$util.log('info:table', 'add: ' + row_data + ' for table: ' + this.parent);
	};

	table.fn._add_select_support = function(row){
		var settings = this.context.data('settings');
		var context = this.context;
		row.mouseover(function(){
			$(this).addClass('ui_table_row_overed');
		});
		row.mouseleave(function(){
			$(this).removeClass('ui_table_row_overed');
		});
		row.click(function(){
			if($(this).hasClass('ui_table_row_selected')){
				$(this).removeClass('ui_table_row_selected');
			} else {
				var multi = settings.multi_selection_support;
				if(multi == null){
					multi = false;
				}
				if(!multi){
					$('.ui_table_data .ui_table_row', context).removeClass(
						'ui_table_row_selected');
				}
				$(this).addClass('ui_table_row_selected');
			}
		});
	};

	table.fn.remove = function(index){
		$('.ui_table_data .ui_table_row').eq(index).remove();
	};

	table.fn.getAll = function(){
		return $('.ui_table_data .ui_table_row');
	};

	table.fn.get = function(index){
		return $('.ui_table_data .ui_table_row').eq(index);
	};

	table.fn.select = function(index){
		if(index == null) {
			return $('.ui_table_data .ui_table_row .ui_table_row_selected');
		}
		$('.ui_table_data .ui_table_row').eq(index).click();
	};

	table.fn.dispose = function(){
		this.context.data('settings', null);
	};

    return table; // return the table export object

});
