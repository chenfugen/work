'use strict';
//设备列表
app.controller('deviceListC', function($scope, $timeout, $http, $location, $rootScope) {
	//权限处理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/device/detail") {
			$scope.isDetail = msg.checked;
		}
	});
	var subscribe = ''
	var query = ''
	//获取产品列表
	// 初始化时间控件
	$scope.initDateComponent = function() {
		var datessss = document.getElementById("datessss");
		datessss.value = ""
		layui.use(['form', 'layedit', 'laydate'], function() { // 时间选择控件
			var form = layui.form,
				layer = layui.layer,
				layedit = layui.layedit,
				laydate = layui.laydate;
			//日期
			laydate.render({
				elem: '#datessss',
				type: 'datetime',
				format: 'yyyy-MM-dd HH:mm:ss',
				trigger: 'click', //采用click弹出
				range: true,
				isInitValue: false,
				done: function(value, date, endDate) {
					if (value.length < 1) {
						$scope.leaseTime.startTime = '';
						$scope.leaseTime.endTime = '';
					} else {
						$scope.leaseTime.startTime = date.year + '-' + date.month + '-' + date.date + ' ' + date.hours + ':' + date.minutes + ':' + date.seconds;
						$scope.leaseTime.endTime = endDate.year + '-' + endDate.month + '-' + endDate.date + ' ' + endDate.hours + ':' + endDate.minutes + ':' + endDate.seconds;;
					}
				}
			});
		});
	}
	$scope.initDateComponent()
	$scope.productNameList = JSON.parse(sessionStorage.getItem("productNameList"));
	//获取设备列表
	$scope.init = function(a, b, c, d, e, f, g, h, j, i, k, o, p) {
		dataRequest("GET", apiConfig.manage_device_list, {
			"pageNum": a,
			"pageSize": b,
			"deviceName": c,
			"status": d,
			"provinceId": e,
			"cityId": f,
			"filterStatus": g,
			"errorStatus": h,
			"productModel": j,
			"mac": k,
			"sncode": o,
			"leaseType": p,
		}, function(msg) {
			$scope.devices = msg.data;
			$scope.$apply();
			if (i) {
				pageUtils(msg.total, 'productAll', function(obj) {
					$scope.unfold = -1;
					$scope.init(obj.curr, obj.limit, $scope.name, $scope.status, $scope.provinceId, $scope.cityId, $scope.filterStatus, $scope.errorStatus, $scope.productModel, false, $scope.mac, $scope.sncode, $scope.leaseType);
				});
			}
		})
	}
	$scope.init(1, 10, "", "", "", "", "", "", "", true, $scope.mac, $scope.sncode, $scope.leaseType, $scope.deviceName);
	//设备总数
	dataRequest("GET", apiConfig.manage_device_deviceCount, {
		"pageNum": 1,
		"pageSize": 10,
	}, function(msg) {
		$scope.deviceNum = msg.data;
		$scope.$apply();
	})
	$scope.goDetail = function(id) {
		clearInterval(IntervalName);
		$location.path("/deviceDetail/" + id);
	}
	$scope.searchDevice = function() {
		if ($scope.region == "" || $scope.region == undefined) {
			$scope.provinceId = undefined;
			$scope.cityId = undefined;
		}
		$scope.init(1, 10, $scope.deviceName, $scope.status, $scope.provinceId, $scope.cityId, $scope.filterStatus, $scope.errorStatus, $scope.productModel, true, $scope.mac, $scope.sncode, $scope.leaseType);
	}

	var ws, IntervalName, powerSwitch, lockSwitch, waterType, tempSwitch, ChildLock, wsDomain, wsPort;
	// 获取当前域名地址
	var domain = document.location.origin.split('//')[1]
	if (domain.indexOf(":") != -1) {
		domain = domain.split(':')[0]
	}
	switch (domain) {
		case 'iot2.qinyuan.cn':
			domain = 'iot2-webview.qinyuan.cn'
			wsPort = '18907'
			break;
		case 'qinyuan-slb.yunext.com':
			wsPort = '18094'
			break;
		default:
			domain = 'qinyuan-test.yunext.com'
			wsPort = '18094'
	}
	// 'wss://iot2-webview.qinyuan.cn:18907/ws', // 沁园正式服务器websorket服务
	// 'wss://qinyuan-slb-h5.yunext.com:18094/ws', // 沁园测试服务器websorket服务
	// 'wss://qinyuan-test-h5.yunext.com:18094/ws', // 海大测试服websorket服务
	var IntervalName = null
	// 页面离开前清除定时器
	$scope.$on("$destroy", function() {
		$scope.handleDealHb(0)
	})
	// 发送心跳
	$scope.handleDealHb = function(flag) {
		if (flag == 1) {
			IntervalName = setInterval(function() { //保持心跳
				var data = {
					"v": 1,
					"cmd": "hb"
				}
				ws.send(JSON.stringify(data));
			}, 40000);
		} else {
			clearInterval(IntervalName);
		}
	}
	// 创建websorket连接
	$scope.websorket = function() {
		ws = new WebSocket("wss://" + domain + ":" + wsPort + "/ws");
		ws.onopen = function(evt) { //建立连接
			var data = {
				"version": 1,
				"cmd": "connect",
				"token": getCookie('token')
			}
			ws.send(JSON.stringify(data))
		};
		ws.onmessage = function(evt) { //接收消息
			var event = JSON.parse(evt.data);
			if (event.cmd == "connect") {
				$scope.handleDealHb(1)
			}
			if (event.cmd == "subscribe" && subscribe == 1) {
				var data = {
					"version": 1,
					"cmd": "service",
					"productId": $scope.productKey,
					"moduleId": $scope.deviceName,
					"method": "query"
				}
				ws.send(JSON.stringify(data));
				alert('正在尝试与该设备' + $scope.deviceName + '连接，请等待。')
				query = 1
			}
			if (event.cmd == "deviceInfo") {
				var num = 0
				for (var i in event.data) {
					num++
				}
				if (num > 2 && query == 1) {
					$scope.deviceInfo = event.data;
					query = 0
					alert('已经与该设备' + $scope.deviceName + '建立连接，可开始控制。')
				}
				var len = Object.getOwnPropertyNames(event.data).length
				for (var i in event.data) {
					$scope.deviceInfo[i].value = event.data[i].value
				}
				if (len < 3) {
					if (event.data.PowerSwitch && event.data.PowerSwitch.value == 1) {
						alert('设备' + event.moduleId + "已开机")
					}
					if (event.data.PowerSwitch && event.data.PowerSwitch.value == 0) {
						alert('设备' + event.moduleId + "已关机");
					}
					if (event.data.LockSwitch) {
						alert('设备' + event.moduleId + "已解锁");
					}
					if (event.data.GetWaterType) {
						alert('设备' + event.moduleId + "出水方式已修改");
					}
					if (event.data.HeatWaterTempSwitch) {
						alert('设备' + event.moduleId + '制热温度已经修改');
					}
					if (event.data.HeatingSwitch) {
						alert('设备' + event.moduleId + "开始加热");
					}
					if (event.data.HeatingSwitch) {
						alert('设备' + event.moduleId + '已停止加热');
					}
					if (event.data.RefrigerationSwitch) {
						alert('设备' + event.moduleId + "操作成功");
					}
					if (event.data.RefrigerationSwitch) {
						alert('设备' + event.moduleId + "已关闭制冷");
					}
					if (event.data.ChildLockSwitch && event.data.ChildLockSwitch.value == 1) {
						alert('设备' + event.moduleId + "已开启童锁");
					}
					if (event.data.ChildLockSwitch && event.data.ChildLockSwitch.value == 0) {
						alert('设备' + event.moduleId + "已关闭童锁");
					}
				}
				if (event.data.online) {
					$(".layui-layer-shade").hide();
					$(".heating").hide();
					if (event.data.online.value) {
						alert('设备' + event.moduleId + "上线");
					} else {
						alert('设备' + event.moduleId + "下线");
					}
				}
				$scope.$apply();
			}
		};
		ws.onerror = function(evt) { //连接错误提示
			console.log(evt);
		}
		ws.onclose = function(evt) { //连接关闭
			console.log("Connection closed.");
		};
		ws.addEventListener("close", function(event) { //监听
			var code = event.code;
			var reason = event.reason;
			var wasClean = event.wasClean;
			// handle close event
		});
	}
	$scope.unfold = -1;
	//
	$scope.onOff = function(e, deviceName, productKey, netType) {
		$scope.productKey = productKey;
		$scope.deviceName = deviceName;
		var msg = {
			"version": 1,
			"cmd": "subscribe",
			"flag": "on",
			"productId": productKey,
			"moduleId": deviceName,
		}
		var re = -1;
		if ($scope.unfold == re) {
			$scope.unfold = e;
			if (netType == 'NET_GPRS') {
				if (ws.readyState == 1) {
					ws.send(JSON.stringify(msg));
					subscribe = 1
				} else {
					alert('WS未连接成功，请刷新页面重试。')
				}
			}
		} else {
			$scope.unfold = -1;
			if (netType == 'NET_GPRS') {
				var msg = {
					"version": 1,
					"cmd": "subscribe",
					"flag": "off",
					"productId": $scope.productKey,
					"moduleId": $scope.deviceName,
				}
				ws.send(JSON.stringify(msg));
			}
			subscribe = 0
		}
	}
	$scope.websorket();
	$scope.selectSwitch = function() {
		if ($scope.oprateWay == 1) {
			$scope.numList = [0];
		} else {
			$scope.numList = [40, 50, 60, 70, 80, 90, 100];
		}
	}
	$scope.getLeaseInfo = function(id) {
		dataRequest("GET", apiConfig.manage_deviceLease_getDeviceLeaseInfo, {
			deviceId: id,
		}, function(res) {
			if (res.data) {
				$scope.leaseHisTime.startTime = res.data.leaseStartTime
				$scope.leaseHisTime.endTime = res.data.leaseEndTime
			} else {
				$scope.leaseHisTime.startTime = '--'
				$scope.leaseHisTime.endTime = '--'
			}
			$scope.$apply();
		})
	}
	$scope.leaseTime = {
		startTime: "",
		endTime: ""
	}
	$scope.leaseHisTime = {
		startTime: '',
		endTime: ''
	}
	$scope.handleClearError = function(device) {
		$scope.dialogStyle = {
			zIndex: 19891015,
			width: '400px',
			height: '150px',
			top: '20%',
			left: '50%',
			marginLeft: '-250px'
		}
		$scope.fun = 'clear'
		// 蒙层
		$(".layui-layer-shade").show();
		// 弹窗
		$(".func").show();
		// 请求
		var api = device.netType == "NET_GPRS" ? apiConfig.manage_device_cleanIOTDeviceError : apiConfig.manage_device_cleanIlopDeviceError,
			para = {
				deviceId: device.deviceId
			}
		// 关闭表单
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".layui-layer").hide();
		}
		$scope.save = function() {
			dataRequest("post", api, para, function(res) {
				if (res.success) {
					alert("清除指令已下发，请稍后刷新数据。");
				} else {
					alert(res.message);
				}
				$scope.init(1, 10, "", "", "", "", "", "", "", true, $scope.mac, $scope.sncode, $scope.leaseType, $scope.deviceName);
				$scope.$apply()
			})
			$scope.close();
		}
	}
	$scope.dialog = function(fun, device) {
		if (device.resource != 2 && device.netType != "NET_GPRS") {
			alert("该操作只针对2G设备");
			return false;
		}
		if (fun == 'on' || fun == 'WaterType' || fun == 'heat') {
			if (device.status == "离线") {
				alert("该设备离线中，无法进行操作!");
				return false;
			}
		}
		//$scope.getMsg(device.deviceId);
		$scope.fun = fun;
		$scope.deviceName = device.deviceName;
		$scope.productKey = device.productKey;
		powerSwitch = lockSwitch = waterType = tempSwitch = ChildLock = -1;
		if (fun == 'on' || fun == 'unlink' || fun == 'lift' || fun == 'lift') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '180px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		// 出水方式，温控
		else if (fun == 'WaterType' || fun == 'heat') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '300px',
				top: '20%',
				left: '50%',
				marginLeft: '-250px'
			}
		}
		// 解锁
		else if (fun == 'unlock') {
			$scope.initDateComponent()
			$scope.getLeaseInfo(device.deviceId)
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '550px',
				height: '280px',
				top: '20%',
				left: '50%',
				marginLeft: '-270px'
			}
		}
		// 更新租期状态
		else if (fun == 'updateLease') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '240px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '320px',
				top: '20%',
				left: '50%',
				marginLeft: '-250px'
			}
		}
		// 蒙层
		$(".layui-layer-shade").show();
		// 弹窗
		$(".func").show();
		// 关闭表单
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".layui-layer").hide();
		}
		//提交表单
		$scope.save = function() {
			var data = {
				"version": 1,
				"cmd": "control",
				"productId": $scope.productKey,
				"moduleId": $scope.deviceName,
				"data": {}
			};
			// 设备开关
			if (fun == "on") {
				if (query == 0) {
					data.data.PowerSwitch = $scope.deviceInfo.PowerSwitch.value == 1 ? 0 : 1;
					powerSwitch = data.data.PowerSwitch;
					ws.send(JSON.stringify(data));
					alert('控制消息已发送，请稍后')
				} else {
					alert('设备连接延迟或设备异常，请稍后再试')
				}
			}
			// 解锁/更新租期状态
			if (fun == "unlock" || fun == "updateLease") {
				if (fun == "unlock") {
					$scope.leaseStatus = "1";
					if ($scope.leaseTime.startTime == "" || $scope.leaseTime.startTime == undefined) {
						alert("请选择租赁时间!");
						return false;
					}
				} else {
					if ($scope.leaseStatus == "" || $scope.leaseStatus == undefined) {
						alert("请选择租赁状态!");
						return false;
					}
				}

				dataRequest("post", apiConfig.manage_deviceLease_saveDeviceLease, {
					"deviceId": device.deviceId,
					"leaseStartTime": $scope.leaseTime.startTime,
					"leaseEndTime": $scope.leaseTime.endTime,
					"leaseStatus": $scope.leaseStatus
				}, function(res) {
					if (res.success) {
						alert("操作成功!");
					} else {
						alert(res.message);
					}
				})
			}
			// 出水方式
			if (fun == "WaterType") {
				if ($scope.method == "" || $scope.method == undefined) {
					alert("请选择出水方式!");
					return false;
				}
				if (query == 0) {
					waterType = 1;
					data.data.GetWaterType = $scope.method - 1;
					ws.send(JSON.stringify(data));
					alert('控制消息已发送，请稍后')
				} else {
					alert('设备连接延迟或设备异常，请稍后再试')
				}
			}
			// 加热
			if (fun == "heat") {
				if ($scope.oprateWay == null) {
					alert("请选择温度操作方式!");
					return false;
				}
				if ($scope.oprateWay == 0 && $scope.temp == null && $('#HeatingSwitch em').text() == "关") {
					alert("请选择加热温度和加热状态!");
					return false;
				}
				if ($scope.oprateWay == 0 && tempSwitch == -1 && $('#HeatingSwitch em').text() == "关") {
					alert("请选择开启加热状态!");
					return false;
				}
				if ($scope.oprateWay == 1 && tempSwitch == -1 && $('#HeatingSwitch em').text() == "关") {
					alert("请选择开启制冷状态!");
					return false;
				}
				if ($('#HeatingSwitch em').text() == "开") {
					tempSwitch = 1
				} else {
					tempSwitch = 0
				}
				if ($scope.oprateWay == 0) {
					data.data.HeatingSwitch = tempSwitch;
					data.data.HeatWaterTempSwitch = parseInt($scope.temp);
				} else {
					data.data.RefrigerationSwitch = tempSwitch;
				}
				if (query == 0) {
					ws.send(JSON.stringify(data));
					alert('加热命令已发送')
				} else {
					alert('设备连接延迟或设备异常，请稍后再试')
				}
			}
			// 童锁
			if (fun == "lift") {
				if (query == 0) {
					data.data.ChildLockSwitch = $scope.deviceInfo.ChildLockSwitch.value == 1 ? 0 : 1;
					ChildLock = data.data.ChildLockSwitch;
					ws.send(JSON.stringify(data));
					alert('控制消息已发送，请稍后')
				} else {
					alert('设备连接延迟，请稍后再试')
				}
			}
			// 定时
			if (fun == "time") {
				var energySwitch;
				if ($('#timeSwitch em').text() == "开") {
					energySwitch = 1;
					if ($scope.energyTime == undefined || $scope.energyTime == "") {
						alert("请选择节能时间！");
						return false;
					}
				} else {
					energySwitch = 0;
					$scope.energyTime = 0
				}
				dataRequest("post", apiConfig.manage_deviceSaveEnergy_saveDeviceSaveEnergy, {
					"deviceId": device.deviceId,
					"minutes": 60 * parseInt($scope.energyTime),
					"energySwitch": energySwitch
				}, function(res) {
					if (res.success) {
						alert("操作成功!");
					} else {
						alert(res.message);
					}
				})
			}
			$scope.close();
		}
	}
})

