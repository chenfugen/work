'use strict';

//故障日志
app.controller('faultLogC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdown/deleteHistoryDeviceError") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/getBreakdownRecordList") {
			$scope.isDetail = msg.checked;
		}
	});
	$scope.rankList = [9, 8, 7, 6, 5, 4, 3, 2, 1]
	// 跳转
	$scope.goDetail = function(id, deviceId) {
		$location.path("/faultLogDetails/" + id + "/" + deviceId);
	}
	$scope.filter = {
		startTime: '',
		endTime: '',
		errorName: '',
		rank: '',
		errorCode: '',
		productModel: '',
		identityId: "",
		snCode: ""
	}
	$scope.deviceInfo = {}
	$scope.errorInfo = {}
	// 定义方法
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化日期选择控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#datessss',
			type: 'datetime',
			btns: ['clear', 'confirm'],
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
	$scope.initLayui = function(total, pageSize) { // 翻页控制
		layui.use('laypage', function() {
			$scope.pageSize = 20
			var laypage = layui.laypage;
			laypage.render({
				elem: 'faultLogPage',
				count: total,
				limits: [10, 20, 30, 40, 50, 60, 70, 80, 90],
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					$scope.pageSize = obj.limit
					$scope.pageNum = obj.curr
					if (!first) {
						$scope.getListData({
							pageSize: obj.limit,
							pageNum: obj.curr,
						})
					}
				}
			});
		});
	}
	$scope.dialog = function(id) { // 弹窗控制
		$scope.deleteId = id
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() { // 保存表单
		$.ajax({
			type: "post",
			url: config.webAPI.address + apiConfig.manage_breakdown_deleteHistoryDeviceError,
			data: {
				id: $scope.deleteId
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('删除成功！')
					$scope.getListData({
						pageNum: 1,
						pageSize: 10,
					}, true)
				} else {
					alert(res.message)
				}
				$scope.close()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		if ($scope.filter.startTime == '') {
			$scope.filter.endTime = ''
		}
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_breakdown_getBreakdownRecordList,
			data: _extends({}, para, $scope.filter),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				$scope.$apply();
				if (first) {
					$scope.initLayui(res.total, para.pageSize)
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
		pageSize: 10,
	}, true)
})

//故障日志详情
app.controller('faultLogDetailsC', function($scope, $http, $location, $routeParams) {
	// 初始化变量
	$scope.id = $routeParams.id;
	$scope.deviceId = $routeParams.deviceId;
	$scope.getInfoData = function(para, first) { // 获取详细信息
		dataRequest("get", apiConfig.manage_breakdowns_getBreakdownAndDealInfo, {
			"errorId": $scope.id,
			"deviceId": $scope.deviceId
		}, function(res) {
			$scope.faultInfo = res.data;
		})
		dataRequest("get", "manage/breakdown/getBreakdownList", {
			errorId: $scope.id,
		}, function(res) {
			$scope.faultInfos = res.data.list[0];
		})
		dataRequest("get", apiConfig.manage_device_detail, {
			id: $scope.deviceId,
		}, function(res) {
			$scope.deviceDetail = res.data.deviceDetail;
			$scope.filter = res.data.filter;
			$scope.$apply()
		})
	}

	// 方法调用
	$scope.getInfoData()
})

//管理日志
app.controller('administratorsLogC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/log/water/list") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/log/detail") {
			$scope.isDetail = msg.checked;
		}
	});
	$scope.filter = {
		accountName: '',
		startTime: '',
		endTime: '',
		role: '',
		object: '',
	}
	$scope.infoData = {}
	// 定义方法
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化日期选择控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			btns: ['clear', 'confirm'],
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
	$scope.initLayui = function(total, pageSize) { // 翻页控制
		layui.use('laypage', function() {
			$scope.pageSize = 20
			var laypage = layui.laypage;
			laypage.render({
				elem: 'adminLogListPage',
				count: total,
				limits: [10, 20, 30, 40, 50, 60, 70, 80, 90],
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					$scope.pageSize = obj.limit
					$scope.pageNum = obj.curr
					if (!first) {
						$scope.getListData({
							pageSize: obj.limit,
							pageNum: obj.curr,
						})
					}
				}
			});
		});
	}
	$scope.dialog = function(id) { // 弹窗控制
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_log_detail,
			data: {
				id: id,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.infoData = res.data
				$scope.$apply()
				$(".layui-layer-shade").show();
				$(".layui-layer").show();
			},
			error: function(err) {
				console.log(err)
			}
		});

	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() { // 开启表单
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_log_list,
			data: _extends({}, para, $scope.filter),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				$scope.$apply();
				if (first) {
					$scope.initLayui(res.total, para.pageSize)
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
		pageSize: 10,
	}, true)
})

