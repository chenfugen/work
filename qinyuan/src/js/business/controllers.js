'use strict';

//顶部导航+左侧导航
app.controller('AppController', function($scope, $http, $location, $rootScope) {
	var authority = JSON.parse(sessionStorage.getItem("root"));
	$scope.user = JSON.parse(localStorage.getItem("user"));
	if (authority != "root" && authority != null) {
		$scope.navList = authority;
	} else {
		$scope.navList = module;
	}
	//记录当前页面
	var i = sessionStorage.getItem("module"),
		j = sessionStorage.getItem("pageIndex");
	if (j != null) {
		$scope.selected = i;
		$scope.pageIndex = j;
	} else {
		$scope.selected = 0;
		$scope.pageIndex = 0;
	}
	sessionStorage.setItem("permission", JSON.stringify($scope.navList[$scope.selected].children[$scope.pageIndex].children));
	//选择模块
	$scope.selectMode = function(a, e) {
		//记录点击情况
		if (sessionStorage.getItem("module") != e) {
			$scope.pageIndex = -1;
		} else {
			$scope.pageIndex = sessionStorage.getItem("pageIndex");
		}
		if (a != e) {
			$scope.selected = e;
		} else {
			$scope.selected = 100;
		}
	}
	//选择页面
	$scope.selectPage = function($event, e, a) {
		$event.stopPropagation();
		$scope.pageIndex = e;
		sessionStorage.setItem("module", a);
		sessionStorage.setItem("pageIndex", e);
	}

	//退出
	$scope.loginOut = function() {
		dataRequest("post", 'manage/userAccount/logout', "", function(data) {
			if (!data.success) {
				$(".loginErr").text(data.message);
			} else {
				delCookie("token");
				sessionStorage.clear();
				window.location.href = "index.html";
			}
		})
	}

	$scope.go = function(e) {
		sessionStorage.setItem("permission", JSON.stringify(e.children));
		$location.path("/" + e.childId + "/" + Math.random());
	}

	//获取产品类型
	$.get(config.webAPI.address + 'common/getProductType/list', function(res) {
		if (res.success) {
			sessionStorage.setItem("productType", JSON.stringify(res.data))
		}
	})
	//获取入网类型
	$.get(config.webAPI.address + 'common/getNetType/list', function(res) {
		if (res.success) {
			sessionStorage.setItem("netType", JSON.stringify(res.data))
		}
	})

	//获取产品名称
	$.get(config.webAPI.address + 'common/getProductName/list', function(res) {
		if (res.success) {
			sessionStorage.setItem("productNameList", JSON.stringify(res.data))
		}
	})
	//左侧栏收缩效果
	$scope.str = 1;
	$scope.toggler_nav = function() {
		if ($scope.str == 1) {
			$(".layui-side").animate({
				"width": "0px"
			});
			$(".layui-body").animate({
				"left": "0px"
			});
			$scope.str = 0;
		} else {
			$(".layui-side").animate({
				"width": "200px"
			});
			$(".layui-body").animate({
				"left": "200px"
			});
			$scope.str = 1
		}
	}

	window.addEventListener('hashchange', function(ev) {
		if ($(".layui-side").width() != 200) {
			$(".layui-side").animate({
				"width": "200px"
			});
			$(".layui-body").animate({
				"left": "200px"
			});
			$scope.str = 1;
		}
	});
})

//管理详情
app.controller('managerDetailsC', function($scope, $http, $location, $rootScope) {
	$scope.edit = function() {
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".layui-layer").hide();
		}
		$scope.save = function() {}
	}
})

