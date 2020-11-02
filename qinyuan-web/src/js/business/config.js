//配置地址
var config = {
	webAPI: {
		//address: 'http://192.168.199.213:8080/web/api/'
		address: '/web/api/'
	},
	file: {
		imageRoot: 'https://qinyuan-slb.yunext.com/'
	},
	sms: {
		template: {
			verification: '08A74B1F-5C99-46FC-A0DD-E49919A78EA6',
			verifyCode: '7b9a2aa5-9944-48be-9602-176ed4cedc75'
		}
	},
	baidu: {
		push: {
			apiKey: 'hoq3wex5MblhGc0j48DwcMPk'
		}
	}
};
//angular路由配置
var app = angular.module('qinYuan', ['ngRoute', 'qinyuanFilters', 'qinyuanDirective', 'QYtable']).config(function() {});

//跨域配置
app.config(function($httpProvider) { // CORS post跨域配置
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.withCredentials = true;
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function(obj) { // 修改angularjs $http.post的默认传参方式
		var query = '',
			name, value, fullSubName, subName, subValue, innerObj, i;
		for (name in obj) {
			value = obj[name];
			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null)
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	};

	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

	delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

//路由配置
app.config(function($routeProvider) {
	$routeProvider
		//首页
		.when('/productList/:random', {
			navItem: 'product',
			controller: 'homeC',
			templateUrl: 'pages/product/productList.html?' + Math.random()
		})
		//自定义属性
		.when('/definedProperties/:random', {
			controller: 'addAttributeC',
			templateUrl: 'pages/product/addAttribute.html?' + Math.random()
		})
		//产品详情
		.when('/proDetail/:id', {
			controller: 'proDetailC',
			templateUrl: 'pages/product/productDetail.html?' + Math.random()
		})
		//新增产品
		.when('/productAdd/:productKey/:resource', {
			controller: 'productAddC',
			templateUrl: 'pages/product/productAdd.html?' + Math.random()
		})
		//产品编辑
		.when('/productEdit/:productKey', {
			controller: 'productEditC',
			templateUrl: 'pages/product/productEdit.html?' + Math.random()
		})

		//设备详情
		.when('/deviceDetail/:id', {
			controller: 'deviceDetailC',
			templateUrl: 'pages/device/deviceDetails.html?' + Math.random()
		})
		//设备列表
		.when('/deviceList/:random', {
			controller: 'deviceListC',
			templateUrl: 'pages/device/deviceList.html?' + Math.random()
		})
		//设备趋势
		.when('/deviceTrend/:random', {
			controller: 'deviceTrendC',
			templateUrl: 'pages/device/deviceTrend.html?' + Math.random()
		})
		//设备地图
		.when('/deviceMap/:random', {
			controller: 'deviceMapC',
			templateUrl: 'pages/device/deviceMap.html?' + Math.random()
		})
		//水质地图
		.when('/deviceTdsMap/:random', {
			controller: 'deviceTdsMapC',
			templateUrl: 'pages/device/deviceTdsMap.html?' + Math.random()
		})
		//水质地图详情
		.when('/deviceTdsDetail/:id', {
			controller: 'deviceTdsDetailC',
			templateUrl: 'pages/device/deviceTdsDetail.html?' + Math.random()
		})
		//消息列表
		.when('/messagesList/:random', {
			controller: 'messagesListC',
			templateUrl: 'pages/message/messageList.html?' + Math.random()
		})

		//推送规则
		.when('/pushRule/:random', {
			controller: 'pushRuleC',
			templateUrl: 'pages/message/pushRule.html?' + Math.random()
		})

		//推送消息
		.when('/pushMessage/:random', {
			controller: 'pushMessageC',
			templateUrl: 'pages/message/pushMessage.html?' + Math.random()
		})

		//推送对象
		.when('/pushObject/:random', {
			controller: 'pushObjectC',
			templateUrl: 'pages/message/pushObject.html?' + Math.random()
		})

		//意见反馈
		.when('/messageFeedback/:random', {
			controller: 'messageFeedbackC',
			templateUrl: 'pages/message/messageFeedback.html?' + Math.random()
		})

		//消息设置
		.when('/setUp/:random', {
			controller: 'setUpC',
			templateUrl: 'pages/message/setUp.html?' + Math.random()
		})

		//用户列表
		.when('/userList/:random', {
			controller: 'userListC',
			templateUrl: 'pages/user/userList.html?' + Math.random()
		})
		//用户趋势
		.when('/userTrend/:random', {
			controller: 'userTrendC',
			templateUrl: 'pages/user/userTrend.html?' + Math.random()
		})
		//用户详情
		.when('/userDetails/:id', {
			controller: 'userDetailsC',
			templateUrl: 'pages/user/userDetails.html?' + Math.random()
		})

		//故障日志
		.when('/faultLog/:random', {
			controller: 'faultLogC',
			templateUrl: 'pages/log/faultLog.html?' + Math.random()
		})

		//故障日志详情
		.when('/faultLogDetails/:id/:deviceId', {
			controller: 'faultLogDetailsC',
			templateUrl: 'pages/log/faultLogDetails.html?' + Math.random()
		})
		//管理日志
		.when('/administratorsLog/:random', {
			controller: 'administratorsLogC',
			templateUrl: 'pages/log/administratorsLog.html?' + Math.random()
		})
		//取水日志
		.when('/waterIntakeLog/:random', {
			controller: 'waterIntakeLogC',
			templateUrl: 'pages/log/waterIntakeLog.html?' + Math.random()
		})

		//用户日志
		.when('/userLog/:random', {
			controller: 'userLogC',
			templateUrl: 'pages/log/userLog.html?' + Math.random()
		})

		//角色管理
		.when('/roleManage/:random', {
			controller: 'roleManageC',
			templateUrl: 'pages/systemSetup/roleManage.html?' + Math.random()
		})

		//管理员
		.when('/managerList/:random', {
			controller: 'managerListC',
			templateUrl: 'pages/systemSetup/managerList.html?' + Math.random()
		})
		//管理员
		.when('/systemMaintenance/:random', {
			controller: 'systemMaintenanceC',
			templateUrl: 'pages/systemSetup/systemMaintenance.html?' + Math.random()
		})

		//管理员详情
		.when('/managerDetails/:id', {
			controller: 'managerDetailsC',
			templateUrl: 'pages/systemSetup/managerDetails.html?' + Math.random()
		})

		//广告管理
		.when('/advertManage/:random', {
			controller: 'advertManageC',
			templateUrl: 'pages/advert/advertManage.html?' + Math.random()
		})

		//故障列表
		.when('/faultList/:random', {
			controller: 'faultListC',
			templateUrl: 'pages/fault/faultList.html?' + Math.random()
		})
		//故障详情
		.when('/faultDetails/:id/:deviceId', {
			controller: 'faultDetailsC',
			templateUrl: 'pages/fault/faultDetails.html?' + Math.random()
		})
		//故障趋势
		.when('/faultTrend/:random', {
			controller: 'faultTrendC',
			templateUrl: 'pages/fault/faultTrend.html?' + Math.random()
		})
		//故障设置
		.when('/faultSetUp/:random', {
			controller: 'faultSetUpC',
			templateUrl: 'pages/fault/faultSetUp.html?' + Math.random()
		})
		//预处理
		.when('/faultScheme/:id', {
			controller: 'faultSchemeC',
			templateUrl: 'pages/fault/faultScheme.html?' + Math.random()
		})

		//报修记录
		.when('/faultRepair/:id', {
			controller: 'faultRepairC',
			templateUrl: 'pages/fault/faultRepair.html?' + Math.random()
		})
		//保养记录
		.when('/faultMaintain/:id', {
			controller: 'faultMaintainC',
			templateUrl: 'pages/fault/faultMaintain.html?' + Math.random()
		})
		//个人中心
		.when('/personal', {
			controller: 'personalC',
			templateUrl: 'pages/person/personal.html?' + Math.random()
		})

		//使用列表
		.when('/usedList/:random', {
			controller: 'usedListC',
			templateUrl: 'pages/module/usedList.html?' + Math.random()
		})
		//库存列表
		.when('/stockList/:random', {
			controller: 'stockListC',
			templateUrl: 'pages/module/stockList.html?' + Math.random()
		})
		//物联卡管理
		.when('/cardManage/:random', {
			controller: 'cardManageC',
			templateUrl: 'pages/netWordManage/cardManage.html?' + Math.random()
		})
		//物联卡详情
		.when('/cardDetails/:id', {
			controller: 'cardDetailsC',
			templateUrl: 'pages/netWordManage/cardDetails.html?' + Math.random()
		})
		//物联网卡操作历史
		.when('/simCardActHistory/:id', {
			controller: 'statisticsC',
			templateUrl: 'pages/netWordManage/simCardActHistory.html?' + Math.random()
		})
		//固件版本
		.when('/firmwareVersion/:random', {
			controller: 'firmwareVersionC',
			templateUrl: 'pages/firmwareUpgrade/firmwareVersion.html?' + Math.random()
		})
		// 升级任务
		.when('/upgradeTask/:random', {
			controller: 'upgradeTaskC',
			templateUrl: 'pages/firmwareUpgrade/upgradeTask.html?' + Math.random()
		})
		//app升级
		.when('/appUpgrade/:random', {
			controller: 'appUpgradeC',
			templateUrl: 'pages/updateManage/appUpgrade.html?' + Math.random()
		})
		//产品维度
		.when('/proDimension/:random', {
			controller: 'proDimensionC',
			templateUrl: 'pages/FMSManage/proDimension.html?' + Math.random()
		})
		//地区修正系数
		.when('/regionAmend/:random', {
			controller: 'regionAmendC',
			templateUrl: 'pages/FMSManage/regionAmend.html?' + Math.random()
		})
		//个体修正系数
		.when('/unitAmend/:random', {
			controller: 'unitAmendC',
			templateUrl: 'pages/FMSManage/unitAmend.html?' + Math.random()
		})
		.otherwise({
			redirectTo: '/productList/1'
		});
})

//angular过滤器
var filtersModule = angular.module('qinyuanFilters', []);

filtersModule.filter('resolution', function($sce) {
	return function(html) {
		return $sce.trustAsHtml(html)
	}
});
filtersModule.filter('num', function() {
	return function(n) {
		var res = [];
		for (var i = 1; i < n + 1; i++) {
			res.push(i);
		}
		return res;
	};
});
filtersModule.filter('resource', function() {
	return function(n) {
		if (n == 1) {
			var res = "ilop"
		}
		return res;
	};
});
filtersModule.filter('sex', function() {
	return function(n) {
		if (n == 1) {
			var res = "男";
		} else if (n == 2) {
			var res = "女";
		}
		return res;
	};
});
filtersModule.filter('phone', function() {
	return function(n) {
		if (n == "" || n == undefined || n == null) {
			return "--";
		} else {
			var number = new Number(n);
			var a = number.toString()
			var res = a.substr(0, 3) + "****" + a.substr(7);
			return res;
		}
	};
});
filtersModule.filter('filterStaus', function() {
	return function(type) {
		switch (type) {
			case "0":
				type = '正常';
				break;
			case "1":
				type = '需要更换';
				break;
			default:
				type = '即将到期';
				break;
		}
		return type;
	};
});
filtersModule.filter('status', function() {
	return function(type) {
		switch (type) {
			case 0:
				type = '待处理';
				break;
			case 1:
				type = '已受理';
				break;
			case 11:
				type = '待回访';
				break;
			case 13:
				type = '已结案';
				break;
			case 14:
				type = '已关闭';
				break;
			case 2:
				type = '已确认';
				break;
			case 3:
				type = '已派工';
				break;
			case 5:
				type = '已接单';
				break;
			case 6:
				type = '已退单';
				break;
			case 7:
				type = '已拒绝';
				break;
			case 9:
				type = '已完工';
				break;
			default:
				type = '人工关闭';
				break;
		}
		return type
	}
})
filtersModule.filter('nullDeal', function() {
	return function(res) {
		if (res == "" || res == undefined || res == null) {
			return "--";
		} else {
			return res;
		}
	}
});

//angular指令
var directiveModule = angular.module('qinyuanDirective', []);
directiveModule.directive("citys", function($timeout) {
	return {
		restrict: 'AE',
		templateUrl: "pages/common/city.html",
		link: function(scope, elem, attrs) {
			//获取省市区
			scope.regionInit = function(a) {
				dataRequest("GET", "common/getAreaInfo/list", {
					"provinceId": a,
				}, function(msg) {
					scope.cityList = msg.data;
					scope.citybox = 0; //显示省或市
					scope.$apply();
				})
			}
			scope.regionInit();
			//选择城市
			var address, city, region;
			scope.selectPro = function(e) {
				if (e.id.length == 3) {
					$timeout(function() {
						scope.citys = e.citys;
					}, 0);
					scope.citybox = 1;
					address = e.province;
					scope.provinceId = e.id;
					$('.cityList li').siblings('li').removeClass('pitch');
					$('.cityList li').eq(1).addClass('pitch');
					scope.region = e.province;
				} else if (e.id.length == 4) {
					scope.cityId = e.id;
					if (scope.isRegion) {
						dataRequest("GET", "common/getRegions/list", {
							"cityId": e.id
						}, function(res) {
							$timeout(function() {
								scope.regions = res.data;
							}, 0);
							scope.citybox = 2;
							city = e.name;
							$('.cityList li').siblings('li').removeClass('pitch');
							$('.cityList li').eq(2).addClass('pitch');

						})
					} else {
						$(".cityList").hide();
					}
					scope.region = address + e.name;
				} else {
					scope.regionId = e.id;
					scope.region = address + city + e.region;
					$(".cityList").hide();
				}
			}
			scope.provinces = function(e) {
				$('.cityList li').siblings('li').removeClass('pitch');
				$('.cityList li').eq(e).addClass('pitch');
				scope.citybox = e;
			}
			$(".cityselect").click(function(event) {
				$(".cityList").toggle();
				event.stopPropagation(); //阻止冒泡
			});
			$("body").click(function() {
				$(".cityList").hide();
			})
			$('.cityList').click(function() {
				return false;
			});
		}
	}
})

//angular指令
angular.module('QYtable', []).directive("tables", function($timeout) {
	return {
		templateUrl: "pages/common/tables.html",
		link: function() {}
	}
})