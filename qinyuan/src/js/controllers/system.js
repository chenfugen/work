//管理员列表
app.controller('managerListC', function($scope, $http, $location, $routeParams) {
	if ($routeParams.random.indexOf("?") > 0) {
		$scope.roleName = $routeParams.random.split("?")[1];
	}
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/userAccount/create") {
			$scope.isAdd = msg.checked;
		}
		if (msg.url == "/web/api/manage/userAccount/update") {
			$scope.isUpdate = msg.checked;
		}
		if (msg.url == "/web/api/manage/userAccount/detail") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/userAccount/delete") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/userAccount/used") {
			$scope.start = msg.checked;
		}
		if (msg.url == "/web/api/manage/userAccount/forbidden") {
			$scope.off = msg.checked;
		}
		if (msg.url == "/web/api/manage/userAccount/reset/password") {
			$scope.reset = msg.checked;
		}
	})
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
	// 方法定义
	$scope.dialog = function(fun, item) {
		if (fun != "add") {
			if (item.userName == "root") {
				alert("超级管理员暂时无法操作！")
				return false;
			}
		}
		// 弹窗控制
		$scope.fun = fun
		if (fun == 'reset') {
			$scope.resetForm.id = item.id
		}
		if (fun == 'delete') {
			$scope.deleteForm.id = item.id;
		}
		if (fun == 'edit') {
			$scope.userName = item.userName;
			$scope.phone = item.phone;
			$scope.realName = item.realName;
			$scope.rolename = item.roleName;
			$scope.sex = item.sex;
			$scope.id = item.id;
			$scope.roleList.forEach(function(msg) {
				if ($scope.id == msg.id) {
					$scope.rolename = msg.roleName;
				}
			})
		}
		if (fun == 'add') {
			$scope.userName = undefined;
			$scope.password = undefined;
			$scope.phone = undefined;
			$scope.realName = undefined;
			$scope.sex = undefined;
			$scope.role = undefined;
		}
		if (fun == 'start') {
			$scope.startId = item.id;
		}
		if (fun == 'stop') {
			$scope.stopId = item.id;
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
					$scope.getListData("", "", "", "", "", "", "", "", 1, 10, true);
				} else {
					alert(msg.message)
				}
			})
		}
		if ($scope.fun == 'delete') {
			$scope.close();
			dataRequest('POST', "manage/userAccount/delete", {
				"id": $scope.deleteForm.id
			}, function(msg) {
				if (msg.success) {
					alert('删除成功!')
					$scope.getListData("", "", "", "", "", "", "", "", 1, 10, true);
				} else {
					alert(msg.message)
				}
			})
		}
		if ($scope.fun == 'add' || $scope.fun == 'edit') {
			if ($scope.userName == undefined || $scope.userName == "") {
				alert('请输入用户名!')
				return false
			}
			if ($scope.realName == undefined || $scope.realName == "") {
				alert('请输入姓名!')
				return false
			}
			if ($scope.phone == undefined || $scope.phone.length != 11) {
				alert('请输入正确的联系方式!')
				return false
			}
			if ($scope.rolename == undefined) {
				alert('请选择角色类型!')
				return false
			}
			if ($scope.sex == undefined) {
				alert('请选择性别!')
				return false
			}
			if ($scope.fun == 'add') {
				if ($scope.password == undefined || $scope.password == "") {
					alert('请输入密码!')
					return false
				}
				if ($scope.password.length < 6) {
					alert('密码不能少于6位！')
					return false
				}
				var re = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
				if (!re.test($scope.password)) {
					alert("请输入数字与字母组合的密码！");
					return false;
				}
				$scope.roleList.forEach(function(msg) {
					if ($scope.rolename == msg.roleName) {
						$scope.roleId = msg.id;
					}
				})
				var addPwd = hex_md5($scope.password).toUpperCase();
				dataRequest('POST', "manage/userAccount/create", {
					"userName": $scope.userName,
					"password": addPwd,
					"realName": $scope.realName,
					"sex": $scope.sex,
					"roleId": $scope.roleId,
					"phone": $scope.phone,
				}, function(msg) {
					if (msg.success) {
						alert('新增成功!')
						$scope.getListData("", "", "", "", "", "", "", "", 1, 10, true);
						$scope.close();
					} else {
						alert(msg.message)
					}
				})
			}
			if ($scope.fun == 'edit') {
				$scope.roleList.forEach(function(msg) {
					if ($scope.rolename == msg.roleName) {
						$scope.roleId = msg.id;
					}
				})
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
						$scope.getListData("", "", "", "", "", "", "", "", 1, 10, true);
					} else {
						alert(msg.message)
					}
				})
			}
		}
		if ($scope.fun == 'start') {
			$scope.close();
			dataRequest('POST', "manage/userAccount/used", {
				"id": $scope.startId,
			}, function(msg) {
				if (msg.success) {
					alert('启用成功!')
					$scope.getListData("", "", "", "", "", "", "", "", 1, 10, true);
				} else {
					alert(msg.message)
				}
			})
		}
		if ($scope.fun == 'stop') {
			$scope.close();
			dataRequest('POST', "manage/userAccount/forbidden", {
				"id": $scope.stopId,
			}, function(msg) {
				if (msg.success) {
					alert('禁用成功!')
					$scope.getListData("", "", "", "", "", "", "", "", 1, 10, true);
				} else {
					alert(msg.message)
				}
			})
		}
	}
	$scope.goDetail = function(id) { // 跳转详细
		$location.path("/managerDetails/" + id);
	}

	//获取时间
	layui.use(['form', 'layedit', 'laydate'], function() {
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		laydate.render({
			elem: '#date',
			type: 'datetime',
			range: true,
			done: function(value) {
				$scope.startTime = value.slice(0, 20)
				$scope.endTime = value.slice(22)
			}
		});
	});

	//获取管理员列表
	$scope.getListData = function(a, b, c, d, e, f, g, h, i, j, k) {
		dataRequest("GET", "manage/userAccount/list", {
			"roleName": a,
			"sex": b,
			"forbidden": c,
			"creator": d,
			"accountName": e,
			"phone": f,
			"startTime": g,
			"endTime": h,
			"pageNum": i,
			"pageSize": j,
		}, function(res) {
			$scope.listData = res.data
			if (k) {
				pageUtils(res.total, "adminList", function(obj) {
					$scope.getListData($scope.roleName, $scope.sex, $scope.forbidden, $scope.creator, $scope.accountName, $scope.accountPhone, $scope.startTime, $scope.endTime, obj.curr, obj.limit, false);
				})
			}
			$scope.$apply()
		})
	}
	$scope.getListData($scope.roleName, "", "", "", "", "", "", "", 1, 10, true);

	//获取角色名称
	dataRequest("GET", "manage/role/list", {
		"pageNum": 1,
		"pageSize": 1000,
	}, function(msg) {
		$scope.roleList = msg.data;
		$scope.$apply();
	})

	//查询
	$scope.search = function() {
		if ($scope.accountName == undefined) {
			$scope.accountName = "";
		}
		if ($scope.roleName == undefined) {
			$scope.roleName = "";
		}
		$scope.getListData($scope.roleName, $scope.sex, $scope.forbidden, $scope.creator, $scope.accountName, $scope.accountPhone, $scope.startTime, $scope.endTime, 1, 10, true);
	}

	//树形图设置
	var zTree; //用于保存创建的树节点
	var setting = { //设置
		check: {
			enable: true,
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
			$scope.trees = data.data.permissions;
			$scope.$apply();
			if (data.data.permissions) {
				data.data.permissions.forEach(function(msg) {
					msg.open = true;
				})
			}
			zTree = $.fn.zTree.init($(treeDemo), setting, data.data.permissions); //创建树型
		});
	}
	//查看权限
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

