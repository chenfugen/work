'use strict';
//故障列表
app.controller('faultListC', function($scope, $timeout, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdowns/getDeviceCurrentErrorList") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/deleteDeviceError") {
			$scope.isDelete = msg.checked;
		}
	});
	// 数据初始化
	$scope.productList = JSON.parse(sessionStorage.getItem("productNameList"));
	$scope.errorList = []
	$scope.filter = { // 初始化筛选变量
		identityId: '',
		deviceName: '',
		productKey: '',
		errorCode: '',
		status: '',
		startTime: '',
		endTime: '',
		productModel: '',
		snCode: '',
	}
	// 方法定义
	layui.use(['form', 'layedit', 'laydate'], function() { // 时间选择控件
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
					$scope.filter.startTime = '';
					$scope.filter.endTime = '';
				} else {
					$scope.filter.startTime = value.slice(0, 20);
					$scope.filter.endTime = value.slice(22);
				}
			}
		});
	});
	$scope.goHistory = function() { // 前往历史记录
		$location.path("/faultLog/" + Math.random());
	}
	$scope.getErrorName = function() { // 获取故障名称
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.common_getErrorName_list,
			data: {},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.errorList = res.data;
			},
			error: function(err) {
				console.log(err);
			}
		});
	}
	$scope.initPage = function(total, pageSize) { // 初始化翻页
		$scope.total = total
		$scope.pageSize = pageSize
		// 翻页控件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'faultListPage',
				count: total,
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageNum = obj.curr;
						$scope.pageSize = obj.limit;
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit,
						})
					}
				}
			});
		});
	}
	$scope.dialog = function(Id, errorName) { // 弹窗控制
		$scope.deleteId = Id;
		$scope.deleteName = errorName;
		$(".layui-layer-shade").show();
		$(".delete").show();
	}
	$scope.close = function(msg) { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.delete = function() { // 表单保存
		$.ajax({
			type: "post",
			url: config.webAPI.address + apiConfig.manage_breakdown_deleteDeviceError,
			data: {
				id: $scope.deleteId,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					$scope.close()
					alert('删除成功！')
					$scope.getListData({
						pageNum: 1,
						pageSize: 10,
					}, true)
				} else {
					alert(res.message);
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
			url: config.webAPI.address + apiConfig.manage_breakdowns_getDeviceCurrentErrorList,
			data: _extends({}, $scope.filter, para),
			async: true,
			dataType: 'json',
			success: function success(res) {
				$scope.total = res.total;
				$scope.listData = res.data;
				for (var i in $scope.listData) {
					$scope.listData[i].no = Number(i) + 1 + (Number(para.pageNum) - 1) * 10;
					if ($scope.listData[i].phone != null) {
						$scope.listData[i].phone = dealPhone($scope.listData[i].phone);
					}
				}
				if (first) {
					$scope.initPage($scope.total, para.pageSize);
				}
				$scope.$apply();
			},
			error: function error(err) {
				console.log(err);
			}
		});
	}
	// 方法调用
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, true);

	$scope.getErrorName();
})

