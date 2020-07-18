"use strict";app.controller("proDimensionC",["$scope","$http","$location",function(a,e,t){a.productTypeList=JSON.parse(sessionStorage.getItem("productType")),a.productNameList=JSON.parse(sessionStorage.getItem("productNameList")),a.dialog=function(e,t){a.fun=e,a.dialogStyle="delete"==e?{zIndex:19891015,width:"400px",height:"170px",top:"30%",left:"50%",marginLeft:"-200px"}:{zIndex:19891015,width:"500px",maxHeight:"500px",height:"auto",top:"20%",left:"50%",marginLeft:"-200px"},"edit"==e&&(a.newForm=t,a.filters=JSON.parse(t.fmsData),a.upDown=!1),"showUser"==e&&(a.fmsData=JSON.parse(t)),"delete"==e&&(a.id=t),"add"==e&&(a.newForm={provinceId:"",provinceName:"",cityName:"",fmsData:""},a.newForm.productType="",a.newForm.productModel="",a.upDown=!0,a.filters=[{filterName:"filter1",filterFactor:""},{filterName:"filter2",filterFactor:""},{filterName:"filter3",filterFactor:""},{filterName:"filter4",filterFactor:""},{filterName:"filter5",filterFactor:""}]),$(".layui-layer-shade").show(),$(".layui-layer").show(),$(".layui-form-select .layui-input").blur(function(){a.upDown=!0,a.$apply()})},a.upDown=!0,a.filtetInit=function(){if(""==$(".productModel").val()||null==$(".productModel").val())return alert("请选择产品型号！"),!1;a.upDown=!1,a.productNameList.forEach(function(e){$(".productModel").val()==e.productModel&&(a.productKey=e.productKey)}),dataRequest("get","manage/fms/getFilter/product",{productKey:a.productKey},function(e){if(e.success){if(e.data.filterData){for(var t=[],r=0;r<e.data.filterData.length;r++){var i={};i.filterName="filter"+(r+1),i.filterFactor="",t.push(i)}a.filters=t}}else alert(e.message),a.filters=[];a.$apply()})},a.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},a.form={productType:"",productModel:""},a.init=function(e,t,r,i){dataRequest("get","manage/fms/getFMS/product",_extends({pageNum:e,pageSize:t},r),function(e){a.products=e.data,i&&pageUtils(e.total,"products",function(e){a.init(e.curr,e.limit,a.form,!1)}),a.$apply()})},a.init(1,10,a.form,!0),a.save=function(){if("add"==a.fun||"edit"==a.fun){if(""==a.newForm.productType||null==a.newForm.productType)return alert("请选择产品类型！"),!1;if(a.newForm.productModel=$(".productModel").val(),""==a.newForm.productModel||null==a.newForm.productModel)return alert("请选择产品型号！"),!1;for(var e=/^\d{1,2}$|^\d{1,2}[.]\d{1}$|(\-|\+)?\d{0.1}$|^(\-|\+)?\d{0,1}[.]\d{1}$/,t=0;t<a.filters.length;t++){if(""==a.filters[t].filterFactor||null==a.filters[t].filterFactor)return alert("请填写滤芯"+(t+1)+"系数！"),!1;if(!e.test(a.filters[t].filterFactor)||a.filters[t].filterFactor<0||25<a.filters[t].filterFactor)return alert("滤芯"+(t+1)+"请填写0~25且精确为0.1的滤芯系数！"),!1}}"add"==a.fun?(a.newForm.fmsData=JSON.stringify(a.filters),dataRequest("post","manage/fms/addFMS/product",a.newForm,function(e){e.success?(alert("新增成功！"),a.init(1,10,a.form,!0)):alert(e.message)})):"delete"==a.fun?dataRequest("post","manage/fms/delete/product/fmsData",{id:a.id},function(e){e.success?(alert("删除成功！"),a.init(1,10,a.form,!0)):alert(e.message)}):dataRequest("post","manage/fms/update/product/fmsData",{id:a.newForm.id,fmsData:JSON.stringify(a.filters)},function(e){e.success?(alert("编辑成功！"),a.init(1,10,a.form,!0)):alert(e.message)}),a.close()}}]),app.controller("regionAmendC",["$scope","$http","$location",function(a,e,t){a.productTypeList=JSON.parse(sessionStorage.getItem("productType")),dataRequest("get","common/getAreaInfo/list","",function(e){a.provinceList=e.data,a.$apply()}),a.selectCity=function(t,e){if(""!=t){if(1==e)var r=a.provinceList.filter(function(e){return e.id==t});else r=a.provinceList.filter(function(e){return e.province==t});a.cityList=r[0].citys}},a.form={provinceId:"",cityId:""},a.dialog=function(e,t){a.fun=e,a.dialogStyle="delete"==e?{zIndex:19891015,width:"400px",height:"170px",top:"30%",left:"50%",marginLeft:"-200px"}:{zIndex:19891015,width:"500px",maxHeight:"500px",height:"auto",top:"20%",left:"50%",marginLeft:"-200px"},"edit"==e&&(a.newForm=t,a.filters=JSON.parse(t.fmsData)),"showUser"==e&&(a.fmsData=JSON.parse(t)),"delete"==e&&(a.id=t),"add"==e&&(a.newForm={provinceId:"",provinceName:"",cityName:"",fmsData:""},a.filters=[{filterName:"filter1",filterFactor:""},{filterName:"filter2",filterFactor:""},{filterName:"filter3",filterFactor:""},{filterName:"filter4",filterFactor:""},{filterName:"filter5",filterFactor:""}]),$(".layui-layer-shade").show(),$(".layui-layer").show()},a.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},a.init=function(e,t,r,i){dataRequest("get","manage/fms/getFMS/area",_extends({pageNum:e,pageSize:t},r),function(e){a.regionList=e.data,i&&pageUtils(e.total,"regionList",function(e){a.init(e.curr,e.limit,a.form,!1)}),a.$apply()})},a.init(1,10,a.form,!0),a.save=function(){if("add"==a.fun||"edit"==a.fun){if(""==a.newForm.provinceName||null==a.newForm.provinceName)return alert("请选择省份！"),!1;if(""==a.newForm.cityName||null==a.newForm.cityName)return alert("请选择该省份下的市！"),!1;for(var e=/^\d{1,2}$|^\d{1,2}[.]\d{1}$|(\-|\+)?\d{0.1}$|^(\-|\+)?\d{0,1}[.]\d{1}$/,t=0;t<a.filters.length;t++){if(""==a.filters[t].filterFactor||null==a.filters[t].filterFactor)return alert("请填写滤芯"+(t+1)+"系数！"),!1;if(!e.test(a.filters[t].filterFactor)||a.filters[t].filterFactor<0||25<a.filters[t].filterFactor)return alert("滤芯"+(t+1)+"请填写0~25且精确为0.1的滤芯系数！"),!1}a.cityList.filter(function(e){e.name==a.newForm.cityName&&(a.newForm.cityId=e.id,a.newForm.provinceId=e.pId)})}"add"==a.fun?(a.newForm.fmsData=JSON.stringify(a.filters),dataRequest("post","manage/fms/addFMS/area",a.newForm,function(e){e.success?(alert("新增成功！"),a.init(1,10,a.form,!0)):alert(e.message)})):"delete"==a.fun?dataRequest("post","manage/fms/delete/area/fmsData",{id:a.id},function(e){e.success?(alert("删除成功！"),a.init(1,10,a.form,!0)):alert(e.message)}):dataRequest("post","manage/fms/update/area/fmsData",{id:a.newForm.id,fmsData:JSON.stringify(a.filters)},function(e){e.success?(alert("编辑成功！"),a.init(1,10,a.form,!0)):alert(e.message)}),a.close()}}]),app.controller("unitAmendC",["$scope","$http","$location",function(a,e,t){a.productTypeList=JSON.parse(sessionStorage.getItem("productType")),a.form={sncode:"",name:""},a.dialog=function(e,t){a.fun=e,a.dialogStyle="delete"==e?{zIndex:19891015,width:"400px",height:"170px",top:"30%",left:"50%",marginLeft:"-200px"}:{zIndex:19891015,width:"500px",maxHeight:"500px",height:"auto",top:"20%",left:"50%",marginLeft:"-200px"},"edit"==e&&(a.newForm=t,a.filters=JSON.parse(t.fmsData)),"add"==e&&(a.newForm={sncode:"",name:"",fmsData:""},a.filters=[{filterName:"filter1",filterFactor:""},{filterName:"filter2",filterFactor:""},{filterName:"filter3",filterFactor:""},{filterName:"filter4",filterFactor:""},{filterName:"filter5",filterFactor:""}]),"showUser"==e&&(a.fmsData=JSON.parse(t)),"delete"==e&&(a.id=t),$(".layui-layer-shade").show(),$(".layui-layer").show()},a.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},a.init=function(e,t,r,i){dataRequest("get","manage/fms/getFMS/device",_extends({pageNum:e,pageSize:t},r),function(e){a.dimensionList=e.data,i&&pageUtils(e.total,"dimensionList",function(e){a.init(e.curr,e.limit,a.form,!1)}),a.$apply()})},a.init(1,10,a.form,!0),a.save=function(){if("add"==a.fun||"edit"==a.fun){if(""==a.newForm.sncode||null==a.newForm.sncode)return alert("请输入设备SN码！"),!1;if(!/^\d+$/.test(a.newForm.sncode))return alert("请输入正确的设备SN码！"),!1;if(""==a.newForm.name||null==a.newForm.name)return alert("请填写分类名称！"),!1;for(var e=/^\d{1,2}$|^\d{1,2}[.]\d{1}$|(\-|\+)?\d{0.1}$|^(\-|\+)?\d{0,1}[.]\d{1}$/,t=0;t<a.filters.length;t++){if(""==a.filters[t].filterFactor||null==a.filters[t].filterFactor)return alert("请填写滤芯"+(t+1)+"系数！"),!1;if(!e.test(a.filters[t].filterFactor)||a.filters[t].filterFactor<0||25<a.filters[t].filterFactor)return alert("滤芯"+(t+1)+"请填写0~25且精确为0.1的滤芯系数！"),!1}}"add"==a.fun?(a.newForm.fmsData=JSON.stringify(a.filters),dataRequest("post","manage/fms/addFMS/device",a.newForm,function(e){e.success?(alert("新增成功！"),a.init(1,10,a.form,!0)):alert(e.message)})):"delete"==a.fun?dataRequest("post","manage/fms/delete/device/fmsData",{id:a.id},function(e){e.success?(alert("删除成功！"),a.init(1,10,a.form,!0)):alert(e.message)}):dataRequest("post","manage/fms/update/device/fmsData",{id:a.newForm.id,fmsData:JSON.stringify(a.filters)},function(e){e.success?(alert("编辑成功！"),a.init(1,10,a.form,!0)):alert(e.message)}),a.close()},a.filterNum=function(){if(""==a.newForm.sncode||null==a.newForm.sncode)return alert("请输入SN码！"),!1;dataRequest("get","manage/fms/getFilter/device",{sncode:a.newForm.sncode},function(e){if(e.success){for(var t=[],r=0;r<e.data.filterData.length;r++){var i={};i.filterName="filter"+(r+1),i.filterFactor="",t.push(i)}a.filters=t}else alert(e.message),a.filters=[];a.$apply()}),event.stopPropagation()}}]);