//用水日志
app.controller('waterIntakeLogC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/log/water/list") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/log/water/detail") {
			$scope.isDetail = msg.checked;
		}
	});
	//获取产品列表
	$scope.productList = JSON.parse(sessionStorage.getItem("productNameList"));
	//获取取水日志列表
	$scope.init = function(a, b, c, d, e, f, g, h, i, j, k, o, p) {
		dataRequest("get", "manage/log/water/list", {
			"productKey": a,
			"macAddress": b,
			"startTime": c,
			"endTime": d,
			"pageNum": e,
			"pageSize": f,
			"id": h,
			"quantity": i,
			"temperature": j,
			"productModel": k,
			"sncode": o,
			"deviceName": p
		}, function(msg) {
			$scope.waterList = msg.data;
			if (msg.date) {
				$scope.id = (msg.data)[9].id;
			}
			$scope.$apply();
			if (g) {
				pageUtils(msg.total, 'waterAll', function(obj) {
					$scope.init($scope.productKey, $scope.macAddress, $scope.startTime, $scope.endTime, obj.curr, obj.limit, false, $scope.id, $scope.quantity, $scope.temperature, $scope.productModel, $scope.sncode, $scope.deviceName);
				});
			}
		})
	}
	//获取取水日志详情
	$scope.waterDetails = function(a, b, c) {
		dataRequest("get", "manage/log/water/detail", {
			"productKey": a,
			"deviceName": b,
			"id": c
		}, function(msg) {
			$scope.waterDetail = msg.data;
			$scope.$apply();
		})
	}

	//查看详情
	$scope.close = function() {
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.lookDetail = function(item) {
		$(".layui-layer-shade").show();
		$(".detail").show();
		$scope.waterMsg = item;
		$scope.waterDetails($scope.productKey, item.deviceName, item.id);
	}
	layui.use(['form', 'layedit', 'laydate'], function() {
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;

		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			range: true,
			done: function(value) {
				$scope.startTime = value.slice(0, 20)
				$scope.endTime = value.slice(22)
			}
		});
		laydate.render({
			elem: '#date1',
			type: 'datetime',
			range: true,
			done: function(value) {
				$scope.startTime = value.slice(0, 20)
				$scope.endTime = value.slice(22)
			}
		});
	});
	//查询
	$scope.searchs = function() {
		if ($scope.productKey == undefined) {
			alert("请选择产品名称！")
			return false;
		}
		if ($scope.startTime == "" || $scope.startTime == undefined) {
			alert("请选择取水日期！")
			return false;
		}
		$scope.init($scope.productKey, $scope.macAddress, $scope.startTime, $scope.endTime, 1, 10, true, "", $scope.quantity, $scope.temperature, $scope.productModel, $scope.sncode, $scope.deviceName);
		$scope.productList.forEach(function(msg) {
			if (msg.productKey == $scope.productKey) {
				$scope.productName = msg.productName;
			}
		})
		$scope.close();
	}

	//查询
	$scope.search = function() {
		$scope.productList.forEach(function(msg) {
			if (msg.productName == $scope.productName) {
				$scope.productKey = msg.productKey;
			}
		})
		if ($scope.productKey == undefined || $scope.productKey == "") {
			$scope.init($scope.key, "", $scope.startTime, $scope.endTime, 1, 10, true, "", $scope.quantity, $scope.temperature, $scope.productModel, $scope.sncode, $scope.deviceName);
		} else {
			$scope.init($scope.productKey, $scope.macAddress, $scope.startTime, $scope.endTime, 1, 10, true, "", $scope.quantity, $scope.temperature, $scope.productModel, $scope.sncode, $scope.deviceName);
		}

	}
})

//用户日志
app.controller('userLogC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/log/app/detail") {
			$scope.isDetail = msg.checked;
		}
	});
	$scope.rankList = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	$scope.filter = {
		startTime: '',
		endTime: '',
		phone: ''
	}
	$scope.infoData = []
	// 方法定义
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化日期选择控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			btns: ['clear', 'confirm'],
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
	$scope.initLayui = function(total, pageSize) { // 翻页控制
		layui.use('laypage', function() {
			$scope.pageSize = pageSize
			$scope.total = total
			var laypage = layui.laypage;
			laypage.render({
				elem: 'userLogPage',
				count: total,
				limits: [10, 20, 30, 40, 50, 60, 70, 80, 90],
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					$scope.pageSize = obj.limit
					$scope.pageNum = obj.curr
					if (!first) {
						$scope.getListData({
							pageSize: obj.limit,
							pageNum: obj.curr,
						}, false)
					}
				}
			});
		});
	}
	$scope.dialog = function(id) { // 弹窗控制
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_log_app_detail,
			data: {
				id: id,
			},
			async: false,
			dataType: 'json',
			success: function(res) {
				$scope.infoData = res.data
				$(".layui-layer-shade").show();
				$(".layui-layer").show();
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() {} // 开启表单
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_log_app_list,
			data: _extends({}, para, $scope.filter),
			async: false,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				for (var i in $scope.listData) {
					if ($scope.listData[i].phone != null) {
						$scope.listData[i].phone = dealPhone($scope.listData[i].phone)
					}
				}
				if (first) {
					$scope.initLayui(res.total, para.pageSize)
				} else {
					$scope.$apply()
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 方法调用
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, true)
})