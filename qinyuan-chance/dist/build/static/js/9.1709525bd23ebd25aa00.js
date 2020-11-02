webpackJsonp([9],{"5jj3":function(e,t,i){var r=i("ikb8");"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);i("FIqI")("42461198",r,!1,{})},"Sqv/":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i("4YfN"),a=i.n(r),o={name:"firmwareList",data:function(){var e=this;return{permission:{edit:!1,delete:!1,add:!1,downlowd:!1},act:"",dialog:!1,uploadSuccess:!1,upLoadUrl:"",dialogTitle:"",dialogLoading:!1,formLoading:!0,productLoading:!1,filter:{productKey:"",firmwareVersion:"",firmwareType:""},form:{productKey:"",firmwareVersion:"",firmwareType:"",downLoadUrl:""},rule:{productKey:[{required:!0,message:"请选择产品",trigger:"blur"}],firmwareVersion:[{required:!0,message:"请输入固件版本",trigger:"blur"}],firmwareType:[{required:!0,message:"请输入固件类型",trigger:"blur"}],downLoadUrl:[{required:!0,message:"请上传固件升级文件",trigger:"blur"}]},productList:[],columns:[{title:"产品名称",key:"productName",align:"center",render:function(t,i){return t("div",[t("span",e.dealNull(i.row.productName))])}},{title:"模块型号",key:"firmwareType",align:"center",render:function(t,i){return t("div",[t("span",e.dealNull(i.row.firmwareType))])}},{title:"固件版本",key:"firmwareVersion",align:"center",render:function(t,i){return t("div",[t("span",e.dealNull(i.row.firmwareVersion))])}},{title:"升级文件",key:"firmwareVersion",align:"center",render:function(t,i){return t("div",[t("Button",{props:{size:"small",type:"text"},style:{marginRight:"5px",color:"blue",display:e.permission.downlowd?"inline-block":"none"},on:{click:function(){e.handleDownload(i.row)}}},"下载文件")])}},{title:"操作",key:"action",width:150,align:"center",render:function(t,i){return t("div",[t("Button",{props:{type:"primary",size:"small"},style:{marginRight:"5px",display:e.permission.edit?"inline-block":"none"},on:{click:function(){e.handleEdit(i.row)}}},"修改"),t("Button",{props:{type:"error",size:"small"},style:{display:e.permission.delete?"inline-block":"none"},on:{click:function(){e.handleDelete(i.row)}}},"删除")])}}]}},mounted:function(){this.handleGetPermisson(),this.getTableData(),this.getProductList(),this.upLoadUrl=this.$AxConfig.baseURL+this.$api.common_uploadImg},methods:{getTableData:function(){this.tableLoading=!0;var e=this.$api.manage_firmwareVersion_getFirmwareVersionList,t=a()({},this.filter);this.$refs.HDTable.getListData(e,t)},getProductList:function(){var e=this;this.productLoading=!0;var t=this.$api.manage_product_list;this.$Ax.get(t,{params:{pageNum:1,pageSize:1e3}}).then(function(t){e.productList=t.data.data,e.productLoading=!1}).catch(function(e){console.log(e)})},handleDelete:function(e){var t=this,i=this.$api.manage_firmwareVersion_deleteFirmwareVersion,r={id:e.id};this.$Modal.confirm({title:"提示",content:"<p>确认删除该条数据?</p>",onOk:function(){t.$Ax.post(i,r).then(function(e){e.data.success?t.getTableData():t.$Message.error(e.data.data)}).catch(function(e){console.log(e)})},onCancel:function(){t.$Message.success("已取消删除。")}})},handleEdit:function(e){var t=this;this.act="edit",this.getProductList(),this.dialogTitle="编辑",this.dialogLoading=!0,this.dialog=!0;var i=this.$api.manage_firmwareVersion_getFirmwareVersionInfo,r={id:e.id};this.$Ax.get(i,{params:r}).then(function(e){t.form=e.data.data,t.dialogLoading=!1}).catch(function(e){console.log(e)})},handleAdd:function(){this.getProductList(),this.act="add",this.dialog=!0,this.dialogTitle="添加"},handleDownload:function(e){window.open(e.downLoadUrl)},onUploadSuccess:function(e,t,i){this.uploadSuccess=!0,this.form.downLoadUrl=this.$AxConfig.baseURL+this.$api.common_getFile+e.data.fileId,this.$Message.success("固件升级文件上传成功。")},submit:function(){var e=this,t=this.$api.manage_firmwareVersion_saveFirmwareVersion,i="",r="";"add"==this.act?(r="添加成功。",i={productKey:this.form.productKey,firmwareVersion:this.form.firmwareVersion,firmwareType:this.form.firmwareType,downLoadUrl:this.form.downLoadUrl}):(r="编辑成功。",i={productKey:this.form.productKey,firmwareVersion:this.form.firmwareVersion,firmwareType:this.form.firmwareType,downLoadUrl:this.form.downLoadUrl,id:this.form.id}),this.$refs.form.validate(function(a){if(!a)return e.changeLoading();e.$Ax.post(t,i).then(function(t){t.data.success&&(e.$Message.success(r),e.getTableData(),e.dialog=!1)}).catch(function(e){console.log(e)}),setTimeout(function(){e.changeLoading()},1e3)})},cancel:function(){this.$refs.form.resetFields()},changeLoading:function(){var e=this;this.formLoading=!1,this.$nextTick(function(){e.formLoading=!0})},dealNull:function(e){return""===e||null===e?"--":e},handleGetPermisson:function(){var e=JSON.parse(sessionStorage.getItem("menu"));for(var t in e)if("固件管理"==e[t].name){var i=e[t].children[0].children;for(var r in i)"固件删除"==i[r].name&&(this.permission.delete=i[r].checked),"固件新增"==i[r].name&&(this.permission.add=i[r].checked),"固件修改"==i[r].name&&(this.permission.edit=i[r].checked),"固件文件下载"==i[r].name&&(this.permission.downlowd=i[r].checked)}}}},n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"firmwareList"}},[i("div",{staticClass:"actBox clearfloat"},[i("Button",{staticClass:"left",attrs:{type:"primary"},on:{click:e.getTableData}},[e._v("查询")]),e._v(" "),e.permission.add?i("Button",{staticClass:"right",attrs:{type:"primary"},on:{click:e.handleAdd}},[e._v("新增")]):e._e()],1),e._v(" "),i("Form",{ref:"filter",staticClass:"clearfloat",attrs:{model:e.filter,"label-width":0}},[i("FormItem",{staticClass:"input left marginRight",attrs:{prop:"value"}},[i("Select",{staticClass:"input marginRight",attrs:{loading:e.productLoading,placeholder:"产品名称",clearable:""},model:{value:e.filter.productKey,callback:function(t){e.$set(e.filter,"productKey",t)},expression:"filter.productKey"}},e._l(e.productList,function(t){return i("Option",{key:t.productKey,attrs:{value:t.productKey}},[e._v(e._s(t.name))])}))],1),e._v(" "),i("FormItem",{staticClass:"input left marginRight",attrs:{prop:"firmwareType"}},[i("Input",{staticClass:"input",attrs:{placeholder:"模块型号"},model:{value:e.filter.firmwareType,callback:function(t){e.$set(e.filter,"firmwareType",t)},expression:"filter.firmwareType"}})],1),e._v(" "),i("FormItem",{staticClass:"input left marginRight",attrs:{prop:"firmwareVersion"}},[i("Input",{staticClass:"input",attrs:{placeholder:"固件版本"},model:{value:e.filter.firmwareVersion,callback:function(t){e.$set(e.filter,"firmwareVersion",t)},expression:"filter.firmwareVersion"}})],1)],1),e._v(" "),i("div",{staticClass:"table clearfloat marginTop"},[i("HDTable",{ref:"HDTable",attrs:{columns:e.columns}})],1),e._v(" "),i("Modal",{staticStyle:{position:"relative"},attrs:{title:e.dialogTitle,loading:e.formLoading},on:{"on-ok":e.submit,"on-cancel":e.cancel},model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[i("Form",{ref:"form",attrs:{model:e.form,rules:e.rule,"label-position":"right","label-width":80}},[i("FormItem",{attrs:{prop:"productKey",label:"产品名称:"}},[i("Select",{staticClass:"input marginRight",attrs:{loading:e.productLoading,placeholder:"产品名称",clearable:""},model:{value:e.form.productKey,callback:function(t){e.$set(e.form,"productKey",t)},expression:"form.productKey"}},e._l(e.productList,function(t){return i("Option",{key:t.productKey,attrs:{value:t.productKey}},[e._v(e._s(t.name))])}))],1),e._v(" "),i("FormItem",{attrs:{prop:"firmwareType",label:"模块型号:"}},[i("Input",{staticClass:"input",model:{value:e.form.firmwareType,callback:function(t){e.$set(e.form,"firmwareType",t)},expression:"form.firmwareType"}})],1),e._v(" "),i("FormItem",{attrs:{prop:"firmwareVersion",label:"固件版本:"}},[i("Input",{staticClass:"input",model:{value:e.form.firmwareVersion,callback:function(t){e.$set(e.form,"firmwareVersion",t)},expression:"form.firmwareVersion"}})],1),e._v(" "),i("FormItem",{attrs:{prop:"downLoadUrl",label:"文件位置:"}},[i("Input",{staticClass:"input",attrs:{disabled:!0},model:{value:e.form.downLoadUrl,callback:function(t){e.$set(e.form,"downLoadUrl",t)},expression:"form.downLoadUrl"}}),e._v(" "),i("Upload",{attrs:{action:e.upLoadUrl,"show-upload-list":!1,"on-success":e.onUploadSuccess}},[i("Button",{attrs:{icon:"ios-cloud-upload-outline"}},[e._v("上传固件")])],1)],1)],1),e._v(" "),e.dialogLoading?i("Spin",{attrs:{fix:""}}):e._e()],1)],1)};n._withStripped=!0;var s={render:n,staticRenderFns:[]},l=s;var c=!1;var d=i("C7Lr")(o,l,!1,function(e){c||i("5jj3")},"data-v-9b25b6ba",null);d.options.__file="src/views/firmware/firmwareList.vue";t.default=d.exports},ikb8:function(e,t,i){(e.exports=i("UTlt")(!0)).push([e.i,"\n.actBox[data-v-9b25b6ba] {\n\tmargin-bottom: 20px;\n}\n","",{version:3,sources:["/Users/nelson/workspace/qinyuan-chance-farm-web/static-files/src/views/firmware/firmwareList.vue"],names:[],mappings:";AACA;CACC,oBAAoB;CACpB",file:"firmwareList.vue",sourcesContent:["\n.actBox[data-v-9b25b6ba] {\n\tmargin-bottom: 20px;\n}\n"],sourceRoot:""}])}});