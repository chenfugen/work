webpackJsonp([5],{"+wl5":function(t,n,e){(t.exports=e("UTlt")(!0)).push([t.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n","",{version:3,sources:[],names:[],mappings:"",file:"keyEnterHis.vue",sourceRoot:""}])},bXNp:function(t,n,e){var a=e("+wl5");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);e("FIqI")("c8418d56",a,!1,{})},fDiR:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var a={name:"keyEnterHis",data:function(){var t=this;return{tableLoading:!1,pageLoading:!1,productLoading:!1,selection:[],filter:{productKey:"",erpCode:"",workOrderCode:"",status:""},productList:[],ableProductList:[],columns:[{type:"selection",width:60,align:"center"},{title:"模组IMEI号",align:"center",key:"productName",render:function(n,e){return n("div",[n("span",t.dealData(e.row.productName))])}},{title:"任务状态",key:"status",align:"center",render:function(t,n){return t("div",[t("span",{style:{color:0==n.row.status?"green":1==n.row.status?"green":"red"}},0==n.row.status?"新建":1==n.row.status?"进行中":"结束")])}}]}},mounted:function(){this.pageNum=1,this.pageSize=10,this.getTableData(),this.getProductList(),this.remoteProductList("")},methods:{getTableData:function(){this.tableLoading=!0;var t=this.$api.manage_productionTask_getProductionTaskList,n={productKey:this.filter.productKey,productName:this.filter.productName,erpCode:this.filter.erpCode,status:this.filter.status};this.$refs.HDTable.getListData(t,n)},getProductList:function(){var t=this,n=this.$api.manage_product_list;this.$Ax.get(n,{params:{pageNum:1,pageSize:100,qcForbidden:1}}).then(function(n){t.productList=n.data.data}).catch(function(t){console.log(t)})},handleStart:function(){},handleSelection:function(t){this.selection=t},remoteProductList:function(t){var n=this;this.productLoading=!0;var e=this.$api.manage_product_productList,a={productName:t};this.$Ax.get(e,{params:a}).then(function(t){var e=t.data.data;for(var a in n.ableProductList=[],e){var r={name:e[a].split("-HadLinks-")[0],productKey:e[a].split("-HadLinks-")[1]};n.ableProductList.push(r)}n.productLoading=!1}).catch(function(t){console.log(t)})},dealData:function(t){return""===t||null===t?"--":t}}},r=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"clearfloat",staticStyle:{position:"relative"},attrs:{id:"keyEnterHis"}},[e("div",{staticClass:"actBox clearfloat"},[e("Button",{staticClass:"right",attrs:{type:"primary",disabled:t.selection.length<1},on:{click:t.handleStart}},[t._v("开始烧录")])],1),t._v(" "),e("div",{staticClass:"filterbox marginTop"},[e("Form",{staticClass:"clearfloat",attrs:{model:t.filter,"label-width":120}},[e("FormItem",{staticClass:"left",attrs:{label:"生产型号："}},[e("span",[t._v("XXXXXXXXXX")])]),t._v(" "),e("FormItem",{staticClass:"left",attrs:{label:"任务总量："}},[e("span",[t._v("10000")])]),t._v(" "),e("FormItem",{staticClass:"left",attrs:{label:"已完成数量："}},[e("span",[t._v("999")])])],1)],1),t._v(" "),e("div",{staticClass:"filterbox marginTop"},[e("Form",{ref:"filter",staticClass:"clearfloat",attrs:{model:t.filter,"label-width":0}},[e("FormItem",{staticClass:"input left marginRight",attrs:{prop:"productKey"}},[e("Select",{staticClass:"input marginRight",attrs:{placeholder:"IMEI号码",clearable:""},model:{value:t.filter.productKey,callback:function(n){t.$set(t.filter,"productKey",n)},expression:"filter.productKey"}},t._l(t.productList,function(n){return e("Option",{key:n.productKey,attrs:{value:n.productKey}},[t._v(t._s(n.name))])}))],1),t._v(" "),e("FormItem",{staticClass:"input left marginRight",attrs:{prop:"erpCode"}},[e("Input",{staticClass:"input",attrs:{placeholder:"ProductKey"},model:{value:t.filter.erpCode,callback:function(n){t.$set(t.filter,"erpCode",n)},expression:"filter.erpCode"}})],1),t._v(" "),e("FormItem",{staticClass:"input left marginRight",attrs:{prop:"workOrderCode"}},[e("Input",{staticClass:"input",attrs:{placeholder:"DeviceName"},model:{value:t.filter.workOrderCode,callback:function(n){t.$set(t.filter,"workOrderCode",n)},expression:"filter.workOrderCode"}})],1),t._v(" "),e("FormItem",{staticClass:"input left marginRight",attrs:{prop:"status"}},[e("Select",{staticClass:"input marginRight",attrs:{placeholder:"烧写时间",clearable:""},model:{value:t.filter.status,callback:function(n){t.$set(t.filter,"status",n)},expression:"filter.status"}},[e("Option",{attrs:{value:0}},[t._v("新建")]),t._v(" "),e("Option",{attrs:{value:1}},[t._v("进行中")]),t._v(" "),e("Option",{attrs:{value:2}},[t._v("结束")])],1)],1),t._v(" "),e("FormItem",{staticClass:"input left marginRight"},[e("Button",{staticClass:"left",attrs:{type:"primary"},on:{click:t.getTableData}},[t._v("查询")])],1)],1)],1),t._v(" "),e("div",{staticStyle:{position:"relative"}},[e("HDTable",{ref:"HDTable",attrs:{columns:t.columns},on:{changeSel:t.handleSelection}})],1),t._v(" "),t.pageLoading?e("Spin",{attrs:{fixd:""}}):t._e()],1)};r._withStripped=!0;var i={render:r,staticRenderFns:[]},s=i;var o=!1;var l=e("C7Lr")(a,s,!1,function(t){o||e("bXNp")},"data-v-ea4b5546",null);l.options.__file="src/views/keyEnter/keyEnterHis.vue";n.default=l.exports}});