//角色管理
app.controller('roleManageC', function($scope, $http, $location) {
	//权限处理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/role/create") {
			$scope.isAdd = msg.checked;
		}
		if (msg.url == "/web/api/manage/role/update") {
			$scope.isUpdate = msg.checked;
		}
		if (msg.url == "/web/api/manage/role/detail") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/role/delete") {
			$scope.isDelete = msg.checked;
		}
	})

	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 初始化翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'roleList',
				count: total,
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
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
	//获取角色名称
	$scope.getRole = function() {
		dataRequest("GET", "manage/role/list", {
			"pageNum": 1,
			"pageSize": 1000
		}, function(msg) {
			$scope.roleList = msg.data;
			$scope.$apply();
		})
	}
	$scope.getRole();
	$scope.dialog = function(id) { // 控制弹窗
		$(".layui-layer-shade").show();
		$(".popoutOne").show();
	}
	$scope.edit = function(id) {
		$location.path('/roleAdd');
	}
	$scope.getListData = function(para, first) { // 获取列表
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_role_list,
			data: _extends({}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
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
	// 方法调用
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, true)

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
		},
		callback: {
			onCheck: function(treeId, treeNode) {
				$scope.expression = false;
				$scope.$apply();
			}
		}
	};
	//权限列表
	$scope.treeInit = function(a, id) {
		if (a) {
			dataRequest("GET", "common/account/permission/list", "", function(data) {
				data.data.forEach(function(msg) {
					msg.checked = false;
					msg.open = true;
					msg.children.forEach(function(res) {
						res.checked = false;
						res.children.forEach(function(res) {
							res.checked = false;
						})
					})
				})
				zTree = $.fn.zTree.init($(treeDemo), setting, data.data); //创建树型
			})
		} else {
			dataRequest("GET", "manage/role/detail", {
				"roleId": id
			}, function(data) {
				console.log(JSON.stringify(data.data.permissions));
				data.data.permissions.forEach(function(msg) {
					msg.open = true;
				})
				zTree = $.fn.zTree.init($(treeDemo), setting, data.data.permissions); //创建树型
			});
		}
		$(".back").css({
			"height": $(".roleList").height(),
			"display": "block"
		});
	}
	//全选
	$scope.checkAll = function() {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		zTree.checkAllNodes($scope.expression);

	}
	$scope.saveRole = function() {
		if ($scope.roleName == undefined || $scope.roleName == "") {
			alert("请填写新增角色名！");
			return false;
		}
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		var nodes = treeObj.getNodes();
		var formatData = [];
		for (var p in nodes) {
			formatData[p] = {};
			formatData[p]['children'] = [];
			formatData[p]['name'] = nodes[p].name;
			formatData[p]['checked'] = nodes[p].checked;
			formatData[p]['moduleId'] = nodes[p].moduleId;
			for (var c in nodes[p].children) {
				formatData[p]['children'][c] = {};
				formatData[p]['children'][c]['children'] = [];
				formatData[p]['children'][c]['name'] = nodes[p].children[c].name;
				formatData[p]['children'][c]['checked'] = nodes[p].children[c].checked;
				formatData[p]['children'][c]['childId'] = nodes[p].children[c].childId;
				for (var n in nodes[p].children[c].children) {
					formatData[p]['children'][c]['children'][n] = {};
					formatData[p]['children'][c]['children'][n]['name'] = nodes[p].children[c].children[n].name;
					formatData[p]['children'][c]['children'][n]['checked'] = nodes[p].children[c].children[n].checked;
					formatData[p]['children'][c]['children'][n]['url'] = nodes[p].children[c].children[n].url;
				}
			}
		}
		if ($(".limitHeader").text() == "新增") {
			dataRequest("post", "manage/role/create", {
				"roleName": $scope.roleName,
				"permissions": JSON.stringify(formatData)
			}, function(msg) {
				if (msg.success) {
					alert("新增成功！")
					$scope.getListData({
						pageNum: 1,
						pageSize: 10,
					}, true)
					$scope.getRole();
					$scope.clear();
				} else {
					alert(msg.message);
					$scope.treeInit(true, "");
				}
			})
		} else {
			dataRequest("post", "manage/role/update", {
				"roleName": $scope.roleName,
				"id": roleId,
				"permissions": JSON.stringify(formatData)
			}, function(msg) {
				if (msg.success) {
					alert("编辑成功！")
					$scope.getListData({
						pageNum: 1,
						pageSize: 10,
					}, true)
					$scope.clear();
				} else {
					alert(msg.message);
					$scope.treeInit(false, roleId);
				}
			})
		}
	}
	$scope.str = 1;
	//新增
	$scope.add = function() {
		$(".limitHeader").text("新增");
		$scope.roleName = undefined;
		$scope.saveButton = true;
		$scope.expression = false;
		if ($scope.str == 1) {
			$scope.treeInit(true, "");
			$(".roleList").animate({
				"width": "70%"
			}, function() {
				$(".limit").css({
					"display": "block"
				});
			});
			$scope.str = 0;
		} else {
			$(".limit").css({
				"display": "none"
			});
			$(".roleList").animate({
				"width": "94%"
			});
			$scope.str = 1
		}
	}
	var roleId;
	//编辑
	$scope.edit = function(name, id) {
		$scope.expression = false;
		if (name == "root") {
			alert("超级管理员无法修改!");
			return false;
		}
		$(".limitHeader").text("编辑");
		$scope.roleName = name;
		$scope.saveButton = true;
		roleId = id;
		if ($scope.str == 1) {
			$scope.treeInit(false, id);
			$(".roleList").animate({
				"width": "70%"
			}, function() {
				$(".limit").css({
					"display": "block"
				});
			});
			$scope.str = 0;
		} else {
			$(".limit").css({
				"display": "none"
			});
			$(".roleList").animate({
				"width": "94%"
			});
			$scope.str = 1
		}
	}
	$scope.delete = function(name, id) {
		if (name == "root") {
			alert("超级管理员无法修改!");
			return false;
		}
		$(".layui-layer-shade").show();
		$(".popoutOne").show();
		$scope.close = function() { // 关闭表单
			$(".layui-layer-shade").hide();
			$(".popoutOne").hide();
		}
		$scope.save = function() {
			$scope.close();
			dataRequest("post", "manage/role/delete", {
				"roleId": id
			}, function(msg) {
				if (msg.success) {
					alert("删除成功！")
					$scope.getListData({
						pageNum: 1,
						pageSize: 10,
					}, true)
				} else {
					alert(msg.message);
				}
			})
		}
	}
	$scope.lookOver = function(name, id) {
		$(".limitHeader").text("查看");
		$scope.roleName = name;
		$scope.saveButton = false;
		if ($scope.str == 1) {
			$scope.treeInit(false, id);
			$(".roleList").animate({
				"width": "70%"
			}, function() {
				$(".limit").css({
					"display": "block"
				});
			});
			$scope.str = 0;
		} else {
			$(".limit").css({
				"display": "none"
			});
			$(".roleList").animate({
				"width": "94%"
			});
			$scope.str = 1
		}
	}
	$scope.clear = function() {
		$(".limit").css({
			"display": "none"
		});
		$(".roleList").animate({
			"width": "94%"
		});
		$scope.str = 1;
		$(".back").hide();
	}
	//查询
	$scope.search = function() {
		$scope.getListData({
			pageNum: 1,
			pageSize: 10,
			roleName: $scope.rolename
		}, true)
	}

	//查看跳转
	$scope.goManage = function(r) {
		$location.path("/managerList/" + Math.random() + "?" + r);
	}
})

