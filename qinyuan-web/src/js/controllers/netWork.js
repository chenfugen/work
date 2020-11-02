'use strict';
// 物联卡信息
app.controller('cardManageC', function($scope, $http, $location) {
	$scope.tableSwitch = 'a'
	$scope.flowPool = {}
	$scope.timer = null
	$scope.showProgress = false
	$scope.dialogExportVisiable = false
	$scope.forbiddenForm = {}
	$scope.showActList = false
	$scope.packageList = []
	$scope.dialogStyle = {
		zIndex: 19891015,
		width: '400px',
		height: '170px',
		top: '30%',
		left: '50%',
		marginLeft: '-200px',
	}
	$scope.dialogVisiable = false
	$scope.dialogInfoVisiable = false
	$scope.simInfo = {}
	$scope.cardStatusList = [{
		value: '00',
		label: '正常'
	}, {
		value: '01',
		label: '单项停机'
	}, {
		value: '02',
		label: '停机'
	}, {
		value: '03',
		label: '预销号'
	}, {
		value: '04',
		label: '销号'
	}, {
		value: '05',
		label: '过户'
	}, {
		value: '06',
		label: '休眠'
	}, {
		value: '07',
		label: '待激活'
	}, {
		value: '99',
		label: '号码不存在'
	}]
	$scope.cardLifeCycleList = [{
		value: '正式期',
		label: '正式期'
	}, {
		value: '测试期',
		label: '测试期'
	}, {
		value: '沉默期',
		label: '沉默期'
	}, {
		value: '其他',
		label: '其他'
	}]
	// 获取产品类型
	$scope.productList = JSON.parse(sessionStorage.getItem("productNameList"));

	// 获取产品型号
	dataRequest("get", apiConfig.manage_product_list, _extends({
		pageNum: 1,
		pageSize: 1000,
		netType: 'NET_GPRS'
	}), function(msg) {
		$scope.productList = msg.data
		$scope.$apply();
	})

	// 修改表格数据顺序
	$scope.handleOrderTableList = function() {
		var flag = $scope.form.orderBy
		$scope.form.orderBy = flag == 1 ? '-1' : 1
		$scope.handleSearch()
	}
	$scope.handleOrderOnline = function() {
		var flag = $scope.form.onlineOrderBy
		$scope.form.onlineOrderBy = flag == 1 ? '-1' : 1
		$scope.handleSearch()
	}
	// 获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	// 获取物联网卡套餐列表
	$scope.getGPRSPackageList = function() {
		dataRequest("get", apiConfig.manage_v2_simCard_getPackageList, "", function(msg) {
			$scope.packageList = msg.data
			$scope.$apply();
		})
	}
	// 初始化表单
	$scope.form = {
		orderBy: 1,
		onlineOrderBy: 1,
		cardStatus: "", // 卡状态
		productKey: "",
		productType: "",
		mealName: "",
		iccid: "",
		identityId: "",
		snCode: "",
		year: '',
		month: '',
		surpass: '', // 超出流量
		unusedMonths: '', // 未使用月数
		lifeCycle: '', // 生命周期
	};
	// 初始化表格
	$scope.init = function(pageNum, pageSize, para, flag) {
		dataRequest("get", apiConfig.manage_v2_simCard_getSimCardList, _extends({
			pageNum: pageNum,
			pageSize: pageSize,
		}, para), function(msg) {
			$scope.CardList = msg.data;
			if (flag) {
				pageUtils(msg.total, "CardList", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	// 控制弹窗
	$scope.dialog = function(row) {
		$scope.dialogStyle = {
			zIndex: 19891015,
			width: '400px',
			height: '170px',
			top: '30%',
			left: '50%',
			marginLeft: '-200px'
		}
		$(".layui-layer-shade").show();
		$scope.forbiddenForm = row
		$scope.dialogVisiable = true
	}
	$scope.close = function() {
		$(".layui-layer-shade").hide();
		$scope.dialogVisiable = false
		$scope.dialogExportVisiable = false
		$scope.dialogInfoVisiable = false
	}
	// 导出
	$scope.handleExport = function() {
		$scope.dialogStyle = {
			zIndex: 19891015,
			width: '450px',
			height: '170px',
			top: '30%',
			left: '50%',
			marginLeft: '-200px'
		}
		$(".layui-layer-shade").show();
		$scope.dialogExportVisiable = true
	}
	// 后台开始导出
	$scope.handleExportStart = function(para) {
		dataRequest("get", apiConfig.manage_exportSim, para, function(msg) {
			$scope.showProgress = true
			$scope.handleWatchProgress(msg.message)
			$scope.close()
			$scope.$apply();
		})
	}
	// 监测后台数据导出进度
	$scope.handleWatchProgress = function(id) {
		$scope.timer = setInterval(function() {
			dataRequest("get", apiConfig.manage_progress, {
				processId: id
			}, function(msg) {
				$scope.handleSetProgress(msg.data)
				console.log(msg.data);
				$scope.$apply();
			})
		}, 5000)
	}
	// 详情
	$scope.handleInfo = function(data) {
		dataRequest("get", apiConfig.manage_v2_simCard_getSimCardInfo, {
			iccid: data.iccid
		}, function(msg) {
			$scope.simInfo = msg.data
			$scope.$apply();
		})
		if (data.deviceId) {
			dataRequest("get", apiConfig.manage_device_detail, {
				id: data.deviceId
			}, function(msg) {
				$scope.deviceInfo = msg.data
				$scope.$apply();
			})
		}
		dataRequest("get", apiConfig.manage_v2_simCard_getPackageInfo, {
			iccid: data.iccid
		}, function(msg) {
			$scope.packageInfo = msg.data.result[0].prodinfos
			$scope.$apply();
		})
		dataRequest("get", apiConfig.manage_v2_simCard_getSimCardRecentFlowCount, {
			iccid: data.iccid
		}, function(msg) {
			$scope.flowInfo = msg.data
			var list = []
			for (var i in $scope.flowInfo) {
				list.push({
					month: i.split((new Date()).getFullYear())[1],
					flow: $scope.flowInfo[i]
				})
			}
			$scope.flowInfo = list.reverse()
			$scope.$apply();
		})
		$(".layui-layer-shade").show();
		$scope.dialogInfoVisiable = true
		$scope.dialogStyle = {
			zIndex: 19891015,
			width: '80%',
			top: '10%',
			left: '15%',
		}
	}
	// 复机停机
	$scope.handleStopReply = function(flag) {
		var api = ''
		if ($scope.forbiddenForm.cardStatus == '00') {
			api = apiConfig.manage_v2_simCard_closeSim
		} else {
			api = apiConfig.manage_v2_simCard_openSim
		}
		var para = {
			msisdn: $scope.forbiddenForm.msisdn
		}
		dataRequest("post", api, para, function(msg) {
			alert(msg.message)
			$scope.init(1, 10, $scope.form, true);
			$scope.close()
			$scope.$apply();
		})
	}
	// 获取流量池详情
	$scope.getSimPoolInfo = function() {
		dataRequest("get", apiConfig.manage_v2_simCard_getGroupFlowPool, "", function(msg) {
			$scope.flowPool = msg.data
			$scope.$apply();
		})
	}
	// 刷新后台流量
	$scope.handleRefreshFlowData = function() {
		alert('后台数据量较大，该操作可能需要花费较长时间。响应超时请刷新页面。')
		dataRequest("post", apiConfig.manage_v2_simCard_refresh, "", function(msg) {
			$scope.init(1, 10, $scope.form, true);
			$scope.getSimPoolInfo()
			$scope.getGPRSPackageList()
			$scope.$apply();
		})
	}
	// 搜索
	$scope.handleSearch = function(flag) {
		console.log($scope.form)
		if ($scope.form.unusedMonths === undefined || $scope.form.surpass === undefined) {
			alert('查询条件输入有误，请重新输入')
			// 初始化表单
			$scope.form.unusedMonths = 0
			$scope.form.surpass = 0
			return false
		}
		if ($scope.tableSwitch == 'a') {
			if ((($scope.form.year != '' || $scope.form.year === undefined) && $scope.form.surpass === '') || ($scope.form.year == '' && $scope.form.surpass != '')) {
				alert('筛选超流量数据请填写完整时间与流量数')
				return false
			} else {
				if (flag) {
					$scope.handleExportStart($scope.form)
				} else {
					$scope.init(1, 10, $scope.form, true);
				}
			}
		} else {
			if (flag) {
				$scope.handleExportStart($scope.form)
			} else {
				$scope.init(1, 10, $scope.form, true);
			}
		}
	}
	// 更新进度条
	$scope.handleSetProgress = function(data) {
		var percent = data.progress * 100
		layui.use('element', function() {
			var element = layui.element;
			element.progress('demo', percent + '%')
		})
		console.log(percent);
		if (percent == 100) {
			$scope.showProgress = false
			clearInterval($scope.timer)
			window.open(apiConfig.getFilesAfterDelete + '?id=' + data.downloadUrl)
		}
	}
	// 初始化tab选项卡
	layui.use('element', function() {
		var element = layui.element;
		element.on('tab(cardManageTab)', function(data) {
			if (data.index == 1) {
				$scope.tableSwitch = 'b'
				$scope.CardList = []
			} else {
				$scope.tableSwitch = 'a'
				$scope.init(1, 10, $scope.form, true)
			}
			$scope.form = {
				orderBy: 1,
				cardStatus: "", // 卡状态
				productType: "",
				productKey: "",
				mealName: "",
				iccid: "",
				identityId: "",
				snCode: "",
				year: '',
				month: '',
				surpass: '', // 超出流量
				unusedMonths: '', // 未使用月数
				lifeCycle: '', // 生命周期
			};
			$scope.$apply()
		});
	});
	// 初始化时间控件
	var dateRangeY = new Date().getFullYear()
	var dateRangeM = new Date().getMonth() + 1
	var dateRangeD = new Date().getDate()
	var maxDate = dateRangeY + '-' + dateRangeM + '-' + dateRangeD
	dateRangeY--
	var minDate = dateRangeY + '-' + dateRangeM + '-' + dateRangeD
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		//执行一个laydate实例
		laydate.render({
			elem: '#networkDate', //指定元素
			type: 'month',
			min: minDate,
			max: maxDate,
			done: function(value, date) {
				$scope.form.year = date.year
				$scope.form.month = date.month
			}
		});
	});
	// 初始化表格数据
	$scope.init(1, 10, $scope.form, true);
	$scope.getSimPoolInfo()
	$scope.getGPRSPackageList()
})

// 操作历史
app.controller('statisticsC', function($scope, $http, $location) {
	$scope.tableSwitch = 'a'
	$scope.showActList = false
	$scope.cardStatusList = [{
		value: '00',
		label: '正常'
	}, {
		value: '01',
		label: '单项停机'
	}, {
		value: '02',
		label: '停机'
	}, {
		value: '03',
		label: '预销号'
	}, {
		value: '04',
		label: '销号'
	}, {
		value: '05',
		label: '过户'
	}, {
		value: '06',
		label: '休眠'
	}, {
		value: '07',
		label: '待激活'
	}, {
		value: '99',
		label: '号码不存在'
	}]
	// 获取产品型号
	dataRequest("get", apiConfig.manage_product_list, _extends({
		pageNum: 1,
		pageSize: 1000,
		netType: 'NET_GPRS'
	}), function(msg) {
		$scope.productList = msg.data
		$scope.$apply();
	})
	// 获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	// 初始化表单
	$scope.form = {
		cardStatus: "",
		productKey: "",
		productType: "",
		iccid: "",
		identityId: "",
		snCode: "",
	};
	// 搜索
	$scope.handleSearch = function() {
		$scope.init(1, 10, $scope.form, true);
	}
	// 详情
	$scope.handleInfo = function(data) {
		dataRequest("get", apiConfig.manage_v2_simCard_getSimCardInfo, {
			iccid: data.iccid
		}, function(msg) {
			$scope.simInfo = msg.data
			$scope.$apply();
		})
		if (data.deviceId) {
			dataRequest("get", apiConfig.manage_device_detail, {
				id: data.deviceId
			}, function(msg) {
				$scope.deviceInfo = msg.data
				$scope.$apply();
			})
		}
		dataRequest("get", apiConfig.manage_v2_simCard_getPackageInfo, {
			iccid: data.iccid
		}, function(msg) {
			$scope.packageInfo = msg.data.result[0].prodinfos
			$scope.$apply();
		})
		dataRequest("get", apiConfig.manage_v2_simCard_getSimCardRecentFlowCount, {
			iccid: data.iccid
		}, function(msg) {
			$scope.flowInfo = msg.data
			var list = []
			for (var i in $scope.flowInfo) {
				list.push({
					month: i.split((new Date()).getFullYear())[1],
					flow: $scope.flowInfo[i]
				})
			}
			$scope.flowInfo = list.reverse()
			$scope.$apply();
		})
		$(".layui-layer-shade").show();
		$scope.dialogInfoVisiable = true
		$scope.dialogStyle = {
			zIndex: 19891015,
			width: '80%',
			top: '10%',
			left: '15%',
		}
	}
	// 关闭表格
	$scope.close = function() {
		$(".layui-layer-shade").hide();
		$scope.dialogVisiable = false
		$scope.dialogInfoVisiable = false
	}
	// 初始化表格
	$scope.init = function(pageNum, pageSize, filterForm, flag) {
		dataRequest("get", apiConfig.manage_simOperateRecord_getSimOperateRecordList, _extends({
			pageNum: pageNum,
			pageSize: pageSize,
		}, filterForm), function(msg) {
			$scope.CardList = msg.data;
			if (flag) {
				pageUtils(msg.total, "CardList", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	// 初始化表格数据
	$scope.init(1, 10, $scope.form, true);

})