//设备趋势
app.controller('deviceTrendC', function($scope, $http, $location, $rootScope) {
	//权限处理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/device/trend/deviceError/list") {
			$scope.isDeviceError = msg.checked;
		}
		if (msg.url == "/web/api/manage/device/trend/deviceCount") {
			$scope.isCount = msg.checked;
		}
	})
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	$scope.rankList = [9, 8, 7, 6, 5, 4, 3, 2, 1];
	dataRequest("get", apiConfig.common_getErrorName_list, {}, function(res) {
		$scope.errorList = res.data
		$scope.$apply($scope.errorList)
	})

	//设备趋势列表
	$scope.init = function(a, b, c, d, e, f, g, h, j, k, i) {
		dataRequest("GET", apiConfig.manage_device_trend_list, {
			"timeType": a,
			"productType": b,
			"deviceName": c,
			"time": d,
			"provinceId": e,
			"cityId": f,
			"pageSize": g,
			"pageNum": h,
			"mac": k,
			"sncode": i
		}, function(msg) {
			isRoot($scope.isDevice, "设备新增列表", function() {
				$scope.devices = msg.data;
				if (j) {
					pageUtils(msg.total, 'productAll', function(obj) {
						$scope.time = $("#test1").val();
						$scope.init(time, $scope.productName, $scope.deviceName, $scope.time, $scope.provinceId, $scope.cityId, obj.limit, obj.curr, false, $scope.mac, $scope.sncode);
					})
				}
				$scope.$apply();
			})
		})
		//设备趋势统计
		dataRequest("GET", apiConfig.manage_device_trend_deviceCount, {
			"timeType": a,
		}, function(msg) {
			isRoot($scope.isCount, "设备新增、报修新增、故障新增数据统计", function() {
				$scope.deviceCount = msg.data;
			})
			$scope.$apply();
		})
	}

	//获取故障列表
	$scope.deviceError = function(a, b, c, d, e, f, g, h, j) {
		dataRequest("GET", apiConfig.manage_breakdowns_getDeviceCurrentErrorTrent, {
			"timeType": a,
			"rank": b,
			"errorName": c,
			"time": d,
			"province": e,
			"city": f,
			"pageNum": g,
			"pageSize": h,
		}, function(msg) {
			isRoot($scope.isDeviceError, "故障新增列表", function() {
				$scope.deviceerror = msg.data;
				$scope.$apply();
				if (j) {
					pageUtils(msg.total, 'deviceAll', function(obj) {
						$scope.time = $("#date2").val();
						$scope.deviceError(time, $scope.level, $scope.errorName, $scope.time, $scope.provinceId, $scope.cityId, obj.curr, obj.limit, false);
					})
				}
			})
		})
	}
	//获取报修列表
	$scope.breakdownList = function(a, b, c, d, e, f, g, h) {
		dataRequest("GET", apiConfig.manage_breakdowns_getBreakdownDealList, {
			"timeType": a,
			"deviceName": b,
			"userPhone": c,
			"status": d,
			"time": e,
			"pageNum": f,
			"pageSize": g,
		}, function(msg) {
			$scope.breakList = msg.data;
			$scope.$apply();
			if (h) {
				pageUtils(msg.total, 'repairAll', function(obj) {
					$scope.time = $("#date1").val();
					$scope.breakdownList(time, $scope.deviceName, $scope.userPhone, $scope.status, $scope.time, obj.curr, obj.limit, false);
				})
			}
		})
	}
	//周月年选择
	var time = 1;
	$scope.times = time;
	$scope.selectTime = function(num) {
		time = num;
		$scope.init(time, $scope.productName, $scope.deviceName, $scope.time, $scope.provinceId, $scope.cityId, 10, 1, true, $scope.mac, $scope.sncode);
		$scope.deviceError(time, $scope.level, $scope.errorName, $scope.time, $scope.provinceId, $scope.cityId, 1, 10, true);
		$scope.breakdownList(time, $scope.deviceName, $scope.userPhone, $scope.status, $scope.time, 1, 10, true);
	}
	$scope.selectNav = function(num) {
		$scope.times = num;
	}
	$scope.init(time, $scope.productName, $scope.deviceName, $scope.time, $scope.provinceId, $scope.cityId, 10, 1, true, $scope.mac, $scope.sncode);
	$scope.deviceError(time, $scope.level, $scope.errorName, $scope.time, $scope.provinceId, $scope.cityId, 1, 10, true);
	$scope.breakdownList(time, $scope.deviceName, $scope.userPhone, $scope.status, $scope.time, 1, 10, true);
	//设备详情
	$scope.goDetail = function(id) {
		$location.path("/deviceDetail/" + id);
	}
	//故障详情
	$scope.goFault = function(errorID, id) {
		$location.path("/faultDetails/" + errorID + "/" + id);
	}
	$scope.isRegion = false;
	//查询
	$scope.search = function(num) {
		if ($('.cityselect').val() == "" || $('.cityselect').val() == undefined) {
			$scope.provinceId = undefined;
			$scope.cityId = undefined;
		} else {
			$scope.provinceId = $('.province').html();
			$scope.cityId = $('.city').html();
		}
		if (num == 1) {
			$scope.time = $("#test1").val();
			$scope.init(time, $scope.productName, $scope.deviceName, $scope.time, $scope.provinceId, $scope.cityId, 10, 1, true, $scope.mac, $scope.sncode);
		} else if (num == 2) {
			$scope.time = $("#date1").val();
			$scope.breakdownList(time, $scope.deviceName, $scope.userPhone, $scope.status, $scope.time, 1, 10, true);
		} else {
			$scope.time = $("#date2").val();
			$scope.deviceError(time, $scope.level, $scope.errorName, $scope.time, $scope.provinceId, $scope.cityId, 1, 10, true);
		}
	}
})