//意见反馈
app.controller('messageFeedbackC', function($scope, $http, $location, $rootScope) {
	//权限管理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/feedBack/detail") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/feedBack/list") {
			$scope.isSearch = msg.checked;
		}
		if (msg.url == "/web/api/manage/feedBack/updateFeedBackFeedContent") {
			$scope.feedBack = msg.checked;
		}
	});
	//初始化数据
	$scope.filter = { // 初始化筛选表单
		status: "",
		endTime: '',
		startTime: '',
		phone: '',
		feedBackUser: '',
	}
	$scope.form = {} // 初始化表单
	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 初始化翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		pageUtils(total, "messageFeedbackPage", function(obj) {
			$scope.getListData({
				pageNum: obj.curr,
				pageSize: obj.limit
			})
		})
	}
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化时间控件
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
	$scope.dialog = function(fun, id) { // 控制弹窗
		$scope.fun = fun
		$scope.form.id = id
		if (fun == 'info') {
			$scope.getInfoData()
		}
		$(".layui-layer-shade").show();
		$(".popoutOne").show();
	}
	$scope.getInfoData = function() { // 获取回复信息
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_feedBack_detail,
			data: {
				id: $scope.form.id
			},
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.form = res.data
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".popoutOne").hide();
		$scope.form = {}
	}
	$scope.save = function() { // 保存表单
		if ($scope.fun == 'reply') {
			if ($scope.form.content.length > 100) {
				alert('您的反馈的内容过长！');
				return false;
			}
			var api = apiConfig.manage_feedBack_updateFeedBackFeedContent
			var para = {
				content: $scope.form.content,
				id: $scope.form.id
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
							pageSize: 10,
						})
					} else {
						alert(res.message)
					}
				},
				error: function(err) {
					console.log(err)
				}
			});
		} else {
			$scope.close()
		}
	}
	$scope.getListData = function(para, first) { // 获取列表数据
		if ($scope.filter.startTime == '' || $scope.filter.endTime == '') {
			$scope.filter.startTime = ''
			$scope.filter.endTime = ''
		}
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_feedBack_list,
			data: _extends({}, para, $scope.filter),
			async: true,
			dataType: 'json',
			success: function(res) {
				$scope.listData = res.data
				for (var i in $scope.listData) {
					if ($scope.listData[i].username != null) {
						var length = $scope.listData[i].username.length
						var x = ''
						for (var y = 1; y < length; y++) {
							x = x + '*'
						}
						$scope.listData[i].username = $scope.listData[i].username[0] + x
					}
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
	// 方法调用
	$scope.getListData({
		pageNum: 1,
		pageSize: 10,
	}, true)
})

// 系统维护
app.controller('systemMaintenanceC', function($scope, $http, $location, $rootScope) {
	var api = ''
	$scope.init = function() {
		$scope.form = {
			expireTime: '',
			status: '',
			content: '2019-8-1 15:00:00', // 暂时取消时间机制 字段无效
		}
		var api = apiConfig.getSystemMaintainConfigInfo
		dataRequest("GET", api, {}, function(res) {
			$scope.form = res.data
			$scope.form.status = res.data.status == 1 ? '开启' : '停用'
			$scope.$apply()
		})
		// layui.use('laydate', function() {
		// 	var laydate = layui.laydate;
		//
		// 	//执行一个laydate实例
		// 	laydate.render({
		// 		elem: '#dateSystem', //指定元素
		// 		type: 'datetime',
		// 		btns: [
		// 			'clear', 'confirm'
		// 		],
		// 		done: function(value, date, endDate) {
		// 			$scope.form.expireTime = value
		// 		}
		// 	});
		// });
	}
	$scope.handleSubmit = function() {
		api = apiConfig.saveSystemMaintainConfig
		var para = JSON.parse(JSON.stringify($scope.form))
		if ($scope.form.content == '') {
			alert('请填写消息内容')
			return false
		}
		if ($scope.form.status == '') {
			alert('请选择状态')
			return false
		}
		para.status = $scope.form.status == '开启' ? '1' : '0'
		dataRequest("POST", api, para, function(res) {
			alert(res.message)
			$scope.$apply()
		})
	}
	$scope.init()
})