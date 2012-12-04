/**
 * @author Joe Kuan (much improved & ported from ExtJs 3 highchart adapter)
 * @email kuan.joe@gmail.com
 * @version 2.2.1
 * @date 1 Dec 2012
 *
 * Highcharts extension for Sencha Ext JS 4 and Touch 2
 *
 * You are not permitted to remove the author section from this file.
 */
if(!Array.prototype.indexOf)Array.prototype.indexOf=function(a,b){var d=this.length,c=Number(b)||0,c=c<0?Math.ceil(c):Math.floor(c);for(c<0&&(c+=d);c<d;c++)if(c in this&&this[c]===a)return c;return-1};
Ext.define("Chart.ux.Highcharts",{extend:"Ext.Component",alias:["widget.highchart"],debug:!1,debugOn:function(){this.debug=!0},sencha:function(){return Ext.versions.extjs?{product:"e",major:Ext.versions.extjs.major,name:"e"+Ext.versions.extjs.major}:Ext.versions.touch?{product:"t",major:Ext.versions.touch.major,name:"t"+Ext.versions.touch.major}:{product:null,major:null,name:null}}(),log:function(a){typeof console!=="undefined"&&this.debug&&console.log(a)},defaultSerieType:null,resizable:!0,updateDelay:0,
loadMask:!1,refreshOnChange:!1,refreshOnLoad:!0,animation:!0,initAnim:!0,updateAnim:!0,lineShift:!1,initAnimAfterLoad:!0,afterChartRendered:null,constructor:function(a){a.listeners&&(this.afterChartRendered=a.listeners.afterChartRendered);this.afterChartRendered&&(this.afterChartRendered=Ext.bind(this.afterChartRendered,this));if(a.animation==!1)this.initAnimAfterLoad=this.updateAnim=this.initAnim=this.animation=!1;this.sencha.product=="t"&&this.on("painted",this.afterRender);this.callParent(arguments)},
initComponent:function(){if(this.store)this.store=Ext.data.StoreManager.lookup(this.store);if(this.animation==!1)this.initAnimAfterLoad=this.updateAnim=this.initAnim=!1;this.callParent(arguments)},addSeries:function(a,b){for(var b=b===null||b===!0?!0:!1,d=this.sencha.product=="t"?this.config:this,c=[],h=[],f,g=0;g<a.length;g++){var j=a[g];j.serieCls?f=j:(f=j.type!=null||this.defaultSerieType!=null?Chart.ux.Highcharts.Series.get(j.type!=null?j.type:this.defaultSerieType):Chart.ux.Highcharts.Serie,
f=Ext.create(f,j));h.push(f.config);c.push(f)}if(this.chart){b?(d.chartConfig.series=d.chartConfig.series?d.chartConfig.series.concat(h):h,d.series=d.series?d.series.concat(c):c):(this.removeAllSeries(),d.series=c,d.chartConfig.series=h);for(g=0;g<h.length;g++)this.chart.addSeries(h[g],!0);this.refresh()}else b?(d.chartConfig.series=d.chartConfig.series?d.chartConfig.series.concat(h):h,d.series=d.series?d.series.concat(c):c):(d.chartConfig.series=h,d.series=c)},removeSerie:function(a,b){var d=this.sencha.product==
"t"?this.config:this,b=b||!0;this.chart&&(this.chart.series[a].remove(b),d.chartConfig.series.splice(a,1));d.series.splice(a,1)},removeAllSeries:function(){for(var a=(this.sencha.product=="t"?this.config:this).series.length,b=0;b<a;b++)this.removeSerie(0)},setTitle:function(a){var b=this.sencha.product=="t"?this.config:this;b.chartConfig.title?b.chartConfig.title.text=a:b.chartConfig.title={text:a};this.chart&&this.chart.container&&this.draw()},setSubTitle:function(a){var b=this.sencha.product=="t"?
this.config:this;b.chartConfig.subtitle?b.chartConfig.subtitle.text=a:b.chartConfig.subtitle={text:a};this.chart&&this.chart.container&&this.draw()},initEvents:function(){if(this.loadMask)this.loadMask=new Ext.LoadMask(this.el,Ext.apply({store:this.store},this.loadMask))},afterRender:function(){var a=this.sencha.product=="t"?this.config:this;this.store&&this.bindStore(this.store,!0);this.bindComponent(!0);Ext.apply(a.chartConfig.chart,{renderTo:this.sencha.product=="t"?this.element.dom:this.el.dom});
Ext.applyIf(a.chartConfig,{xAxis:[{}]});a.xField&&this.store&&this.updatexAxisData();a.series?this.addSeries(a.series,!1):a.series=[];this.initEvents();this.update(0)},onMove:function(){},buildInitData:function(){var a=this.sencha.product=="t"?this.config:this;if(this.store&&!this.store.isLoading()&&a.chartConfig&&!(this.initAnim===!1||a.chartConfig.chart.animation===!1)){var b=[],d=a.series.length,c,h=this.store.data.items;a.chartConfig.series===void 0&&(a.chartConfig.series=[]);for(c=0;c<d;c++){a.chartConfig.series[c]?
a.chartConfig.series[c].data=[]:a.chartConfig.series[c]={data:[]};var f=a.series[c].type||a.chartConfig.chart.type||a.chartConfig.chart.defaultSeriesType||"line",b=a.chartConfig.series[c].data=a.chartConfig.series[c].data||{};switch(f){case "line":case "spline":case "area":case "areaspline":case "scatter":case "bar":case "column":var g=a.series[c].yField||a.series[c].dataIndex;if(a.series[c].xField)for(var j=a.series[c].xField,f=0;f<h.length;f++){var e=h[f];b.push([e.data[j],e.data[g]])}else if(a.series[c].yField||
a.series[c].dataIndex){for(f=0;f<h.length;f++)e=h[f],b.push(e.data[g]);b=Ext.isArray(a.chartConfig.xAxis)?a.chartConfig.xAxis[0]:a.chartConfig.xAxis;if(a.xField&&(!b.categories||b.categories.length<h.length)){b.categories=b.categories||[];for(f=0;f<h.length;f++)b.categories.push(h[f].data[a.xField])}}break;case "pie":var j=a.series[c].categorieField,g=a.series[c].dataField,k=a.series[c].colorField;if(a.series[c].totalDataField){for(var i={},f=0;f<h.length;f++){var e=h[f],l=e.data[j];i[l]=i[l]||{total:0};
i[l].total+=e.data[g];k&&(i[l].color=e.data[k])}for(var m in i)l={name:m,y:i[m].total},i[m].color&&(l.color=i[m].color),b.push(l)}else for(f=0;f<h.length;f++)e=h[f],l={name:e.data[j],y:e.data[g]},k&&(l.color=e.data[k]),b.push(l);break;case "columnrange":case "arearange":case "areasplinerange":j=a.series[c].xField;if(Ext.isArray(a.series[c].dataIndex)){g=a.series[c].dataIndex[0];k=a.series[c].dataIndex[1];for(f=0;f<h.length;f++)e=h[f],i=e.data[g],l=e.data[k],j?i>l?b.push([e.data[j],l,i]):b.push([e.data[j],
i,l]):i>l?b.push([l,i]):b.push([i,l])}else if(a.series[c].minDataIndex&&a.series[c].maxDataIndex){g=a.series[c].minDataIndex;k=a.series[c].maxDataIndex;for(f=0;f<h.length;f++)e=h[f],i=e.data[g],l=e.data[k],j?b.push([e.data[j],i,l]):b.push([i,l])}b=Ext.isArray(a.chartConfig.xAxis)?a.chartConfig.xAxis[0]:a.chartConfig.xAxis;if(a.xField&&!j&&(!b.categories||b.categories.length<h.length)){b.categories=b.categories||[];for(f=0;f<h.length;f++)b.categories.push(h[f].data[a.xField])}}}}},draw:function(){var a=
this.sencha.product=="t"?this.config:this;this.log("call draw");if(this.chart&&this.rendered){if(this.resizable){for(var b=0;b<a.series.length;b++)a.series[b].visible=this.chart.series[b].visible;this.chart.destroy();delete this.chart;this.buildInitData();this.chart=new Highcharts.Chart(a.chartConfig,this.afterChartRendered)}}else if(this.rendered)if(this.initAnimAfterLoad){this.log("initAnimAfterLoad is on, defer creating chart");return}else this.buildInitData(),this.chart=new Highcharts.Chart(a.chartConfig,
this.afterChartRendered),this.log("initAnimAfterLoad is off, creating chart from fresh");for(b=0;b<a.series.length;b++)a.series[b].visible||this.chart.series[b].hide();this.store.isLoading()||(this.log("Call refresh from draw"),this.refresh())},onContainerResize:function(){this.draw()},updatexAxisData:function(){var a=this.sencha.product=="t"?this.config:this,b=[],d=this.store.data.items;if(a.xField&&this.store){for(var c=0;c<d.length;c++)b.push(d[c].data[a.xField]);this.chart?this.chart.xAxis[0].setCategories(b,
!0):Ext.isArray(a.chartConfig.xAxis)?a.chartConfig.xAxis[0].categories=b:a.chartConfig.xAxis.categories=b}},bindComponent:function(a){var b=function(a){return a.ownerCt?b(a.ownerCt):a},d=b(this);if(a){if(d.on("move",this.onMove,this),d.on("resize",this.onResize,this),this.ownerCt)this.ownerCt.on("render",this.update,this)}else this.ownerCt&&this.ownerCt.un("render",this.update,this),d.un("move",this.onMove,this)},bindStore:function(a,b){!b&&this.store&&(a!==this.store&&this.store.autoDestroy?this.store.destroy():
(this.store.un("datachanged",this.onDataChange,this),this.store.un("load",this.onLoad,this),this.store.un("add",this.onAdd,this),this.store.un("remove",this.onRemove,this),this.store.un("update",this.onUpdate,this),this.store.un("clear",this.onClear,this)));a&&(a=Ext.StoreMgr.lookup(a),a.on({scope:this,load:this.onLoad,datachanged:this.onDataChange,add:this.onAdd,remove:this.onRemove,update:this.onUpdate,clear:this.onClear}));(this.store=a)&&!b&&this.refresh()},refresh:function(){var a=this.sencha.product==
"t"?this.config:this;this.log("Call refresh ");if(this.store&&this.chart){var b=[],d=a.series.length,c;for(c=0;c<d;c++)b.push([]);for(var h=this.store.data.items,f=[],g=0;g<h.length;g++){var j=h[g];a.xField&&f.push(j.data[a.xField]);for(c=0;c<d;c++){var e=a.series[c];e.dataIndex||e.yField||e.minDataIndex||e.config.getData?(e=e.getData(j,g),b[c].push(e)):e.type=="pie"?e.useTotals?(g==0&&e.clear(),e.getData(j,g)):e.totalDataField?e.getData(j,b[c]):(e=e.getData(j,g),b[c].push(e)):e.type=="gauge"?b[c][0]=
e.getData(j,g):e.data&&e.data.length&&(e.data[g]!==void 0?b[c].push(e.data[g]):b[c].push(null))}}if(this.updateAnim){j=-1;this.log("Update animation with line shift: "+a.lineShift);for(c=0;c<d;c++)if(a.series[c].useTotals)this.chart.series[c].setData(a.series[c].getTotals());else if(b[c].length>0)if(a.lineShift){var k=Ext.isArray(this.chart.xAxis)?this.chart.xAxis[0]:this.chart.xAxis,i=-1;if(k.categories){if(c==0){for(g=0;g<f.length;g++){for(var l=!1,e=0;e<k.categories.length;e++)if(f[g]==k.categories[e]){l=
!0;break}if(!l){j=i=g;break}}e=k.categories.slice(0);e.push(f[g]);k.setCategories(e,!1)}else i=j;this.log("startIdx "+i);if(i!==-1&&i<f.length)for(g=i;g<f.length;g++)this.chart.series[c].addPoint(b[c][g],!1,!0,!0)}else{k=this.chart.series[c].points;for(g=0;g<b[c].length;g++){l=!1;for(e=0;e<k.length;e++)if(b[c][g][0]==k[e].x){l=!0;break}if(!l){i=g;break}}this.log("startIdx "+i);if(i!==-1&&i<b[c].length)for(g=i;g<b[c].length;g++)this.chart.series[c].addPoint(b[c][g],!1,!0,!0)}}else{i=this.chart.series[c].points.length;
k=h.length;for(g=0;g<Math.min(i,k);g++)this.chart.series[c].points[g].update(b[c][g],!1,!0);if(a.series[c].type!="pie")if(this.log("chartSeriesLength "+i+", storeSeriesLength "+k),k>i)for(e=0;e<k-i;e++,g++)this.chart.series[c].addPoint(b[c][g],!1,!1,!0);else if(i>k)for(e=0;e<i-k;e++)this.chart.series[c].points[this.chart.series[c].points.length-1].remove(!1,!0)}a.xField&&!a.lineShift&&this.chart.xAxis[0].setCategories(f,!0);this.chart.redraw()}else{for(c=0;c<d;c++)a.series[c].useTotals?this.chart.series[c].setData(a.series[c].getTotals()):
b[c].length>0&&this.chart.series[c].setData(b[c],c==d-1);a.xField&&this.chart.xAxis[0].setCategories(f,!0)}}},refreshRow:function(a){var b=this.sencha.product=="t"?this.config:this,d=this.store.indexOf(a);if(this.chart){for(var c=0;c<this.chart.series.length;c++){var h=this.chart.series[c],f=b.series[c].getData(a,d);b.series[c].type=="pie"&&b.series[c].useTotals?(b.series[c].update(a),this.chart.series[c].setData(b.series[c].getTotals())):h.data[d].update(f)}b.xField&&this.updatexAxisData()}},update:function(a){a=
a||this.updateDelay;if(!this.updateTask)this.updateTask=new Ext.util.DelayedTask(this.draw,this);this.updateTask.delay(a)},onDataChange:function(){this.refreshOnChange&&this.refresh()&&this.log("onDataChange")},onClear:function(){this.sencha.product=="t"&&this.store&&!this.store.isLoading()&&this.refresh()},onUpdate:function(a,b){this.refreshRow(b)},onAdd:function(a,b,d){for(var a=this.sencha.product=="t"?this.config:this,c=!1,h=[],f=0;f<b.length;f++){var g=b[f];f==b.length-1&&(c=!0);a.xField&&h.push(g.data[a.xField]);
for(var j=0;j<this.chart.series.length;j++){var e=this.chart.series[j],k=a.series[j],i=k.getData(g,d+f);k.type=="pie"&&k.useTotals||e.addPoint(i,c)}}a.xField&&this.chart.xAxis[0].setCategories(h,!0)},onResize:function(){this.callParent(arguments);this.update()},onRemove:function(a,b,d){for(var a=this.sencha.product=="t"?this.config:this,c=0;c<a.series.length;c++){var h=a.series[c];h.type=="pie"&&h.useTotals?(h.removeData(b,d),this.chart.series[c].setData(h.getTotals())):this.chart.series[c].data[d].remove(!0)}Ext.each(this.chart.series,
function(a){a.data[d].remove(!0)});a.xField&&this.updatexAxisData()},onLoad:function(){var a=this.sencha.product=="t"?this.config:this;!this.chart&&this.initAnimAfterLoad?(this.log("Call refresh from onLoad for initAnim"),this.buildInitData(),this.chart=new Highcharts.Chart(a.chartConfig,this.afterChartRendered)):(this.log("Call refresh from onLoad"),this.refreshOnLoad&&this.refresh())},destroy:function(){delete (this.sencha.product=="t"?this.config:this).series;this.chart&&(this.chart.destroy(),
delete this.chart);this.bindStore(null);this.bindComponent(null);this.callParent(arguments)}});Chart.ux.Highcharts.Series=function(){var a=[],b=[];return{reg:function(d,c){a.push(c);b.push(d)},get:function(d){return a[b.indexOf(d)]}}}();
Ext.define("Chart.ux.Highcharts.Serie",{type:null,pointObject:!1,xField:null,yField:null,visible:!0,clear:Ext.emptyFn,obj_getData:function(a){var b={data:a.data,y:a.data[this.yField||this.dataIndex]};this.xField&&(b.x=a.data[this.xField]);this.colorField&&(b.color=a.data[this.colorField]);return b},arr_getDataSingle:function(a){return a.data[this.yField]},arr_getDataPair:function(a){return[a.data[this.xField],a.data[this.yField]]},serieCls:!0,constructor:function(a){a.type=this.type;if(!a.data)a.data=
[];Ext.apply(this,a);this.config=a;this.yField=this.yField||this.dataIndex;if(!this.getData)this.getData=this.pointObject?this.obj_getData:this.xField?this.arr_getDataPair:this.arr_getDataSingle}});
Ext.define("Chart.ux.Highcharts.RangeSerie",{extend:"Chart.ux.Highcharts.Serie",minDataIndex:null,maxDataIndex:null,needSorting:null,constructor:function(a){if(Ext.isArray(a.dataIndex))this.field1=a.dataIndex[0],this.field2=a.dataIndex[1],this.needSorting=!0;else if(a.minDataIndex&&a.maxDataIndex)this.minDataIndex=a.minDataIndex,this.maxDataIndex=a.maxDataIndex,this.needSorting=!1;this.callParent(arguments)},getData:function(a){if(this.needSorting===!0)return a.data[this.field1]>a.data[this.field2]?
[a.data[this.field2],a.data[this.field1]]:[a.data[this.field1],a.data[this.field2]];if(a.data[this.minDataIndex]!==void 0&&a.data[this.maxDataIndex]!==void 0)return[a.data[this.minDataIndex],a.data[this.maxDataIndex]]}});Chart.ux.Highcharts.version="2.2";Ext.define("Chart.ux.Highcharts.SplineSerie",{extend:"Chart.ux.Highcharts.Serie",type:"spline"});Chart.ux.Highcharts.Series.reg("spline","Chart.ux.Highcharts.SplineSerie");
Ext.define("Chart.ux.Highcharts.ColumnSerie",{extend:"Chart.ux.Highcharts.Serie",type:"column"});Chart.ux.Highcharts.Series.reg("column","Chart.ux.Highcharts.ColumnSerie");Ext.define("Chart.ux.Highcharts.BarSerie",{extend:"Chart.ux.Highcharts.Serie",type:"bar"});Chart.ux.Highcharts.Series.reg("bar","Chart.ux.Highcharts.BarSerie");Ext.define("Chart.ux.Highcharts.LineSerie",{extend:"Chart.ux.Highcharts.Serie",type:"line"});Chart.ux.Highcharts.Series.reg("line","Chart.ux.Highcharts.LineSerie");
Ext.define("Chart.ux.Highcharts.AreaSerie",{extend:"Chart.ux.Highcharts.Serie",type:"area"});Chart.ux.Highcharts.Series.reg("area","Chart.ux.Highcharts.AreaSerie");Ext.define("Chart.ux.Highcharts.AreaSplineSerie",{extend:"Chart.ux.Highcharts.Serie",type:"areaspline"});Chart.ux.Highcharts.Series.reg("areaspline","Chart.ux.Highcharts.AreaSplineSerie");Ext.define("Chart.ux.Highcharts.GaugeSerie",{extend:"Chart.ux.Highcharts.Serie",type:"gauge"});Chart.ux.Highcharts.Series.reg("gauge","Chart.ux.Highcharts.GaugeSerie");
Ext.define("Chart.ux.Highcharts.AreaRangeSerie",{extend:"Chart.ux.Highcharts.RangeSerie",type:"arearange"});Chart.ux.Highcharts.Series.reg("arearange","Chart.ux.Highcharts.AreaRangeSerie");Ext.define("Chart.ux.Highcharts.AreaSplineRangeSerie",{extend:"Chart.ux.Highcharts.RangeSerie",type:"areasplinerange"});Chart.ux.Highcharts.Series.reg("areasplinerange","Chart.ux.Highcharts.AreaSplineRangeSerie");Ext.define("Chart.ux.Highcharts.ColumnRangeSerie",{extend:"Chart.ux.Highcharts.RangeSerie",type:"columnrange"});
Chart.ux.Highcharts.Series.reg("columnrange","Chart.ux.Highcharts.ColumnRangeSerie");Ext.define("Chart.ux.Highcharts.ScatterSerie",{extend:"Chart.ux.Highcharts.Serie",type:"scatter"});Chart.ux.Highcharts.Series.reg("scatter","Chart.ux.Highcharts.ScatterSerie");
Ext.define("Chart.ux.Highcharts.PieSerie",{extend:"Chart.ux.Highcharts.Serie",type:"pie",categorieField:null,totalDataField:!1,dataField:null,useTotals:!1,columns:[],constructor:function(a){this.callParent(arguments);if(this.useTotals){this.columnData={};for(var b=this.columns.length,d=0;d<b;d++)this.columnData[this.columns[d]]=100/b}},addData:function(a){for(var b=0;b<this.columns.length;b++){var d=this.columns[b];this.columnData[d]+=a.data[d]}},update:function(a){for(var b=0;b<this.columns.length;b++){var d=
this.columns[b];a.modified[d]&&(this.columnData[d]=this.columnData[d]+a.data[d]-a.modified[d])}},removeData:function(a){for(var b=0;b<this.columns.length;b++){var d=this.columns[b];this.columnData[d]-=a.data[d]}},clear:function(){for(var a=0;a<this.columns.length;a++)this.columnData[this.columns[a]]=0},getData:function(a,b){if(this.totalDataField){for(var d=null,c=0;c<b.length;c++)if(b[c].name==a.data[this.categorieField]){d=c;b[c].y+=a.data[this.dataField];break}d===null&&(this.colorField&&a.data[this.colorField]?
b.push({name:a.data[this.categorieField],y:a.data[this.dataField],color:a.data[this.colorField]}):b.push({name:a.data[this.categorieField],y:a.data[this.dataField]}),c=b.length-1);return b[c]}return this.useTotals?(this.addData(a),[]):this.colorField&&a.data[this.colorField]?{name:a.data[this.categorieField],y:a.data[this.dataField],color:a.data[this.colorField]}:{name:a.data[this.categorieField],y:a.data[this.dataField]}},getTotals:function(){for(var a=[],b=0;b<this.columns.length;b++){var d=this.columns[b];
a.push([d,this.columnData[d]])}return a}});Chart.ux.Highcharts.Series.reg("pie",Chart.ux.Highcharts.PieSerie);