//故障详情
app.controller('faultDetailsC', function($scope, $http, $location, $routeParams) {
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

//故障趋势
app.controller('faultTrendC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdowns/getDeviceCurrentErrorTrent") {
			$scope.isDetail = msg.checked;
		}
	});
	// 初始化数据
	$scope.total = 0 // 数据总量
	$scope.filter = { // 初始化筛选
		timeType: 1,
	}
	$scope.count = {
		repairErrorCount: '',
		newErrorCount: ''
	}
	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'faultTrendPage',
				count: $scope.total,
				limit: Number(pageSize),
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageNum = obj.curr
						$scope.pageSize = obj.limit
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit,
						})
					}
				}
			});
		});
	}
	$scope.close = function(msg) { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}

	$scope.changeTab = function(status) { // 切换tab
		$scope.filter.status = status
		$scope.getListData({
			pageNum: 1,
			pageSize: 10,
		}, true)
	}
	$scope.changeDayTab = function(day) { // 切换天数tab
		$scope.filter.timeType = day;
		$scope.getCountByTime(day)
		$scope.getListData({
			pageNum: 1,
			pageSize: 10,
		}, true)
	}
	$scope.getCountByTime = function(num) { // 根据时间查询设备故障总数
		$.ajax({
			type: 'post',
			url: config.webAPI.address + apiConfig.manage_breakdowns_getDeviceCurrentErrorCount,
			data: {
				timeType: num
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.count = res.data;
				$scope.$apply();
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		$.ajax({
			type: 'get',
			url: config.webAPI.address + apiConfig.manage_breakdowns_getDeviceCurrentErrorTrent,
			data: _extends({}, $scope.filter, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				$scope.total = res.total
				for (var i in $scope.listData) {
					if ($scope.listData[i].phone != null) {
						$scope.listData[i].phone = dealPhone($scope.listData[i].phone)
					}
				}
				$scope.$apply()
				if (first) {
					$scope.initLaypage($scope.total, para.pageSize)
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
	$scope.getCountByTime(1)
})

//故障设置
app.controller('faultSetUpC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdown/createBreakdown") {
			$scope.isAdd = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/updateBreakdown") {
			$scope.isUpdate = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/deleteBreakdown") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/getBreakdownList") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/updatePretreatment") {
			$scope.isUpdatePretreatment = msg.checked;
		}
	});
	// 初始化数据
	$scope.rankList = [9, 8, 7, 6, 5, 4, 3, 2, 1]
	$scope.form = {
		id: '',
		errorId: '',
		rank: '',
		errorName: '',
	}
	// 初始化数据
	$scope.dialog_tips = {
		fontSize: '12px',
		color: '#999999',
	}
	$scope.dialogStyle = { // 初始化表单样式
		display: 'none',
	}
	$scope.filter = { // 初始化筛选变量
		errorName: '',
	}
	$scope.verification = function() { // 表单验证
		var regErrorName = /[\u4e00-\u9fa5]/
		var regErrorId = /^[0-9a-zA-Z]+$/
		if ((!regErrorName.test($scope.form.errorName)) || ($scope.form.errorName == '')) {
			alert('故障名称不能为空且必须为中文！')
			return false
		}
		if ((!regErrorId.test($scope.form.errorId)) || ($scope.form.errorId == '') || ($scope.form.errorId.length > 64)) {
			alert('故障ID不能为空且必须为长度64位以内大小写英文数字！')
			return false
		}
		if ((Number($scope.form.rank) > 10) || ($scope.form.rank == '')) {
			alert('故障登记不能为空且必须为长度2位纯数字！')
			return false
		}
		return true
	}
	$scope.resetForm = function() { // 重置/初始化表单
		$scope.form = { // 初始化表单数据
			errorId: '',
			rank: '1',
			errorName: '',
		}
	}
	$scope.dialog = function(fun, errorId, errorName, id) { // 弹窗控制
		$scope.deleteName = errorName
		$scope.form.errorId = errorId
		$scope.form.rank = "";
		$scope.form.id = id;
		$scope.dialogTitle = fun;
		$scope.enable = errorId;
		if ($scope.dialogTitle == 'edit' || $scope.dialogTitle == 'add') {
			if ($scope.dialogTitle == 'edit') {
				$scope.getSetUpInfo(errorId)
			}
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '500px',
				height: '350px',
				top: '20%',
				left: '50%',
				marginLeft: '-250px',
			}
		} else {
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '400px',
				height: '150px',
				top: '30%',
				left: '50%',
				marginLeft: '-150px',
			}
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
		$scope.resetForm()
	}
	$scope.save = function() { // 保存表单
		var para = {}
		var way = ''
		var api = ''
		if (($scope.dialogTitle == 'edit' || $scope.dialogTitle == 'add')) {
			if (!$scope.verification()) {
				return false
			}
		}
		if ($scope.dialogTitle == 'edit') {
			para = {
				id: $scope.form.id,
				errorId: $scope.form.errorId,
				rank: $scope.form.rank,
				errorName: $scope.form.errorName,
			}
			way = 'post'
			api = apiConfig.manage_breakdown_updateBreakdown
		}
		if ($scope.dialogTitle == 'add') {
			para = {
				errorId: $scope.form.errorId,
				rank: $scope.form.rank,
				errorName: $scope.form.errorName,
			}
			way = 'post'
			api = apiConfig.manage_breakdown_createBreakdown
		}
		if ($scope.dialogTitle == 'staus') {
			para = {
				id: $scope.form.id,
				enable: $scope.form.errorId,
			}
			way = 'post'
			api = apiConfig.manage_breakdown_forbidden
		}
		if ($scope.dialogTitle == 'delete') {
			api = apiConfig.manage_breakdown_deleteBreakdown
			way = 'post'
			para = {
				errorId: $scope.form.errorId
			}
		}
		$.ajax({
			type: way,
			url: config.webAPI.address + api,
			data: _extends({}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.close()
				if (res.success) {
					alert('成功!')
				} else {
					alert(res.message)
				}
				$scope.getListData({
					pageSize: $scope.pageSize,
					pageNum: $scope.pageNum,
				})
			},
			error: function(err) {
				return false
				console.log(err)
			}
		});
	}
	$scope.scheme = function(id) { // 跳转预处理方案
		$location.path("/faultScheme/" + id);
	}
	$scope.getListData = function(para, first) { // 获取列表信息
		$scope.pageSize = para.pageSize
		$scope.pageNum = para.pageNum
		$scope.listData = []
		$scope.total = 0
		var api = apiConfig.manage_breakdown_getBreakdownList
		var way = 'get'
		var params = _extends({
			errorName: $scope.filter.errorName,
			errorId: $scope.filter.errorId,
			rank: $scope.filter.rank
		}, para);
		$.ajax({
			type: way,
			url: config.webAPI.address + api,
			data: params,
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data.list;
				for (var i = 0; i < $scope.listData.length; i++) {
					$scope.listData[i].no = i;
					$scope.listData[i].errorId = parseInt($scope.listData[i].errorId)
				}
				$scope.total = res.data.total
				$scope.$apply();
				if (first) {
					$scope.initLaypage($scope.total, para.pageSize)
				}
			},
			error: function(err) {
				return false
				console.log(err)
			}
		});
	}
	$scope.getSetUpInfo = function(errorId) { // 获取单条详情数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_breakdown_getBreakdownList,
			data: {
				errorId: errorId,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.form = res.data.list[0]
				$scope.form.rank = $scope.form.rank.toString()
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.initLaypage = function(total, pageSize) { // 初始化翻页控件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'faultSetUpPage',
				count: total,
				limit: Number(pageSize),
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
	$scope.handleSearch = function() { // 搜索
		var para = {
			pageSize: $scope.pageSize,
			pageNum: $scope.pageNum,
		}
		$scope.getListData(para)
	}
	// 方法调用
	$scope.resetForm()
	$scope.getListData({
		pageSize: 10,
		pageNum: 1,
	}, true)
})

//预处理
app.controller('faultSchemeC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdown/updatePretreatment") {
			$scope.isUpdatePretreatment = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/createPretreatment") {
			$scope.isCreatePretreatment = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/getPretreatmentList") {
			$scope.isGetPretreatmentList = msg.checked;
		}
		if (msg.url == "/web/api/manage/breakdown/deletePretreatment") {
			$scope.isdeletePretreatment = msg.checked;
		}
	});
	// 初始化数据
	$scope.btnNormal = ['layui-btn', 'layui-btn-sm', 'layui-btn-normal']
	$scope.btnDanger = ['layui-btn', 'layui-btn-sm', 'layui-btn-danger']
	$scope.btnDisable = ['layui-btn', 'layui-btn-sm', 'layui-btn-disabled']
	$scope.productList = [] // 产品列表
	$scope.errorId = $location.$$path.slice(13) // 获取故障ID
	$scope.total = 0 // 表格数据总量
	$scope.dialogStyle = { // 初始化弹窗样式
		display: 'none',
	}
	$scope.filter = { // 初始化筛选变量
		productkey: '',
	}
	$scope.form = { // 初始化表单数据
		productKey: '',
		phoneNum: '',
		resolution: '',
		errorId: $scope.errorId,
	}
	// 方法定义
	$scope.getInfoData = function() { // 获取故障详情
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_breakdown_getBreakdownList,
			data: {
				errorId: $scope.errorId,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.infoData = {
					errorId: res.data.list[0].errorId,
					errorName: res.data.list[0].errorName,
					rank: res.data.list[0].rank,
				}
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.getProductList = function() { // 获取产品列表
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
	$scope.verification = function(form) { // 表单验
		var reg = /^400[0-9]{7}/
		if ($scope.form.productKey == '') {
			alert('产品名称为必选！')
			return false
		}
		if ($scope.form.phoneNum == '') {
			alert('请输入联系方式！')
			return false
		}
		if ($scope.form.resolution == '') {
			alert('请填写预处理方案！')
			return false
		}
		return true
	}
	$scope.initLaypage = function(total, pageSize) { // 翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'faultSchemePage',
				count: total,
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageNum = obj.curr
						$scope.pageSize = obj.limit
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit,
						})
					}
				}
			});
		});
	}
	$scope.getListData = function(para, first) { // 获取列表信息
		var api = apiConfig.manage_breakdown_getPretreatmentList
		var way = 'get'
		$.ajax({
			type: way,
			url: config.webAPI.address + api,
			data: _extends({
				errorId: $scope.errorId
			}, $scope.filter, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data.list
				$scope.total = res.data.total
				$scope.$apply();
				if (first) {
					$scope.initLaypage($scope.total, para.pageSize)
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.handleSearch = function(count) { // 查询
		var para = {
			pageNum: 1,
			pageSize: 10,
			errorId: $scope.errorId,
			productName: $scope.filter.productName,
		}
		$scope.getListData(para)
	}
	$scope.dialog = function(fun, productKey, productName, resolution) { // 弹窗控制
		$scope.productName = productName
		$scope.productKey = productKey
		$scope.dialogTitle = fun
		if (fun == 'edit') {
			$scope.getEditData({
				productKey: productKey
			})
		}
		if (fun == 'add' || fun == 'edit') {
			editor.txt.html('')
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '800px',
				height: '550px',
				top: '10%',
				left: '50%',
				marginLeft: '-400px',
			}
			$scope.id = resolution;
		} else if (fun == 'info') {
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '320px',
				backgroundImage: 'url(../../images/phone.png)',
				backgroundRepeat: 'no-repeat',
				backgroundPositionY: '15px',
				backgroundSize: '100% 100%',
				height: '550px',
				top: '51%',
				left: '50%',
				marginLeft: '-160px',
				marginTop: '-275px',
			}
			$scope.resolution = resolution
		} else {
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '300px',
				height: '150px',
				top: '20%',
				left: '50%',
				marginLeft: '-200px',
			}
			$scope.id = resolution;
		}
		$scope.form = {
			resolution: '',
			phoneNum: '',
			productKey: '',
			errorId: $scope.errorId,
		}
		// 弹窗控制
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
		// 关闭清空表单
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
		$scope.form = {
			resolution: '',
			phoneNum: '',
			productKey: '',
			errorId: $scope.errorId,
		}
	}
	$scope.save = function() { // 保存表单
		if ($scope.dialogTitle == 'add') {
			$scope.form.resolution = editor.txt.html()
			if ($scope.verification($scope.form)) {
				var api = apiConfig.manage_breakdown_createPretreatment
				var form = _extends({}, $scope.form);
				var way = 'post'
				$scope.submit(api, way, form);
			}
		} else if ($scope.dialogTitle == 'edit') {
			$scope.form.resolution = editor.txt.html()
			if ($scope.verification($scope.form)) {
				var api = apiConfig.manage_breakdown_updatePretreatment
				var form = _extends({
					id: $scope.id
				}, $scope.form)
				var way = 'post'
				$scope.submit(api, way, form)
			}
		} else if ($scope.dialogTitle == 'stop') {
			var api = apiConfig.manage_breakdown_updatePretreatment
			var form = {
				errorId: $scope.errorId,
				id: $scope.id,
				productKey: $scope.productKey,
				status: 0,
			}
			var way = 'post'
			$scope.submit(api, way, form)
		} else if ($scope.dialogTitle == 'start') {
			var api = apiConfig.manage_breakdown_updatePretreatment
			var form = {
				productKey: $scope.productKey,
				errorId: $scope.errorId,
				id: $scope.id,
				status: 1,
			}
			var way = 'post'
			$scope.submit(api, way, form)
		} else {
			var api = apiConfig.manage_breakdown_deletePretreatment
			var form = {
				productKey: $scope.productKey,
				errorId: $scope.errorId,
				id: $scope.id,
				status: 1,
			}
			var way = 'post'
			$scope.submit(api, way, form)
		}
	}
	$scope.getEditData = function(para) { // 获取单条详情数据
		var api = apiConfig.manage_breakdown_getPretreatmentList
		var way = 'get'
		$.ajax({
			type: way,
			url: config.webAPI.address + api,
			data: _extends({
				errorId: $scope.errorId
			}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.form = {
					productKey: res.data.list[0].productKey,
					phoneNum: res.data.list[0].phoneNum,
					resolution: res.data.list[0].resolution,
					errorId: $scope.errorId,
				}
				editor.txt.html(res.data.list[0].resolution)
				$scope.$apply();
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.submit = function(api, way, form) { // 发送表单
		$.ajax({
			type: way,
			url: config.webAPI.address + api,
			data: form,
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('成功!')
					$scope.getListData({
						pageNum: $scope.pageNum,
						pageSize: $scope.pageSize,
					}, false)
				} else {
					alert(res.message)
				}
				// 初始化获取表格数据
				$scope.close()
				$scope.getListData({
					pageNum: $scope.pageNum,
					pageSize: $scope.pageSize,
				}, true)
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
	$scope.getProductList()
	$scope.getInfoData()
	var E = window.wangEditor
	var editor = new E('#editor')
	editor.create()
})
//报修记录
app.controller('faultRepairC', function($scope, $http, $location, $rootScope, $routeParams) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdowns/getBreakdownDealList") {
			$scope.isList = msg.checked;
		}
	});

	dataRequest("get", "manage/customer/query/getCsmStatus", {
		"dealType": "2"
	}, function(res) {
		console.log(res);
	})
	//获取历史进度
	$scope.breakdownList = function(b, c, e, a, d, f, g, j) {
		dataRequest("GET", "manage/breakdowns/getBreakdownDealList", {
			"pageNum": b,
			"pageSize": c,
			"deviceName": a,
			"userPhone": d,
			"appealId": f,
			"reportType": g,
			"dealType": j
		}, function(msg) {
			$scope.breakList = msg.data;
			$scope.$apply();
			if (e) {
				pageUtils(msg.total, 'repairAll', function(obj) {
					$scope.breakdownList(obj.curr, obj.limit, false, $scope.deviceName, $scope.userPhone, $scope.appealId, $scope.reportType, 2);
				})
			}
		})
	}
	$scope.breakdownList(1, 10, true, $scope.deviceName, $scope.userPhone, $scope.appealId, $scope.reportType, 2);
	$scope.search = function() {
		$scope.breakdownList(1, 10, true, $scope.deviceName, $scope.userPhone, $scope.appealId, $scope.reportType, 2);
	}
})

//保养记录
app.controller('faultMaintainC', function($scope, $http, $location, $rootScope, $routeParams) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/breakdowns/getBreakdownDealList") {
			$scope.isList = msg.checked;
		}
	});

	dataRequest("get", "manage/customer/query/getCsmStatus", {
		"dealType": "3"
	}, function(res) {
		console.log(res);
	})

	//获取历史进度
	$scope.breakdownList = function(b, c, e, a, d, f, g, j) {
		dataRequest("GET", "manage/breakdowns/getBreakdownDealList", {
			"pageNum": b,
			"pageSize": c,
			"deviceName": a,
			"userPhone": d,
			"appealId": f,
			"reportType": g,
			"dealType": j
		}, function(msg) {
			$scope.breakList = msg.data;
			$scope.$apply();
			if (e) {
				pageUtils(msg.total, 'repairAll', function(obj) {
					$scope.breakdownList(obj.curr, obj.limit, false, $scope.deviceName, $scope.userPhone, $scope.appealId, $scope.reportType, 3);
				})
			}
		})
	}
	$scope.breakdownList(1, 10, true, $scope.deviceName, $scope.userPhone, $scope.appealId, $scope.reportType, 3);
	$scope.search = function() {
		$scope.breakdownList(1, 10, true, $scope.deviceName, $scope.userPhone, $scope.appealId, $scope.reportType, 3);
	}
})