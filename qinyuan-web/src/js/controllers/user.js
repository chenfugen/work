//用户列表
app.controller('userListC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/user/detail/deviceList") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/user/detail") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/user/delete") {
			$scope.isDelete = msg.checked;
		}
	})
	// 初始化数据
	$scope.pageNum = 1
	$scope.pageSize = 10
	$scope.dialogStyle = { // 初始化弹窗样式
		display: 'none'
	}
	$scope.filter = { // 初始化筛选数据
		phone: '',
		region: '',
		wechatAccount: '',
		bindStatus: '',
		sex: '',
		provinceId: '',
		cityId: '',
		regionId: '',
	}
	// 方法调用
	$scope.dialog = function(phone, id) { // 控制弹窗
		$scope.phone = phone
		$scope.userId = id
		$scope.dialogStyle = {
			zIndex: '19891015',
			width: '300px',
			height: '150px',
			top: '30%',
			left: '50%',
			marginLeft: '-150px',
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() { // 保存表单
		function feedback(res) {
			if (res.success == true) {
				alert('成功!')
				$scope.getListData({
					pageNum: $scope.pageNum,
					pageSize: $scope.pageSize,
				}, true)
			} else {
				alert(res.message)
			}
			$scope.close()
		}
		var api = apiConfig.manage_user_delete
		var method = 'post'
		var params = {
			id: $scope.userId,
		}
		libsAjax(method, api, params, feedback);
	}
	$scope.initLaypage = function(total, pageSize, pageNum) { // 翻页控件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'userListPage',
				count: Number(total),
				curr: Number(pageNum),
				limit: Number(pageSize),
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageSize = obj.limit
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit,
						})
						$scope.$apply()
					}
				}
			});
		});
	}
	$scope.goDetail = function(id) { // 获取详情
		$location.path("/userDetails/" + id);
	}
	$scope.getListData = function(para, first) { // 获取用户列表数据
		function feedback(res) {
			$scope.userList = res.data
			$scope.total = res.total
			if (first) {
				$scope.initLaypage(res.total, para.pageSize, para.pageNum)
			}
		}
		var api = apiConfig.manage_user_list
		var method = 'get'
		if ($scope.region != '' && $scope.region != undefined) {
			$scope.filter.provinceId = $scope.provinceId
			$scope.filter.cityId = $scope.cityId
			$scope.filter.regionId = $scope.regionId
		} else {
			$scope.filter.provinceId = ''
			$scope.filter.cityId = ''
			$scope.filter.regionId = ''
		}
		var params = _extends({}, para, $scope.filter);
		libsAjax(method, api, params, feedback)
	}
	// 方法调用
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, true)
});