//设备地图
app.controller('deviceMapC', function($scope, $http, $location, $rootScope) {
	//获取产品名称
	$scope.productNameList = JSON.parse(sessionStorage.getItem("productNameList"));
	$scope.init = function(a, b, c, d, e, f, g, h, i, j, k) {
		dataRequest("GET", apiConfig.manage_device_list, {
			"pageNum": a,
			"pageSize": b,
			"name": c,
			"activeStatus": 1,
			"status": d,
			"provinceId": e,
			"cityId": f,
			"filterStatus": g,
			"errorStatus": h,
			"mac": j,
			"sncode": k
		}, function(msg) {
			$scope.devices = msg.data;
			if (i) {
				pageUtils(msg.total, 'productAll', function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.name, $scope.status, $scope.provinceId, $scope.cityId, $scope.filterStatus, $scope.errorStatus, false, $scope.mac, $scope.sncode);
				});
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, "", "", "", "", "", "", true, $scope.mac);
	//var lnglatXYList = [121.331679, 30.309634];
	$scope.searchs = function() {
		if ($scope.region == "" || $scope.region == undefined) {
			$scope.provinceId = undefined;
			$scope.cityId = undefined;
		}
		$scope.init(1, 10, $scope.name, $scope.status, $scope.provinceId, $scope.cityId, $scope.filterStatus, $scope.errorStatus, true, $scope.mac, $scope.sncode);
	}
	$scope.goDetail = function(id) {
		$location.path("/deviceDetail/" + id);
	}
})

//设备详情
app.controller('deviceDetailC', function($scope, $http, $location, $routeParams) {
	var map = null
	var placeSearch = null
	$scope.mapCenter = {
		center: null,
		province: null,
		city: null,
	}
	$scope.deviceMap = true
	$scope.searchKey = ''
	$scope.showSetBtn = false
	$scope.showMapSearchResult = false
	$scope.poiData = {}
	//获取设备详情
	$scope.init = function() {
		dataRequest("GET", apiConfig.manage_device_detail, {
			id: $routeParams.id,
		}, function(msg) {
			$scope.device = msg.data.deviceDetail;
			$scope.filterDetail = msg.data.filterDetail;
			$scope.filter = msg.data.filter;
			$scope.deviceSnapInfo = msg.data.deviceSnapInfo;
			$scope.deviceLeaseConfig = msg.data.deviceLeaseConfig;
			if ($scope.filter != null) {
				if ($scope.filter.filterStatus == "需要更换") {
					$('.filterStaus').css({
						"color": "#FFB800"
					});
				} else if ($scope.filter.filterStatus == "即将到期") {
					$('.filterStaus').css({
						"color": "#FF5722"
					});
				}
			}
			if (Number($scope.device.province) != 0 && Number($scope.device.province) != NaN) {
				$scope.mapCenter.province = $scope.device.province
			}
			if (Number($scope.device.city) != 0 && Number($scope.device.city) != NaN) {
				$scope.mapCenter.city = $scope.device.city
			}
			if (Number($scope.device.latitude) != 0 && Number($scope.device.latitude) != NaN) {
				$scope.mapCenter.center = [$scope.device.longitude, $scope.device.latitude]
			}
			$scope.$apply();
			$scope.initMap()
		})
		// 获取水质信息 TDS 浊度 余氯
		dataRequest("GET", apiConfig.manage_deviceProperties_getDevicePropertiesInfo, {
			deviceId: $routeParams.id,
		}, function(res) {
			$scope.filterWater = res.data;
			$scope.$apply();
		})
	}
	$scope.init();
	//获取设备头部数据
	$scope.getDeviceMsg = function() {
		dataRequest("POST", apiConfig.manage_device_getIoTDeviceLeaseAndTraffic, {
			deviceId: $routeParams.id,
		}, function(msg) {
			$scope.deviceMsg = msg.data;
			$scope.$apply();
		})
	}
	$scope.getDeviceMsg();

	//获取绑定用户
	$scope.unbindUser = function() {
		dataRequest("GET", apiConfig.manage_device_detail_bindDeviceList, {
			deviceId: $routeParams.id,
			bindType: "1"
		}, function(msg) {
			$scope.bindUsers = msg.data;
			$scope.$apply();
		})
	}
	$scope.unbindUser();
	//获取用户分享
	$scope.shareUser = function() {
		dataRequest("GET", apiConfig.manage_device_detail_shareUser_list, {
			deviceId: $routeParams.id,
		}, function(msg) {
			$scope.shareUsers = msg.data;
			$scope.$apply();
		})
	}
	$scope.shareUser();

	//获取故障报警列表
	$scope.deviceErrorList = function() {
		dataRequest("GET", apiConfig.manage_device_detail_deviceError_trend_list, {
			"deviceId": $routeParams.id,
		}, function(msg) {
			$scope.ErrorList = msg.data;
			$scope.$apply();
		})
	}
	$scope.deviceErrorList();
	//获取调试历史
	$scope.debugInt = function(a, b, c) {
		dataRequest("GET", apiConfig.manage_deviceAuth_getDeviceLeaseAuthList, {
			"deviceId": $routeParams.id,
			"pageNum": a,
			"pageSize": b
		}, function(msg) {
			$scope.debugList = msg.data;
			$scope.$apply();
			if (c) {
				pageUtils(msg.total, 'debugList', function(obj) {
					$scope.debugInt(obj.curr, obj.limit, false);
				});
			}
		})
	}
	//查看用户详情
	$scope.goDetail = function(id) {
		$location.path("/userDetails/" + id);
	}
	// 弹窗方法
	$scope.dialog = function(fun, id) {
		$scope.fun = fun
		$scope.id = id;
		if ($scope.fun == "user" || $scope.fun == "sharaUser" || fun == 'refuseCheck' || fun == 'passCheck') {
			console.log(id);
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '180px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		} else if ($scope.fun == "deBugEdit") {
			$scope.dialogStyle = {
				zIndex: 19891015,
				minWidth: '400px',
				width: "auto",
				height: '300px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
			$scope.deviceLeaseMinutes = $scope.deviceLeaseConfig.deviceLeaseMinutes.toString();
			$scope.deviceLeaseNum = $scope.deviceLeaseConfig.deviceLeaseNum;
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				minWidth: '400px',
				width: "auto",
				height: '300px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
			$scope.tds = $scope.filterWater.tds;
			$scope.ntu = $scope.filterWater.ntu;
			$scope.residualChlorine = $scope.filterWater.residualChlorine;
		}
		if ($scope.fun == "filterEdit") {
			$scope.filters = [];
			for (var i = 0; i < $scope.filterDetail.length; i++) {
				$scope.filters[i] = {};
				$scope.filters[i].filterName = $scope.filterDetail[i].name;
				$scope.filters[i].filterPercent = $scope.filterDetail[i].percent;
			}
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	// 重置调试次数
	$scope.resetDebug = function(id) {
		$scope.dialogStyle = {
			zIndex: 19891015,
			minWidth: '400px',
			width: "auto",
			height: '150px',
			top: '30%',
			left: '50%',
			marginLeft: '-200px'
		}
		$(".layui-layer-shade").show();
		$scope.dialogReset = true
	}
	// 提交重置调试请求
	$scope.submitRestDebug = function() {
		var id = $location.$$url.split('/deviceDetail/')[1]
		var api = apiConfig.manage_deviceDebug_resetDeviceLeaseDebug
		dataRequest("POST", api, {
			deviceId: id,
			productKey: $scope.device.productKey
		}, function(msg) {
			alert(msg.message)
			$scope.cancelResetDebug()
			$scope.init()
		})
	}
	// 校验滤芯百分比输入
	$scope.handleCheckFilterInput = function(index) {
		var flag = true,
			percent = $scope.filters[index].filterPercent
		if ($scope.filters[index].filterPercent > 100) {
			while (flag) {
				percent = (percent / 10).toFixed(0)
				if (percent <= 100) {
					flag = false
				}
			}
			$scope.filters[index].filterPercent = Number(percent)
		}
	}
	// 取消调试
	$scope.cancelResetDebug = function() {
		$scope.dialogReset = false
		$(".layui-layer-shade").hide();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() {
		var api;
		if ($scope.fun == "user" || $scope.fun == "sharaUser") {
			if ($scope.fun == "user") {
				api = apiConfig.manage_device_iotRemoveBindUser
			} else {
				api = apiConfig.manage_device_unbind_shareUser
			}
			dataRequest("POST", api, {
				"deviceId": $routeParams.id,
				"userId": $scope.id,
				"type": 2,
			}, function(msg) {
				if (msg.success) {
					alert("解绑成功！");
					$scope.shareUser();
					$scope.unbindUser();
				} else {
					alert(msg.message);
				}
			})
		} else if ($scope.fun == "bindUser") {
			if ($scope.userPhone == "" && $scope.userPhone.length == 11) {
				alert("请填写正确的用户手机号码！");
				return false;
			}
			dataRequest("POST", apiConfig.manage_device_iotBind, {
				"identityId": $scope.device.mac,
				"snCode": $scope.device.sncode,
				"type": 1,
				"userPhone": $scope.userPhone,
				"productKey": $scope.device.productKey
			}, function(msg) {
				if (msg.success) {
					alert("绑定成功！");
					$scope.unbindUser();
					$scope.init();
				} else {
					alert(msg.message);
				}
			})
		} else if ($scope.fun == "waterEdit") {
			if ($scope.tds != undefined) {
				var str = $scope.tds.toString()
				$scope.tds = Number(str.split('.')[0])
			}
			if ($scope.tds > 300 || $scope.tds == undefined || $scope.ntu == undefined || $scope.ntu > 2.55 || $scope.residualChlorine == undefined || $scope.residualChlorine > 2.55) {
				if ($scope.tds > 300 || $scope.tds == undefined) {
					$scope.tds = 300
				}
				if ($scope.ntu == undefined || $scope.ntu > 2.55) {
					$scope.ntu = 2.55
				}
				if ($scope.residualChlorine == undefined || $scope.residualChlorine > 2.55) {
					$scope.residualChlorine = 2.55
				}
				return alert('数据设置异常，已修正，请再次提交')
			}
			// if ($scope.tds < 0 || $scope.tds > 800 || $scope.tds == undefined) {
			// 	alert("TDS设置范围为0-800，请重新设置");
			// 	return false;
			// }
			// if ($scope.ntu < 0 || $scope.ntu > 2.55 || $scope.ntu == undefined) {
			// 	alert("浊度设置范围为0-2.55，请重新设置");
			// 	return false;
			// }
			// if ($scope.residualChlorine < 0 || $scope.residualChlorine > 2.55 || $scope.residualChlorine == undefined) {
			// 	alert("余氯设置范围为0-2.55，请重新设置");
			// 	return false;
			// }
			dataRequest("POST", apiConfig.manage_deviceProperties_saveDeviceProperties, {
				"deviceId": $routeParams.id,
				"TDS": $scope.tds,
				"NTU": $scope.ntu,
				"residualChlorine": $scope.residualChlorine,
			}, function(res) {
				if (res.success) {
					alert("编辑成功!");
					$scope.init();
				} else {
					alert(res.message);
				}
			})
		} else if ($scope.fun == "deBugEdit") {
			if ($scope.deviceLeaseMinutes == '' || $scope.deviceLeaseMinutes == undefined) {
				alert("请选择调试时间！");
				return false;
			}
			if ($scope.deviceLeaseNum == '' || $scope.deviceLeaseNum == undefined) {
				alert("请选择调试次数！");
				return false;
			}
			var reg = /^[1-9]+\d*$/;
			if (!reg.test($scope.deviceLeaseNum)) {
				alert("调试次数请填写大于零的正整数!");
				return false;
			}
			dataRequest("POST", apiConfig.manage_deviceDebug_saveDeviceLeaseDebug, {
				"deviceId": $routeParams.id,
				"leaseMinutes": $scope.deviceLeaseMinutes,
				"leaseNum": $scope.deviceLeaseNum
			}, function(res) {
				if (res.success) {
					alert("编辑成功!");
					$scope.init();
				} else {
					alert(res.message);
				}
			})
		} else if ($scope.fun == "passCheck" || $scope.fun == "refuseCheck") {
			dataRequest("POST", apiConfig.manage_deviceAuth_authDeviceLeaseDebug, {
				"deviceId": $routeParams.id,
				"id": $scope.id.id,
				"status": $scope.fun == "passCheck" ? '2' : '3',
				"productKey": $scope.device.productKey
			}, function(res) {
				if (res.success) {
					alert("操作成功!");
					$scope.debugInt(1, 10, true);
				} else {
					alert(res.message);
				}
			})
		} else {
			var reg = new RegExp("^(\\d|[1-9]\\d|100)$");
			for (var i = 0; i < $scope.filters.length; i++) {
				if ($scope.filters[i].filterPercent === "" || $scope.filters[i].filterPercent === undefined || $scope.filters[i].filterPercent === null) {
					$scope.filters[i].filterPercent = 0
				}
				if (!reg.test($scope.filters[i].filterPercent)) {
					alert("请正确填写" + $scope.filters[i].filterName + "寿命百分比_" + (i + 1) + "！")
					return false;
				}
				$scope.filterDetail[i].name = $scope.filters[i].filterName;
				$scope.filterDetail[i].percent = $scope.filters[i].filterPercent;
			}
			dataRequest("POST", "manage/device/update/filterLife", {
				deviceId: $routeParams.id,
				filterData: JSON.stringify($scope.filterDetail)
			}, function(msg) {
				if (msg.success) {
					alert("滤芯寿命修改指令已下发，请稍后刷新数据。");
					$scope.init();
				} else {
					alert(msg.message);
				}
			})
		}

		$scope.close();
	}
	// 获取当前定位
	$scope.locationNow = function() {
		map = new AMap.Map('deviceAddress', {
			resizeEnable: true,
			zoom: 10,
			expandZoomRange: true,
			zooms: [9, 20],
		});
		AMap.plugin('AMap.Geolocation', function() {
			var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：5s
				buttonPosition: 'RB', //定位按钮的停靠位置
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点

			});
			map.addControl(geolocation);
			geolocation.getCurrentPosition(function(status, result) {
				if (status == 'complete') {
					onComplete(result)
				} else {
					onError(result)
				}
			});
		});
		//解析定位结果
		function onComplete(data) {
			$scope.mapCenter.city = data.addressComponent.city
			$scope.mapCenter.province = data.addressComponent.province
			$scope.mapCenter.center = [data.position.lng, data.position.lat]
		}
		//解析定位错误信息
		function onError(data) {
			console.log('失败原因排查信息:' + data.message);
		}
	}
	// 初始化地图
	$scope.initMap = function() {
		// 若设备无经纬度信息
		if ($scope.mapCenter.center != null) {
			map = new AMap.Map("deviceAddress", {
				resizeEnable: true,
				center: $scope.mapCenter.center,
				zoom: 10,
				expandZoomRange: true,
				zooms: [9, 20],
			});
			// 创建设备在地图上的点
			if ($scope.device.longitude != '' && $scope.device.longitude != null) {
				var marker = new AMap.Marker({
					position: $scope.mapCenter.center,
					map: map,
					icon: new AMap.Icon({
						image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
					}),
					offset: new AMap.Pixel(-15, -15)
				})
				// 创建设备的标记样式
				var markerContent = document.createElement("div");
				var markerImg = document.createElement("img");
				markerImg.src = "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png";
				markerContent.appendChild(markerImg);
				var markerSpan = document.createElement("span");
				markerSpan.className = 'CenterMarker';
				markerSpan.innerHTML = "设备";
				markerContent.appendChild(markerSpan);
				marker.setContent(markerContent);
			}
		}
		// 设备不带有省市区以及经纬度信息
		else {
			$scope.locationNow()
		}
	}
	// 获取选择的城市经纬度
	$scope.handleGetlnglat = function() {
		$scope.showSetBtn = false
		var code = '',
			lng = '',
			lat = ''
		if ($scope.region) {
			if ($scope.cityId) {
				code = $scope.cityId
			} else {
				code = $scope.provinceId
			}
			var geocoder = new AMap.Geocoder({
				city: code, //城市设为北京，默认：“全国”
			});
			geocoder.getLocation($scope.region, function(status, result) {
				lng = result.geocodes[0].location.lng
				lat = result.geocodes[0].location.lat
				map.setCenter([lng, lat]);
				$scope.handleSearchLocation()
			});
		} else {
			map.setCenter($scope.mapCenter.center);
			$scope.handleSearchLocation()
		}
	}
	$scope.handleSearchLocation = function() {
		var city = ''
		if ($scope.region) {
			if ($scope.cityId) {
				city = $scope.cityId
			} else {
				city = $scope.provinceId
			}
		} else {
			city = $scope.mapCenter.city
		}
		AMap.service(["AMap.PlaceSearch"], function() {
			//构造地点查询类
			placeSearch = new AMap.PlaceSearch({
				pageSize: 5, // 单页显示结果条数
				pageIndex: 1, // 页码
				city: city, // 兴趣点城市
				citylimit: true, //是否强制限制在设置的城市内搜索
				map: map, // 展现结果的地图实例
				panel: "searchResult", // 结果列表将在此容器中进行展示。
				autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
			});
			//关键字查询
			placeSearch.search($scope.searchKey, function(val, valA) {});
			placeSearch.on('listElementClick', function(SelectChangeEvent) {
				$scope.poiData = SelectChangeEvent
				$scope.showSetBtn = true
				$scope.$apply()
			})
		});
	}
	// 搜索地图位置
	$scope.handleSetLocation = function() {
		var para = {
			deviceId: $scope.device.deviceId,
			latitude: $scope.poiData.data.location.lat,
			longitude: $scope.poiData.data.location.lng,
			province: $scope.poiData.data.pname,
			city: $scope.poiData.data.cityname,
			region: $scope.poiData.data.adname,
			address: $scope.poiData.data.address
		}
		dataRequest("POST", apiConfig.manage_device_reviseDeviceLocation, para, function(msg) {
			if (msg.success) {
				alert("设置成功！");
				map && map.destroy();
				placeSearch.clear()
				$scope.showSetBtn = false
				$scope.searchKey = ''
				$scope.$apply()
				$scope.init();
			} else {
				alert(msg.message);
			}
		})
	}
	$scope.unbind = function(a, b) {
		dataRequest("POST", apiConfig.manage_device_unbind_shareUser, {
			deviceId: a,
			userId: b
		}, function(msg) {
			if (msg.success) {
				alert("解绑成功！");
				$scope.shareUser();
			} else {
				alert(msg.message);
			}
		})
	}
	$scope.deviceMsgPart = true;
	$scope.userMsg = true;
	$scope.filterTab = true;
	$scope.waterTab = true;
	$scope.debugTab = true;
	$scope.debugHistroy = true;
	$scope.packUp = function(e) {
		// if ($(".save").eq(e).text() == "收起") {
		// 	$(".save").eq(e).text("展开");
		// } else {
		// 	$(".save").eq(e).text("收起");
		// }
		switch (e) {
			case 0:
				$scope.deviceMsgPart = !$scope.deviceMsgPart;
				break;
			case 1:
				$scope.userMsg = !$scope.userMsg;
				break;
			case 2:
				$scope.filterTab = !$scope.filterTab;
				break;
			case 3:
				$scope.waterTab = !$scope.waterTab;
				break;
			case 4:
				$scope.debugTab = !$scope.debugTab;
				break;
			case 5:
				$scope.debugHistroy = !$scope.debugHistroy;
				break;
			default:
				$scope.deviceMap = !$scope.deviceMap;
				break;
		}
	}
})

//水质地图
app.controller("deviceTdsMapC", function($scope, $http, $location, $routeParams) {
	// 定义方法
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化日期选择控件
		var laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			btns: ['clear', 'confirm'],
			range: true,
			done: function(value, date, endDate) {
				if (value < 1) {
					$scope.startTime = ''
					$scope.endTime = ''
				} else {
					$scope.startTime = value.slice(0, 20)
					$scope.endTime = value.slice(22)
				}
			}
		});
	});
	$scope.init = function(a, b, c, d, e) {
		dataRequest("get", apiConfig.manage_device_tds_map, {
			startTime: a,
			endTime: b,
			provinceId: c,
			pageNum: d,
			pageSize: e
		}, function(res) {
			dataRequest("GET", "common/getAreaInfo/list", {
				"provinceId": c,
			}, function(msg) {
				for (var i = 0; i < msg.data.length; i++) {
					for (var j = 0; j < res.data.length; j++) {
						if (msg.data[i].id == res.data[j].provinceId) {
							msg.data[i].tds = res.data[j].tds;
							msg.data[i].avg = res.data[j].avg;
						}
					}
				}
				$scope.cityList = msg.data;
				$scope.$apply();
			})
		})
	}

	$scope.init($scope.startTime, $scope.endTime, $scope.provinceId, 1, 20);
	$scope.goDetail = function(id, city) {
		sessionStorage.setItem("citys", JSON.stringify(city));
		$location.path("/deviceTdsDetail/" + id);
	}
	$scope.search = function() {
		$scope.init($scope.startTime, $scope.endTime, $scope.provinceId, 1, 20);
	}
})

