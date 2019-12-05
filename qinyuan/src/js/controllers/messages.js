'use strict';

//消息列表
app.controller('messagesListC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/messageRecord/deleteMessageRecord") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/messageRecord/getMessageRecordAndUserInfoList") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/messageRecord/getMessageHistoryList") {
			$scope.isList = msg.checked;
		}
	});
	$scope.isRegion = false;
	// 初始化数据
	$scope.msgInfo = {}
	$scope.filter = { // 初始化筛选数据
		pushType: '',
		msgType: ''
	}
	$scope.userFilter = {
		pushStatus: '',
		userPhone: '',
		province: '',
		city: '',
		region: ''
	}
	// 方法定义
	layui.use([
		'form', 'layedit', 'laydate'
	], function() { // 初始化日期选择控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			btns: [
				'clear', 'confirm'
			],
			range: true,
			done: function(value, date, endDate) {
				if (value < 1) {
					$scope.filter.startTime = ''
					$scope.filter.endTime = ''
				} else {
					$scope.filter.startTime = value.slice(0, 20)
					$scope.filter.endTime = value.slice(22)
				}
			}
		});
	});
	$scope.initLaypage = function(total, pageSize) { // 初始化翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'messageListPage',
				count: total,
				limit: pageSize,
				layout: [
					'count',
					'prev',
					'page',
					'next',
					'skip',
					'limit'
				],
				jump: function(obj, first) {
					$scope.pageNum = obj.curr
					$scope.pageSize = obj.limit
					if (!first) {
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit
						})
					}
				}
			});
		});
	}
	$scope.initInfoLaypage = function(total, pageSize) { // 初始化详情翻页控件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'messageListInfoPage',
				count: total,
				limit: pageSize,
				limits: [3],
				layout: [
					'count',
					'prev',
					'page',
					'next',
					'skip',
					'limit'
				],
				jump: function(obj, first) {
					if (!first) {
						$scope.getInfoListData({
							pageNum: obj.curr,
							pageSize: obj.limit
						})
					}
				}
			});
		});
	}
	$scope.getMsgType = function() { // 初始化消息类型
		dataRequest("get", apiConfig.manage_messageType_getMessageTypeList, {}, function(res) {
			$scope.msgTypeList = res.data
			$scope.$apply()
		})
	}
	$scope.getMsgType()
	$scope.dialog = function(id, fun) { // 控制弹窗
		$scope.fun = fun
		$scope.msgId = id
		if (fun == 'info') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: "900px",
				height: "520px",
				top: '10%',
				left: '50%',
				marginLeft: '-450px',
			}
			//$scope.msgInfo = id;
			$scope.messageId = id
			$scope.getInfoListData({
				pageNum: 1,
				pageSize: 3
			}, true)
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '300px',
				height: '150px',
				top: '20%',
				left: '50%',
				marginLeft: '-150px'
			}
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭弹窗
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() { // 保存表单
		$.ajax({
			type: "post",
			url: config.webAPI.address + apiConfig.manage_messageRecord_deleteMessageRecord,
			data: {
				id: $scope.msgId
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('成功！')
					$scope.close()
					$scope.getListData({
						pageNum: $scope.pageNum,
						pageSize: $scope.pageSize
					}, true)
				} else {
					alert(res.message)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageRecord_getMessageHistoryList,
			data: _extends({}, $scope.filter, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				if (first) {
					$scope.initLaypage(res.total, para.pageSize)
				}
				$scope.$apply();
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData({
		pageNum: 1,
		pageSize: 10
	}, true)
	$scope.getInfoListData = function(para, first) { // 获取详情列表数据
		if ($scope.region != '' || $scope.region != undefined) {
			$scope.userFilter.provinceId = $scope.provinceId
			$scope.userFilter.cityId = $scope.cityId
			$scope.userFilter.regionId = $scope.regionId
		} else {
			$scope.userFilter.provinceId = ''
			$scope.userFilter.cityId = ''
			$scope.userFilter.regionId = ''
		}
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageRecord_getMessageHistoryinfo,
			data: {
				id: $scope.messageId,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.msgInfo = res.data[0];
				$scope.$apply();
			},
			error: function(err) {
				console.log(err)
			}
		});
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageRecord_getMessageRecordList,
			data: _extends({
				msgId: $scope.messageId
			}, para, $scope.userFilter),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.infoListData = res.data
				for (var i in $scope.infoListData) {
					if ($scope.infoListData[i].phone != '' && $scope.infoListData[i].phone != null) {
						$scope.infoListData[i].phone = dealPhone($scope.infoListData[i].phone)
					}
				}
				if (first) {
					$scope.initInfoLaypage(res.total, para.pageSize)
				}
				$scope.$apply();
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
})

//推送规则
app.controller('pushRuleC', function($scope, $http, $location, $routeParams, $timeout) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/message/deleteMessageConfig") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/message/updateMessageConfigStatus") {
			$scope.isOn = msg.checked;
		}
		if (msg.url == "/web/api/manage/message/getMessageConfigList") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/message/saveMessageConfig") {
			$scope.isSave = msg.checked;
		}
	});
	// identifier:参数标识别
	// methodValue 比较方法
	// value 手动输入部分
	// combType 与或非
	// 数据初始化
	$scope.showEdit = false;
	$scope.addRule = true;
	$scope.dialogStyle = { // 初始化弹窗样式
		display: 'none'
	}
	$scope.btnEdit = ['layui-btn', 'layui-btn-sm', 'layui-btn-normal'] // 控制列表按钮样式
	$scope.btnDelete = ['layui-btn', 'layui-btn-sm', 'layui-btn-danger'] // 控制列表按钮样式
	$scope.btnDisable = ['layui-btn', 'layui-btn-sm', 'layui-btn-disabled'] // 控制列表按钮样式
	$scope.methodValue = ['大于', '等于', '小于', '大于等于', '小于等于'] // 推送规则属性
	$scope.combTypeValue = ['与', '或'] // 推送规则属性
	$scope.pushOtherList = {} // 其他推送方式
	$scope.pushWayList = { // 推送方式APP数据
		app: true,
		wayA: true,
		wayB: true
	}
	$scope.hou = [] // 小时
	$scope.min = [] // 分钟
	$scope.delayTime = { // 相对时间
		hou: '',
		min: ''
	}
	$scope.form = { // 初始化表单
		productKey: '', // 产品
		ownProductKey: '',
		allProductConfig: '',
		msgType: '', // 消息类型
		content: '', // 推送内容
		enable: 0, // 是否启用 1 启用 0 停用
		msgRules: [], // 消息推送规则
		pushType: '', // 推送方式  APP.消息中心：1    APP.应用推送：2     APP.消息中心+ APP.应用推送:3
		delayTime: '', // 相对时间
		thirdPartyPush: '', // 推送方式其他id 数组
		scheduled: 0
	}
	$scope.productAtt = [] // 推送属性 故障列表/产品属性列表
	$scope.filter = { // 初始化筛选
		productKey: '',
		msgType: '',
		startTime: '',
		endTime: '',
		productModel: ''
	}
	$scope.attributeShowList = [{
		type: '1',
		typeA: '1',
		typeB: '',
		typeC: '1',
		typeD: ''
	}]
	layui.use([
		'form', 'layedit', 'laydate'
	], function() { // 时间选择控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			range: true,
			done: function(value, date, endDate) {
				if (value.length < 1) {
					$scope.filter.startTime = ''
					$scope.filter.endTime = ''
				} else {
					$scope.filter.startTime = value.slice(0, 20)
					$scope.filter.endTime = value.slice(22)
				}
			}
		});
		laydate.render({
			elem: '#relative',
			type: 'time',
			done: function(value, date, endDate) {
				if (value.length < 1) {
					$scope.filter.startTime = ''
					$scope.filter.endTime = ''
				} else {
					$scope.filter.startTime = value.slice(0, 20)
					$scope.filter.endTime = value.slice(22)
				}
			}
		});
	});
	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'pushRulePage',
				count: total,
				limit: pageSize,
				layout: [
					'count',
					'prev',
					'page',
					'next',
					'skip',
					'limit'
				],
				jump: function(obj, first) {
					$scope.pageNum = obj.curr
					$scope.pageSize = obj.limit
					if (!first) {
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit
						})
					}
				}
			});
		});
	}
	$scope.getMsgType = function() { // 初始化消息类型
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageType_getMessageTypeList,
			data: {},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.msgTypeList = res.data
				$scope.$apply()
				$scope.getListData({
					pageSize: 10,
					pageNum: 1
				}, true)
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getProductList = function() { // 初始化产品类型
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.common_getProductName_list,
			data: {},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.productList = res.data
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_message_getMessageConfigList,
			data: _extends({}, para, $scope.filter),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				for (var i = 1; i <= $scope.listData.length; i++) {
					$scope.listData[i - 1].no = i
					for (var y in $scope.msgTypeList) {
						if ($scope.listData[i - 1].msgType == $scope.msgTypeList[y].id) {
							$scope.listData[i - 1].msgType = $scope.msgTypeList[y].typeName
						}
					}
				}
				$scope.total = res.total
				$scope.$apply();
				if (first) {
					$scope.initLaypage(res.total, para.pageSize)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getTimeList = function() { // 获取时间列表
		for (var i = 1; i < 25; i++) {
			$scope.hou.push(i)
		}
		for (var y = 1; y < 61; y++) {
			$scope.min.push(y)
		}
	}
	$scope.getInfoData = function(id) { // 获取推送规则详细
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_message_getMessageConfigList,
			data: _extends({}, $scope.filter, {
				pageNum: 1,
				pageSize: 10,
				id: id
			}),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.form = { // 初始化表单
					id: res.data[0].id,
					productKey: res.data[0].productKey, // 产品
					msgType: res.data[0].msgType.toString(), // 消息类型
					content: res.data[0].content, // 推送内容
					enable: res.data[0].enable, // 是否启用 1 启用 0 停用
					msgRules: [], // 消息推送规则
					pushType: res.data[0].pushType, // 推送方式  APP.消息中心：1    APP.应用推送：2     APP.消息中心+ APP.应用推送:3
					delayTime: res.data[0].delayTime, // 相对时间
					thirdPartyPush: res.data[0].thirdPartyPush, // 推送方式其他id 数组
					scheduled: res.data[0].scheduled
				}
				$scope.handleGetList()
				$scope.attributeShowList = []
				for (var i in res.data[0].msgRules) {
					var item = {
						type: res.data[0].msgRules[i].combType.toString(),
						typeA: res.data[0].msgRules[i].paramType.toString(),
						typeB: res.data[0].msgRules[i].identifier + "," + res.data[0].msgRules[i].identifierName || res.data[0].msgRules[i].errorId + "," + res.data[0].msgRules[i].identifierName,
						typeC: res.data[0].msgRules[i].method.toString(),
						typeD: res.data[0].msgRules[i].value
					}
					$scope.attributeShowList.push(item)
				}
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}

	// 数据处理方法
	$scope.resetData = function(count) { // 初始化表单
		if (count == 3) {
			return false
		}
		if (count == 1) {
			$scope.form = {
				productKey: '', // 产品
				allProductConfig: '',
				msgType: '', // 消息类型
				msgContent: '', // 推送内容
				enable: 0, // 是否启用 1 启用 0 停用
				msgRules: [], // 消息推送规则
				pushType: '', // 推送方式  APP.消息中心：1    APP.应用推送：2     APP.消息中心+ APP.应用推送:3
				delayTime: '', // 相对时间
				thirdPartyPush: '', // 推送方式其他id 数组
			}
		}
		$scope.attributeShowList = [{
			type: '1',
			typeA: '1',
			typeB: '',
			typeC: '1',
			typeD: ''
		}]
		$scope.productAtt = []
	}
	$scope.handleTips = function(e) { // 弹窗提示
		$scope.attributeShowList = [{
			typeA: e,
			typeB: '',
			typeC: '1',
			typeD: ''
		}]

		if ($scope.form.productKey == '') {
			alert('请先选择产品类型！')
			return false;
		}
	}
	$scope.handleGetList = function() { // 选择产品后 获取产品属性列表
		$scope.resetData(2);
		if ($scope.form.productKey != '') {
			$.ajax({
				type: "get",
				url: config.webAPI.address + 'manage/product/getProductPropertiesInfo',
				data: {
					productKey: $scope.form.productKey
				},
				async: true,
				dataType: 'json',
				success: function(res) {
					$scope.productAtt = res.properties;
					if ($scope.productAtt == "") {
						$scope.productAtt = [];
						res.defineProperties.propertyList.forEach(function(msg) {
							$scope.productAtt.push(msg.attr)
						})
					}
					$scope.$apply();
				},
				error: function(err) {
					console.log(err)
				}
			});
			dataRequest("get", "manage/breakdown/getBreakdownList", {}, function(res) {
				$scope.errorList = res.data.list;
				$scope.$apply();
			})
		} else {
			alert('请选择产品类型！')
		}
	}
	$scope.addPushRule = function(index) { // 添加推送规则
		if ($scope.attributeShowList[index].typeB == '') {
			alert('请先选择具体故障/属性')
			return false
		} else if ($scope.attributeShowList[index].typeD == '') {
			alert('请先输入自定义内容')
			return false
		}
		var arr = $scope.attributeShowList[0]
		$scope.attributeShowList.push({
			type: '1',
			typeA: '1',
			typeB: '',
			typeC: '1',
			typeD: ''
		})
		$scope.addRule = false;
	}
	$scope.deletePushRule = function(index) { // 删除推送规则
		$scope.attributeShowList.splice(Number(index), 1);
		if ($scope.attributeShowList.length == 1) {
			$scope.addRule = true;
		}
	}
	$scope.dialog = function(fun, id) { // 弹窗控制
		$scope.fun = fun
		if (fun == 'edit') {
			$scope.form.id = id
			$scope.dialogStyle = {
				zIndex: 19891015,
				overflow: 'auto',
				width: '940px',
				height: '480px',
				top: '70px',
				left: '50%',
				marginLeft: '-350px'
			}
			$scope.getInfoData(id)
		} else if (fun == 'add') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				overflow: 'auto',
				width: '940px',
				height: '480px',
				top: '70px',
				left: '50%',
				marginLeft: '-350px'
			}
			$scope.form.id = "";
			$scope.resetData(1);
			$scope.addRule = true;
			$scope.form.scheduled = 0;
		} else {
			$scope.form.id = id
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '300px',
				height: '150px',
				top: '150px',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		$(".layui-layer-shade").show();
		$(".rule").show();
	}
	$scope.close = function(e) { // 关闭表单
		if (e == 1) {
			$(".layui-layer-shade").hide();
			$(".rule").hide();
			$scope.resetData(1)
		} else if (e == 2) {
			$(".layui-layer-shade").hide();
			$(".productAtrr").hide();
		} else {
			$(".layui-layer-shade").hide();
			$(".layui-layer").hide();
		}
	}
	$scope.save = function() { // 保存表单
		var para = {}
		var api = ''
		if ($scope.fun == 'delete') {
			para = {
				id: $scope.form.id
			}
			api = apiConfig.manage_message_deleteMessageConfig
		} else if ($scope.fun == 'start') {
			para = {
				enable: 1,
				id: $scope.form.id
			}
			api = apiConfig.manage_message_updateMessageConfigStatus
		} else if ($scope.fun == 'stop') {
			para = {
				enable: 0,
				id: $scope.form.id
			}
			api = apiConfig.manage_message_updateMessageConfigStatus
		} else {
			$scope.beforeSubmit()
			return
		}
		$scope.submit(para, api)
	}
	$scope.beforeSubmit = function() {
		var api = apiConfig.manage_message_saveMessageConfig
		if ($scope.form.scheduled == 1) {
			$scope.form.delayTime = Number($scope.delayTime.hou) * 60 + Number($scope.delayTime.min)
		}
		if ($scope.pushWayList.wayA && $scope.pushWayList.wayB) {
			$scope.form.pushType = 3
		} else if ($scope.pushWayList.wayA && !$scope.pushWayList.wayB) {
			$scope.form.pushType = 1
		} else {
			$scope.form.pushType = 2
		}
		$scope.form.thirdPartyPush = ''
		for (var i in $scope.pushOtherList) {
			if ($scope.pushOtherList[i]) {
				$scope.form.thirdPartyPush = $scope.form.thirdPartyPush + i + ','
			}
		}
		if ($scope.form.content == '' || $scope.form.content == undefined) {
			alert('请填写具体推送内容！')
			return false
		}
		if ($scope.form.msgType == '') {
			alert('请选择消息类型！')
			return false
		}
		if ($scope.form.content.length > 100) {
			alert('您的推送内容长度大于100！')
			return false
		}
		// 处理推送规则
		$scope.form.msgRules = []
		if ($scope.attributeShowList[0].typeA == 1) {
			for (var i in $scope.attributeShowList) {
				if ($scope.attributeShowList[i].typeB == "") {
					alert('请补全推送规则第' + (
						Number(i) + 1) + '项具体故障/属性')
					return false
				} else if ($scope.attributeShowList[i].typeD == '') {
					alert('请补全推送规则第' + (
						Number(i) + 1) + '项自定义内容')
					return false
				}
				var item = {
					paramType: $scope.attributeShowList[i].typeA,
					identifier: $scope.attributeShowList[i].typeB.split(",")[0],
					method: $scope.attributeShowList[i].typeC,
					value: $scope.attributeShowList[i].typeD,
					combType: i == 0 ? '' : $scope.attributeShowList[i].type,
					identifierName: $scope.attributeShowList[i].typeB.split(",")[1]
				}
				$scope.form.msgRules.push(item)
			}
		} else {
			if ($scope.attributeShowList[0].typeB == "") {
				alert("请选择故障属性名称！")
				return false
			}
			var item = {
				paramType: $scope.attributeShowList[0].typeA,
				identifier: $scope.attributeShowList[0].typeB.split(",")[0],
				method: 2,
				value: 1,
				identifierName: $scope.attributeShowList[0].typeB.split(",")[1]
			}
			$scope.form.msgRules.push(item);
		}

		$scope.form.msgRules = JSON.stringify($scope.form.msgRules)
		$scope.submit($scope.form, api)
	} // 表单传输前数据处理
	$scope.submit = function(para, api) { // 发送表单
		if ($scope.form.productKey == 'all') {
			para.productKey = "";
			para.ownProductKey = "";
			para.allProductConfig = 1;
		} else {
			para.allProductConfig = 2;
			$scope.productList.forEach(function(msg) {
				if (msg.productKey == $scope.form.productKey) {
					para.ownProductKey = msg.ownProductKey
				}
			})
		}
		$.ajax({
			type: "post",
			url: config.webAPI.address + api,
			data: _extends({}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('成功！')
					$scope.close()
					$scope.getListData({
						pageNum: 1,
						pageSize: $scope.pageSize
					}, true)
				} else {
					alert(res.message)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 方法调用
	$scope.getMsgType()
	$scope.getProductList()
	$scope.getTimeList()

	$scope.lookRule = function() {
		if ($scope.form.productKey == '') {
			alert('请先选择产品类型！')
			return false;
		}
		$(".productAtrr").show();
		$scope.propertieInit = function(a, b, c) {
			var productAttr = [];
			for (var i = a; i < b; i++) {
				if (c[i] != undefined) {
					productAttr.push(c[i])
				}
			}
			$timeout(function() {
				$scope.properties = productAttr;
			}, 0);
		}
		$scope.propertieInit(0, 10, $scope.productAtt);
		pageUtils($scope.productAtt.length, 'productAll', function(obj) {
			$scope.propertieInit((obj.curr - 1) * obj.limit, obj.curr * obj.limit, $scope.productAtt);
		})
	}
})

//推送消息
app.controller('pushMessageC', function($scope, $http, $location, $routeParams) {
	// 初始化数据
	$scope.userList = []
	$scope.userFilter = {
		phone: "",
		nickName: "",
		loginStatus: 1,
	}
	$scope.pushObject = 0
	$scope.productList = {}
	$scope.pushWayList = {
		app: true,
		wayA: true,
		wayB: true
	}
	$scope.pushOtherList = {}
	$scope.messageForm = { //初始化数据表单
		productKey: '',
		msgType: '', // 消息类型
		msgContent: '', // 推送内容
		pushType: '', // 推送方式  APP.消息中心：1    APP.应用推送：2     APP.消息中心+ APP.应用推送:3
		// 推送对象方式一
		platformType: '', // 推送对象.用户类型  andriod  ios all
		provinceId: '', // 省市区
		cityId: '', // 省市区
		regionId: '', // 省市区
		// 推送对象方式二
		userInfo: [],
		scheduled: 0, // 发送时间  定时发送:1  立即发送：0
		scheduledTime: '', // 定是发送 时间 当前时间五分钟后的YY-MM-DD HH：MM：SS
		thirdPartyPush: '', // 推送方式其他id 数组
	}
	// 方法定义
	layui.use([
		'form', 'layedit', 'laydate'
	], function() { // 时间控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			done: function(value, date, endDate) {
				$scope.messageForm.scheduledTime = value
			}
		});
	});
	$scope.remove = function(all, index) { // 清楚用户列表
		if (all) {
			$scope.userList = []
		} else {
			$scope.userList.splice(index, Number(index) + 1)
		}
	}
	$scope.getMessageTypeList = function() { // 获取消息类型
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageType_getMessageTypeList,
			data: {
				pageNum: 1,
				pageSize: 100,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.msgTypeList = res.data
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}

	$scope.getUserList = function() { //添加用户列表
		if ($scope.userFilter.phone == "") {
			alert("请输入推送对象的手机号码进行添加！");
			return false;
		}
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_user_list,
			data: _extends({}, $scope.userFilter, {
				pageNum: 1,
				pageSize: 1
			}),
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.data.length > 0) {
					for (var i in $scope.userList) {
						if ($scope.userList[i].phone == res.data[0].phone) {
							alert('该用户已添加至推送列表！')
							return false
						}
					}
					$scope.userList.push({
						nickName: res.data[0].nickName,
						realName: res.data[0].realName,
						address: res.data[0].address,
						provinceId: res.data[0].province,
						cityId: res.data[0].city,
						regionId: res.data[0].region,
						phone: res.data[0].phone,
						id: res.data[0].id
					})
					$scope.$apply()
				} else {
					alert('该用户不在线或不存在！')
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getProductList = function() { // 产品名称列表
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.common_getProductName_list,
			data: {},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.productList = res.data
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.Verification = function() { // 表单验证
		var data = $scope.messageForm
		if (data.msgType == '') {
			alert('请选择消息类型！')
			return false
		}
		if (data.msgContent == '') {
			alert('请填写消息内容！')
			return false
		}
		if (data.msgContent.length > 500) {
			alert('消息内容过长，长度为0-500个字符！')
			return false
		}
		if ($scope.pushObject == 0) {
			if ($scope.messageForm.platformType == '') {
				alert('请选择用户类型！')
				return false
			}
			if ($scope.address == '') {
				alert('请选择推送地区！')
				return false
			}
			if ($scope.address == 'region') {
				if ($scope.region == '' || $scope.region == undefined) {
					alert('请选择希望推送的省市！')
					return false
				}
			}
		}
		if ($scope.pushObject == 1) {
			if ($scope.userList.length == 0) {
				alert('请添加您希望推送消息的用户！')
				return false
			}
		}
		if (data.scheduled == 1) {
			if (data.scheduledTime == '') {
				alert('请选择您希望推送的时间！')
				return false
			} else {
				var time = Number(new Date(data.scheduledTime))
				var now = Number(new Date())
				var min = (time - now) / 1000 / 60
				if (min < 5) {
					alert('请选择当前时间之后5分钟为发送时间！')
					return false
				}
			}
		}
		$scope.beforeSubmit()
	}
	$scope.cancel = function() { // 重置表单
		$scope.messageForm = {
			productKey: '',
			msgType: '', // 消息类型
			msgContent: '', // 推送内容
			pushType: '', // 推送方式  APP.消息中心：1    APP.应用推送：2     APP.消息中心+ APP.应用推送:3
			// 推送对象方式一
			platformType: '', // 推送对象.用户类型  andriod  ios all
			provinceId: '', // 省市区
			cityId: '', // 省市区
			regionId: '', // 省市区
			// 推送对象方式二
			userInfo: [],
			scheduled: 0, // 发送时间  定时发送:1  立即发送：0
			scheduledTime: '', // 定是发送 时间 当前时间五分钟后的YY-MM-DD HH：MM：SS
			thirdPartyPush: '', // 推送方式其他id 数组
		}
	} // 表单重置
	$scope.submit = function() { // 传输表单
		$.ajax({
			type: "post",
			url: config.webAPI.address + apiConfig.manage_messageRecord_systemMessagePush,
			data: _extends({}, $scope.messageForm),
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('消息发送成功！')
					document.location.reload()
				} else {
					alert(res.message)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.beforeSubmit = function() { // 表单验证以及数据处理
		if ($scope.pushObject == 1) {
			$scope.messageForm.userInfo = JSON.stringify($scope.userList);
		} else {
			if ($scope.address == "region") {
				$scope.messageForm.provinceId = $scope.provinceId;
				$scope.messageForm.cityId = $scope.cityId;
			} else {
				$scope.messageForm.provinceId = "";
				$scope.messageForm.cityId = "";
			}
			$scope.messageForm.userInfo = [];
		}
		if ($scope.messageForm.scheduled == 0) {
			$scope.messageForm.scheduledTime = '';
		}
		if ($scope.pushWayList.wayA && $scope.pushWayList.wayB) {
			$scope.messageForm.pushType = 3
		} else if ($scope.pushWayList.wayA && !$scope.pushWayList.wayB) {
			$scope.messageForm.pushType = 1
		} else {
			$scope.messageForm.pushType = 2
		}
		for (var i in $scope.pushOtherList) {
			if ($scope.pushOtherList[i]) {
				$scope.messageForm.thirdPartyPush = $scope.messageForm.thirdPartyPush + i + ','
			}
		}
		$scope.submit()
	}
	// 方法
	$scope.getMessageTypeList() // 初始化消息类型
	$scope.getProductList() // 获取产品类型
	$scope.checks = function() {
		if ($scope.pushWayList.app) {
			$scope.pushWayList.wayA = true;
			$scope.pushWayList.wayB = true;
		} else {
			$scope.pushWayList.wayA = false;
			$scope.pushWayList.wayB = false;
		}
	}
	$scope.checkWay = function() {
		if ($scope.pushWayList.wayA && $scope.pushWayList.wayB) {
			$scope.pushWayList.app = true;
		} else {
			$scope.pushWayList.app = false;
		}
	}
})

//推送对象
app.controller('pushObjectC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/messageSystem/deleteMessageSystem") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/message/getMessageConfigList") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/messageSystem/saveMessageSystem") {
			$scope.isSave = msg.checked;
		}
	});
	// 初始化数据
	$scope.form = { // 初始化表单
		systemName: '',
		systemUrl: ''
	}
	$scope.dialogStyle = { // 初始化弹窗样式
		display: 'none'
	}
	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 初始化翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'puObjectPage',
				count: total,
				limit: pageSize,
				layout: [
					'count',
					'prev',
					'page',
					'next',
					'skip',
					'limit'
				],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageNum = obj.curr
						$scope.pageSize = obj.limit
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit
						})
					}
				}
			});
		});
	}
	$scope.dialog = function(fun, id) { // 控制弹窗
		$scope.fun = fun
		$scope.form.id = id
		if (fun == 'edit') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '600px',
				height: '300px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
			$scope.getInfoData(id)
		} else if (fun == 'add') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '600px',
				height: '300px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '300px',
				height: '150px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
		$scope.form = {
			systemName: '',
			systemUrl: ''
		}
	}
	$scope.Verification = function() { // 表单验证
		var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
		if ($scope.fun == 'edit' || $scope.fun == 'add') {
			if ($scope.form.systemName == '') {
				alert('请输入系统名称！')
				return false
			} else if ($scope.form.systemUrl == '') {
				alert('请输入系统链接！')
				return false
			} else if (!reg.test($scope.form.systemUrl)) {
				alert('请输入正确的系统链接！')
				return false
			}
			if ($scope.form.systemName.length > 32) {
				alert('您的系统名称过长，请重新命名！')
				return false;
			}
		}
		$scope.save()
	}
	$scope.save = function() { // 保存表单
		var api = ''
		var para = {}
		if ($scope.fun == 'delete') {
			api = apiConfig.manage_messageSystem_deleteMessageSystem
			para = {
				id: $scope.form.id
			}
		} else if ($scope.fun == 'add') {
			api = apiConfig.manage_messageSystem_saveMessageSystem
			para = {
				systemName: $scope.form.systemName,
				systemUrl: $scope.form.systemUrl
			}
		} else {
			api = apiConfig.manage_messageSystem_saveMessageSystem
			para = {
				id: $scope.form.id,
				systemName: $scope.form.systemName,
				systemUrl: $scope.form.systemUrl
			}
		}
		$scope.submit(api, para)
	}
	$scope.submit = function(api, para) { // 传输表单
		$.ajax({
			type: "post",
			url: config.webAPI.address + api,
			data: _extends({}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('成功！')
					$scope.close()
					$scope.getListData({
						pageNum: $scope.pageNum,
						pageSize: $scope.pageSize
					}, true)
				} else {
					alert(res.message)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getInfoData = function(id) { // 获取详细数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageSystem_getMessageSystemList,
			data: {
				id: id
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.form = res.data[0]
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageSystem_getMessageSystemList,
			data: _extends({}, $scope.filter, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				for (var i = 1; i <= $scope.listData.length; i++) {
					$scope.listData[i - 1].no = i
				}
				$scope.$apply()
				if (first) {
					$scope.initLaypage(res.total, para.pageSize)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 调用方法
	$scope.getListData({
		pageNum: 1,
		pageSize: 10
	}, true)
})

//消息设置
app.controller('setUpC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/messageType/deleteMessageType") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/messageType/getMessageTypeList") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/messageType/saveMessageType") {
			$scope.isSave = msg.checked;
		}
	});
	// 初始化数据
	$scope.form = {
		typeName: '',
		description: ''
	}
	$scope.dialogStyle = { // 初始化弹窗样式
		display: 'none'
	}
	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 初始化翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'setUpAPage',
				count: total,
				limit: pageSize,
				layout: [
					'count',
					'prev',
					'page',
					'next',
					'skip',
					'limit'
				],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageSize = obj.limit
						$scope.pageNum = obj.curr
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit
						})
					}
				}
			});
			laypage.render({
				elem: 'setUpBPage',
				count: $scope.total,
				layout: [
					'count',
					'prev',
					'page',
					'next',
					'skip',
					'limit'
				],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageNum = obj.curr
						$scope.pageSize = obj.limit
						$scope.getListData(obj.curr, obj.limit)
					}
				}
			});
		});
	}
	$scope.getInfoData = function() { // 获取详细信息
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageType_getMessageTypeList,
			data: {
				id: $scope.form.id
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.form = res.data[0]
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.dialog = function(fun, id) { // 弹窗控制
		$scope.form.id = id
		$scope.fun = fun
		if (fun == 'edit') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '600px',
				height: '300px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
			$scope.getInfoData()
		} else if (fun == 'add') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '600px',
				height: '300px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '300px',
				height: '150px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
		$scope.form = {
			typeName: '',
			description: ''
		}
	}
	$scope.Verification = function() { // 表单验证
		if ($scope.fun == 'edit' || $scope.fun == 'add') {
			if ($scope.form.typeName == '') {
				alert('请输入名称！')
				return false
			} else if ($scope.form.description == '' || $scope.form.description.length > 512) {
				alert('请输入长度不超过512的文本描述！')
				return false
			}
		}
		$scope.save()
	}
	$scope.save = function() { // 保存表单
		var api = ''
		var para = ''
		if ($scope.fun == 'add') {
			{
				api = apiConfig.manage_messageType_saveMessageType
				para = {
					typeName: $scope.form.typeName,
					description: $scope.form.description
				}
			}
		} else if ($scope.fun == 'edit') {
			api = apiConfig.manage_messageType_saveMessageType
			para = {
				id: $scope.form.id,
				typeName: $scope.form.typeName,
				description: $scope.form.description
			}
		} else {
			api = apiConfig.manage_messageType_deleteMessageType
			para = {
				id: $scope.form.id
			}
		}
		$scope.submit(api, para)
	}
	$scope.submit = function(api, para) { // 表单传输
		$.ajax({
			type: "post",
			url: config.webAPI.address + api,
			data: _extends({}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('删除成功！')
					$scope.close()
					$scope.getListData({
						pageNum: $scope.pageNum,
						pageSize: 10
					}, false)
				} else {
					alert(res.message)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_messageType_getMessageTypeList,
			data: _extends({}, $scope.filter, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				for (var i = 1; i <= $scope.listData.length; i++) {
					$scope.listData[i - 1].no = i
				}
				$scope.total = res.total
				$scope.$apply();
				if (first) {
					$scope.initLaypage(res.total, para.pageSize)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 调用方法
	$scope.getListData({
		pageNum: 1,
		pageSize: 10
	}, true)
})