//个人中心
app.controller('personalC', function($scope, $http, $location, $rootScope) {
	$scope.init = function() {
		dataRequest("get", "manage/userAccount/detail", "", function(res) {
			$scope.item = res.data;
			$scope.$apply();
		})
	}
	$scope.init();
	// 数据初始化
	$scope.listData = [] // 列表数据
	$scope.filter = [] // 筛选数据
	$scope.resetForm = {
		userName: '',
		password: '',
		rePassword: '',
	}
	$scope.deleteForm = {
		id: '',
	}

	//获取角色名称
	dataRequest("GET", "manage/role/list", {
		"pageNum": 1,
		"pageSize": 10,
	}, function(msg) {
		$scope.roleList = msg.data;
		$scope.$apply();
	})

	//退出
	$scope.loginOut = function() {
		dataRequest("post", 'manage/userAccount/logout', "", function(data) {
			if (!data.success) {
				$(".loginErr").text(data.message);
			} else {
				delCookie("token");
				sessionStorage.clear();
				window.location.href = "index.html";
			}
		})
	}
	// 方法定义
	$scope.dialog = function(fun, id) {
		// 弹窗控制
		$scope.fun = fun
		if (fun == 'reset') {
			$scope.resetForm.id = id
		}
		if (fun == 'edit') {
			$scope.userName = id.userName;
			$scope.phone = id.phone;
			$scope.realName = id.realName;
			$scope.sex = id.sex;
			$scope.id = id.id;
		}
		$(".layui-layer-shade").show();
		$(".popoutOne").show();

	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".popoutOne").hide();
	}
	$scope.beforeSubmit = function() { // 表单验证
		if ($scope.fun == 'reset') {
			if ($scope.resetForm.password == "") {
				alert('请输入新密码！')
				return false
			}
			if ($scope.resetForm.password.length < 6) {
				alert('密码不能少于6位！')
				return false
			}
			var re = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
			if (!re.test($scope.resetForm.password)) {
				alert("请输入数字与字母组合的密码！");
				return false;
			}
			if ($scope.resetForm.rePassword == "") {
				alert('请再次输入新密码！')
				return false
			}
			if ($scope.resetForm.rePassword != $scope.resetForm.password) {
				alert('两次密码输入不同,请确认密码!')
				return false
			}
			$scope.close();
			var pwd = hex_md5($scope.resetForm.password).toUpperCase();

			dataRequest('POST', "manage/userAccount/reset/password", {
				"id": $scope.resetForm.id,
				"password": pwd
			}, function(msg) {
				if (msg.success) {
					alert('密码重置成功!')
					$(".layui-layer-shade").show();
					$(".popoutTwo").show();
					$scope.save = function() {
						$scope.loginOut();
					}
				} else {
					alert(msg.message)
				}
			})
		}

		if ($scope.fun == 'edit') {
			if ($scope.userName == undefined) {
				alert('请输入用户姓名!')
				return false
			}
			if ($scope.phone == undefined || $scope.phone.length != 11) {
				alert('请输入正确的联系方式!')
				return false
			}
			if ($scope.realName == undefined) {
				alert('请输入姓名!')
				return false
			}
			if ($scope.roleId == undefined) {
				alert('请选择角色类型!')
				return false
			}
			if ($scope.sex == undefined) {
				alert('请选择性别!')
				return false
			}
			$scope.close();
			dataRequest('POST', "manage/userAccount/update", {
				"id": $scope.id,
				"userName": $scope.userName,
				"realName": $scope.realName,
				"sex": $scope.sex,
				"roleId": $scope.roleId,
				"phone": $scope.phone,
			}, function(msg) {
				if (msg.success) {
					alert('编辑成功!')
					$scope.init();
				} else {
					alert(msg.message)
				}
			})
		}

	}

	//树形图设置
	var zTree; //用于保存创建的树节点
	var setting = { //设置
		check: {
			enable: true
		},
		view: {
			showIcon: false
		},
		data: {
			key: {
				url: "notexists"
			}
		}
	};
	//权限列表
	$scope.treeInit = function(id) {
		dataRequest("GET", "manage/role/detail", {
			"roleId": id
		}, function(data) {
			$scope.trees = data.data.permissions
			$scope.$apply();
			if (data.data.permissions) {
				data.data.permissions.forEach(function(msg) {
					msg.open = true;
				})
			}
			zTree = $.fn.zTree.init($(treeDemo), setting, data.data.permissions); //创建树型
		});
	}
	//查看权限lookOver
	$scope.str = 1
	$scope.lookOver = function(name, id) {
		$scope.roleName = name;
		if ($scope.str == 1) {
			$scope.treeInit(id);
			$(".roleList").animate({
				"width": "72%"
			}, function() {
				$(".back").css({
					"height": $(".roleList").height(),
					"display": "block"
				});
				$(".limit").css({
					"display": "block"
				});
			});
			$scope.str = 0;
		} else {
			$(".back").hide();
			$(".limit").css({
				"display": "none"
			});
			$(".roleList").animate({
				"width": "94%"
			});
			$scope.str = 1
		}
	}
})