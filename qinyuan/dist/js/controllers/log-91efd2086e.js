"use strict";app.controller("faultLogC",["$scope","$http","$location","$rootScope",function(i,e,t,a){JSON.parse(sessionStorage.getItem("permission")).forEach(function(e){"/web/api/manage/breakdown/deleteHistoryDeviceError"==e.url&&(i.isDelete=e.checked),"/web/api/manage/breakdown/getBreakdownRecordList"==e.url&&(i.isDetail=e.checked)}),i.rankList=[9,8,7,6,5,4,3,2,1],i.goDetail=function(e,a){t.path("/faultLogDetails/"+e+"/"+a)},i.filter={startTime:"",endTime:"",errorName:"",rank:"",errorCode:"",productModel:"",identityId:"",snCode:""},i.deviceInfo={},i.errorInfo={},layui.use(["form","layedit","laydate"],function(){layui.form,layui.layer,layui.layedit;layui.laydate.render({elem:"#datessss",type:"datetime",btns:["clear","confirm"],range:!0,done:function(e,a,t){e<1?(i.filter.startTime="",i.filter.endTime=""):(i.filter.startTime=e.slice(0,20),i.filter.endTime=e.slice(22))}})}),i.initLayui=function(e,a){layui.use("laypage",function(){i.pageSize=20,layui.laypage.render({elem:"faultLogPage",count:e,limits:[10,20,30,40,50,60,70,80,90],limit:a,layout:["count","prev","page","next","skip","limit"],jump:function(e,a){i.pageSize=e.limit,i.pageNum=e.curr,a||i.getListData({pageSize:e.limit,pageNum:e.curr})}})})},i.dialog=function(e){i.deleteId=e,$(".layui-layer-shade").show(),$(".layui-layer").show()},i.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},i.save=function(){$.ajax({type:"post",url:config.webAPI.address+apiConfig.manage_breakdown_deleteHistoryDeviceError,data:{id:i.deleteId},async:!0,dataType:"json",success:function(e){e.success?(alert("删除成功！"),i.getListData({pageNum:1,pageSize:10},!0)):alert(e.message),i.close()},error:function(e){console.log(e)}})},i.getListData=function(a,t){""==i.filter.startTime&&(i.filter.endTime=""),$.ajax({type:"get",url:config.webAPI.address+apiConfig.manage_breakdown_getBreakdownRecordList,data:_extends({},a,i.filter),async:!0,dataType:"json",success:function(e){i.listData=e.data,i.$apply(),t&&i.initLayui(e.total,a.pageSize)},error:function(e){console.log(e)}})},i.getListData({pageNum:1,pageSize:10},!0)}]),app.controller("faultLogDetailsC",["$scope","$http","$location","$routeParams",function(t,e,a,i){t.id=i.id,t.deviceId=i.deviceId,t.getInfoData=function(e,a){dataRequest("get",apiConfig.manage_breakdowns_getBreakdownAndDealInfo,{errorId:t.id,deviceId:t.deviceId},function(e){t.faultInfo=e.data}),dataRequest("get","manage/breakdown/getBreakdownList",{errorId:t.id},function(e){t.faultInfos=e.data.list[0]}),dataRequest("get",apiConfig.manage_device_detail,{id:t.deviceId},function(e){t.deviceDetail=e.data.deviceDetail,t.filter=e.data.filter,t.$apply()})},t.getInfoData()}]),app.controller("administratorsLogC",["$scope","$http","$location","$rootScope",function(i,e,a,t){JSON.parse(sessionStorage.getItem("permission")).forEach(function(e){"/web/api/manage/log/water/list"==e.url&&(i.isList=e.checked),"/web/api/manage/log/detail"==e.url&&(i.isDetail=e.checked)}),i.filter={accountName:"",startTime:"",endTime:"",role:"",object:""},i.infoData={},layui.use(["form","layedit","laydate"],function(){layui.form,layui.layer,layui.layedit;layui.laydate.render({elem:"#date",type:"datetime",btns:["clear","confirm"],range:!0,done:function(e,a,t){e<1?(i.filter.startTime="",i.filter.endTime=""):(i.filter.startTime=e.slice(0,20),i.filter.endTime=e.slice(22))}})}),i.initLayui=function(e,a){layui.use("laypage",function(){i.pageSize=20,layui.laypage.render({elem:"adminLogListPage",count:e,limits:[10,20,30,40,50,60,70,80,90],limit:a,layout:["count","prev","page","next","skip","limit"],jump:function(e,a){i.pageSize=e.limit,i.pageNum=e.curr,a||i.getListData({pageSize:e.limit,pageNum:e.curr})}})})},i.dialog=function(e){$.ajax({type:"get",url:config.webAPI.address+apiConfig.manage_log_detail,data:{id:e},async:!0,dataType:"json",success:function(e){i.infoData=e.data,i.$apply(),$(".layui-layer-shade").show(),$(".layui-layer").show()},error:function(e){console.log(e)}})},i.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},i.save=function(){},i.getListData=function(a,t){$.ajax({type:"get",url:config.webAPI.address+apiConfig.manage_log_list,data:_extends({},a,i.filter),async:!0,dataType:"json",success:function(e){i.listData=e.data,i.$apply(),t&&i.initLayui(e.total,a.pageSize)},error:function(e){console.log(e)}})},i.getListData({pageNum:1,pageSize:10},!0)}]),app.controller("waterIntakeLogC",["$scope","$http","$location","$rootScope",function(g,e,a,t){JSON.parse(sessionStorage.getItem("permission")).forEach(function(e){"/web/api/manage/log/water/list"==e.url&&(g.isList=e.checked),"/web/api/manage/log/water/detail"==e.url&&(g.isDetail=e.checked)}),g.productList=JSON.parse(sessionStorage.getItem("productNameList")),g.init=function(e,a,t,i,o,n,r,l,s,d,c,u,p){dataRequest("get","manage/log/water/list",{productKey:e,macAddress:a,startTime:t,endTime:i,pageNum:o,pageSize:n,id:l,quantity:s,temperature:d,productModel:c,sncode:u,deviceName:p},function(e){g.waterList=e.data,e.date&&(g.id=e.data[9].id),g.$apply(),r&&pageUtils(e.total,"waterAll",function(e){g.init(g.productKey,g.macAddress,g.startTime,g.endTime,e.curr,e.limit,!1,g.id,g.quantity,g.temperature,g.productModel,g.sncode,g.deviceName)})})},g.waterDetails=function(e,a,t){dataRequest("get","manage/log/water/detail",{productKey:e,deviceName:a,id:t},function(e){g.waterDetail=e.data,g.$apply()})},g.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},g.lookDetail=function(e){$(".layui-layer-shade").show(),$(".detail").show(),g.waterMsg=e,g.waterDetails(g.productKey,e.deviceName,e.id)},layui.use(["form","layedit","laydate"],function(){layui.form,layui.layer,layui.layedit;var e=layui.laydate;e.render({elem:"#date",type:"datetime",range:!0,done:function(e){g.startTime=e.slice(0,20),g.endTime=e.slice(22)}}),e.render({elem:"#date1",type:"datetime",range:!0,done:function(e){g.startTime=e.slice(0,20),g.endTime=e.slice(22)}})}),g.searchs=function(){return null==g.productKey?(alert("请选择产品名称！"),!1):""==g.startTime||null==g.startTime?(alert("请选择取水日期！"),!1):(g.init(g.productKey,g.macAddress,g.startTime,g.endTime,1,10,!0,"",g.quantity,g.temperature,g.productModel,g.sncode,g.deviceName),g.productList.forEach(function(e){e.productKey==g.productKey&&(g.productName=e.productName)}),void g.close())},g.search=function(){g.productList.forEach(function(e){e.productName==g.productName&&(g.productKey=e.productKey)}),null==g.productKey||""==g.productKey?g.init(g.key,"",g.startTime,g.endTime,1,10,!0,"",g.quantity,g.temperature,g.productModel,g.sncode,g.deviceName):g.init(g.productKey,g.macAddress,g.startTime,g.endTime,1,10,!0,"",g.quantity,g.temperature,g.productModel,g.sncode,g.deviceName)}}]),app.controller("userLogC",["$scope","$http","$location","$rootScope",function(o,e,a,t){JSON.parse(sessionStorage.getItem("permission")).forEach(function(e){"/web/api/manage/log/app/detail"==e.url&&(o.isDetail=e.checked)}),o.rankList=[1,2,3,4,5,6,7,8,9],o.filter={startTime:"",endTime:"",phone:""},o.infoData=[],layui.use(["form","layedit","laydate"],function(){layui.form,layui.layer,layui.layedit;layui.laydate.render({elem:"#date",type:"datetime",btns:["clear","confirm"],range:!0,done:function(e,a,t){e<1?(o.filter.startTime="",o.filter.endTime=""):(o.filter.startTime=e.slice(0,20),o.filter.endTime=e.slice(22))}})}),o.initLayui=function(e,a){layui.use("laypage",function(){o.pageSize=a,o.total=e,layui.laypage.render({elem:"userLogPage",count:e,limits:[10,20,30,40,50,60,70,80,90],limit:a,layout:["count","prev","page","next","skip","limit"],jump:function(e,a){o.pageSize=e.limit,o.pageNum=e.curr,a||o.getListData({pageSize:e.limit,pageNum:e.curr},!1)}})})},o.dialog=function(e){$.ajax({type:"get",url:config.webAPI.address+apiConfig.manage_log_app_detail,data:{id:e},async:!1,dataType:"json",success:function(e){o.infoData=e.data,$(".layui-layer-shade").show(),$(".layui-layer").show()},error:function(e){console.log(e)}})},o.close=function(){$(".layui-layer-shade").hide(),$(".layui-layer").hide()},o.save=function(){},o.getListData=function(t,i){$.ajax({type:"get",url:config.webAPI.address+apiConfig.manage_log_app_list,data:_extends({},t,o.filter),async:!1,dataType:"json",success:function(e){for(var a in o.listData=e.data,o.listData)null!=o.listData[a].phone&&(o.listData[a].phone=dealPhone(o.listData[a].phone));i?o.initLayui(e.total,t.pageSize):o.$apply()},error:function(e){console.log(e)}})},o.getListData({pageNum:1,pageSize:10},!0)}]);