YUI.add("datasource-jsonparser",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};B.mix(A,{NS:"parser",NAME:"DataSourceJSONParser",ATTRS:{parser:{readOnly:true,value:B.DataParser.JSON,useRef:true},schema:{}}});B.extend(A,B.Plugin,{initializer:function(C){this.doBefore("_defDataFn",this._beforeDefDataFn);},_beforeDefDataFn:function(D){var C=(this.get("parser").parse(this.get("schema"),D.data));if(!C){C={meta:{},results:D.data};}this._owner.fire("response",B.mix({response:C},D));return new B.Do.Halt("DataSourceJSONParser plugin halted _defDataFn");}});B.namespace("plugin");B.plugin.DataSourceJSONParser=A;},"@VERSION@",{requires:["plugin","datasource-base","dataparser-json"]});