// 用户详情
app.controller('userDetailsC', function($scope, $http, $location, $routeParams) {
	$scope.dialogStyle = {
		display: 'none',
	}
	// 初始化数据
	$scope.userId = $routeParams.id;
	// 定义方法
	$scope.initLaypage = function(total, pageSize) { // 翻页控件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'userDetailPage',
				count: total,
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageSize = obj.limit
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit,
						})
						$scope.$apply()
					}
				}
			});
		});
	}
	$scope.getUserInfo = function() { // 获取用户信息
		function feedback(res) {
			$scope.userInfo = res.data
		}
		var api = apiConfig.manage_user_detail
		var method = "get"
		var params = {
			userId: $scope.userId
		}
		libsAjax(method, api, params, feedback)
	}

	//查看设备分享用户列表
	$scope.shareUsers = function(e) {
		dataRequest("GET", "manage/device/detail/shareUser/list", {
			deviceId: e,
		}, function(msg) {
			$scope.sharelist = msg.data;
			$scope.$apply();
		})
	}
	//获取用户分享设备
	$scope.shareDevice = function() {
		dataRequest("GET", "manage/user/share/device/list", {
			userId: $scope.userId,
		}, function(msg) {
			$scope.shareUser = msg.data;
			$scope.$apply();
		})
	}
	$scope.shareDevice();
	$scope.dialog = function(fun, deviceId) { // 查看分享用户
		$scope.fun = fun
		$scope.deviceId = deviceId;
		if (fun == 'untie' || fun == 'unbind') {
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '350px',
				height: '150px',
				top: '20%',
				left: '50%',
				marginLeft: '-200px',
			}
		} else {
			$scope.dialogStyle = {
				zIndex: '19891015',
				width: '700px',
				maxHeight: '500px',
				height: 'auto',
				top: '20%',
				left: '40%',
				marginLeft: '-200px',
			}
			$scope.shareUsers($scope.deviceId);
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();

		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".layui-layer").hide();
		}
		$scope.save = function() {
			if ($scope.fun == 'untie') {
				function feedback(res) {
					if (res.success) {
						alert('解绑成功！')
						$scope.getListData({
							pageNum: 1,
							pageSize: 10,
						}, true)
						$scope.close()
					} else {
						alert(res.message)
					}
				}
				var api = apiConfig.manage_user_unbind_device;
				var method = "post"
				var params = {
					userId: $scope.userId,
					deviceId: $scope.deviceId,
				}
				libsAjax(method, api, params, feedback);
				$scope.shareDevice();
			}

			if ($scope.fun == 'unbind') {
				dataRequest("POST", "manage/device/unbind/shareUser", {
					userId: $scope.userId,
					deviceId: $scope.deviceId
				}, function(msg) {
					if (msg.success) {
						alert("解绑成功！");
						$scope.shareDevice();
					} else {
						alert(msg.message);
					}
				})
				$scope.close();
			}
		}
	}
	$scope.getListData = function(para, first) { // 获取绑定设备列表数据
		function feedback(res) {
			$scope.listData = res.data
			$scope.total = res.total
			if (first) {
				$scope.initLaypage(res.total, para.pageSize)
			}
		}
		var api = apiConfig.manage_user_detail_deviceList
		var params = _extends({
			"userId": $scope.userId
		}, para);
		var method = "get"
		libsAjax(method, api, params, feedback)
	}
	// 调用方法
	$scope.getUserInfo()
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, true)
})

// 用户趋势
app.controller('userTrendC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/user/trend/list") {
			$scope.isList = msg.checked;
		}
		if (msg.url == "/web/api/manage/user/trend/count") {
			$scope.isCount = msg.checked;
		}
	});
	// 初始化数据
	$scope.appType = ''
	$scope.days = 7
	$scope.count = {
		androidCount: '',
		iosCount: '',
		totalCount: '',
	}
	// 定义函数
	$scope.initLaypage = function(total, pageSize) { // 翻页控件
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'userTrendPage',
				count: $scope.total,
				limit: Number(pageSize),
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageSize = obj.limit
						$scope.getListData({
							pageNum: obj.curr,
							pageSize: obj.limit,
						}, $scope.days, $scope.appType, false)
						$scope.$apply()
					}
				}
			});
		});
	}
	$scope.goDetail = function(phone) { // 获取详情
		$location.path("/userDetails/" + phone);
	}
	$scope.switchTab = function(day) { // 切换数据
		$scope.days = day;
		$scope.getListData({
			pageNum: 1,
			pageSize: 10,
		}, $scope.days, $scope.appType, true)
		$scope.getTopData(day)
	}
	$scope.switchTabItem = function(appType) { // 切换数据
		$scope.appType = appType
		$scope.getListData({
			pageNum: 1,
			pageSize: 10,
		}, $scope.days, $scope.appType, true)
	}
	$scope.getListData = function(para, days, appType, first) { // 获取列表数据
		$scope.pageSize = para.pageSize
		$scope.pageNum = para.pageNum
		$scope.total = 0
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_user_trend_list,
			data: _extends({
				days: days,
				appType: appType
			}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listdata = res.data
				$scope.total = res.total
				for (var i in $scope.listdata) {
					if ($scope.listdata[i].phone != null) {
						$scope.listdata[i].phone = dealPhone($scope.listdata[i].phone)
					}
				}
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
	$scope.getTopData = function(days) { // 获取顶部展示数据
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_user_trend_count,
			data: {
				days: days,
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.count = res.data
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 调用函数
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, 7, '', true)
	$scope.getTopData(7)
});