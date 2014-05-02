/**
 * Created by joshuamcdonald69124 on 1/7/14.
 *
 * Rewritten by nobelhuang on 4/11/2014.
 * Tested under EXTJS 4.2.2
 */
Ext.define("plugin.showConditionalToolTip", {
	extend: "Ext.AbstractPlugin",
	alias: "plugin.showConditionalToolTip",

	init: function(grid) {
		var that = this;

		grid.on('columnresize', function(){
			grid.getView().refresh();
		});
		grid.down("tableview").on('render', function(){
			Ext.Array.each(grid.columns, function(column) {
				if (column.xtype === 'actioncolumn') {
					return;
				}
				if (column.hasCustomRenderer === true){
					column.renderer = Ext.Function.createSequence(column.renderer,function(a,b,c,d,e,f,g){
						b.tdAttr += 'onmouseenter="plugin.showConditionalToolTip.__tooltip(event, this)"';
						return a;
					});
				} else {
					column.renderer = function (a,b, c, d, e, f, g){
						b.tdAttr += 'onmouseenter="plugin.showConditionalToolTip.__tooltip(event, this)"';
						return a;
					}
				}
			});
		});
	},

	statics: {
		__tooltip: function (evt, dom) {
			var el = Ext.get(dom);
			if (el.hasCls("x-grid-cell")) {
				if (el.hasCls("x-grid-cell-treecolumn")) {
					var cEl = el.down(".x-grid-cell-inner");
					var tEl = el.down(".x-tree-node-text");
					var cWidth = cEl.getWidth(true);
					var pWidth = tEl.dom.offsetLeft - cEl.getBorderWidth("l") - cEl.getPadding("l");
					var rWidth = tEl.getWidth(false) + pWidth;

					if (rWidth + 4 >= cWidth) {
						tEl.set({"data-qtip": tEl.dom.innerHTML});
						Ext.QuickTips.getQuickTip().update(tEl.dom.innerHTML);
						Ext.QuickTips.getQuickTip().show();
					}
					else {
						tEl.dom.removeAttribute("data-qtip");
					}
				}
				else {
					var tEl = el.down(".x-grid-cell-inner");
					var cWidth = tEl.getWidth(true);
					var rWidth = tEl.getTextWidth();

					if (rWidth + 4 >= cWidth) {
						tEl.set({"data-qtip": tEl.dom.innerHTML});
						Ext.QuickTips.getQuickTip().update(tEl.dom.innerHTML);
						Ext.QuickTips.getQuickTip().show();
					}
					else {
						tEl.dom.removeAttribute("data-qtip");
					}
				}
			}
		}
	}
});