//水质地图详情
app.controller("deviceTdsDetailC", function($scope, $http, $location, $routeParams) {
	// 定义方法
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化日期选择控件
		var laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#date',
			type: 'datetime',
			btns: ['clear', 'confirm'],
			range: true,
			done: function(value, date, endDate) {
				if (value < 1) {
					$scope.startTime = ''
					$scope.endTime = ''
				} else {
					$scope.startTime = value.slice(0, 20)
					$scope.endTime = value.slice(22)
				}
			}
		});
	});

	$scope.initCity = function(a, b, c, d, e, f) {
		dataRequest("get", apiConfig.manage_device_tds_map, {
			startTime: a,
			endTime: b,
			provinceId: c,
			pageNum: d,
			pageSize: e
		}, function(res) {
			for (var i = 0; i < f.length; i++) {
				for (var j = 0; j < res.data.length; j++) {
					if (f[i].id == res.data[j].cityId) {
						f[i].tds = res.data[j].tds;
						f[i].avg = res.data[j].avg;
					}
				}
			}
			$scope.cityList = f;
			$scope.$apply();

		})
	}
	$scope.initCity($scope.startTime, $scope.endTime, $routeParams.id, 1, 20, JSON.parse(sessionStorage.getItem("citys")));
	$scope.search = function() {
		$scope.initCity($scope.startTime, $scope.endTime, $routeParams.id, 1, 20, JSON.parse(sessionStorage.getItem("citys")));
	}
})