'use strict';
app.controller('softUpdateC', function($scope, $http, $location) {
	//获取产品类型
	$scope.productNameList = JSON.parse(sessionStorage.getItem("productNameList"));
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		$scope.id = id;
		if (fun == 'delete' || fun == 'on' || fun == 'off') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '170px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '500px',
				height: '450px',
				top: '20%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		if (fun == 'edit') {
			dataRequest("get", "manage/firmwareVersion/getFirmwareVersionInfo", {
				id: $scope.id
			}, function(res) {
				$scope.newForm = res.data;
				$scope.productNameList.forEach(function(msg) {
					if (msg.productKey == res.data.productKey)
						$scope.newForm.productName = msg.productName;
				})
				$scope.$apply();
			})
		}
		if (fun == "add") {
			$scope.newForm = {
				productKey: "",
				productModel: "",
				firmwareModel: "",
				firmwareVersion: "",
				downLoadUrl: "",
				description: "",
			}
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.form = {
		productType: "",
		moduleModel: "",
		productModel: "",
		firmwareVersion: "",
	}
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/firmwareVersion/getFirmwareVersionList", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(res) {
			$scope.firmwareList = res.data;
			if (d) {
				pageUtils(res.total, "firmwareList", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.form, true);
	//上传文档
	$scope.updataFile = function(a) {
		$.ajax({
			type: "POST",
			url: config.webAPI.address + "common/uploadImg",
			data: a,
			contentType: false,
			cache: false,
			processData: false,
			xhr: function() { //获取上传进度
				var myXhr = $.ajaxSettings.xhr();
				if (myXhr.upload) {
					myXhr.upload.addEventListener('progress', function(e) { //监听progress事件
						var loaded = e.loaded; //已上传
						var total = e.total; //总大小
						var percent = Math.floor(100 * loaded / total); //百分比
						//$('.progress').text(percent + "%"); //数显进度
						$('.progress').css("width", percent + "%"); //图显进度
					}, false);
				}
				return myXhr;
			},
			success: function(res) {
				if (res.success) {
					alert("上传成功！");
					$scope.newForm.downLoadUrl = "http://" + window.location.host + "/web/api/common/getFiles/" + res.data.fileId;
				} else {
					alert(res.message);
				}
				$('.layui-progress').hide();
			},
			error: function(err) {
				$('.layui-progress').hide();
			}
		});
	}
	layui.use('upload', function() {
		var $ = layui.jquery,
			upload = layui.upload;
		upload.render({
			elem: '#testList',
			accept: 'file',
			multiple: true,
			auto: false,
			choose: function(obj) {
				obj.preview(function(index, file, result) {
					if (file.size > 83886080) {
						alert('上传文件超出80M大小!');
						return false;
					}
					$('.layui-progress').show();
					$(".loading").hide();
					var fromData = new FormData();
					fromData.append("file", file);
					$scope.updataFile(fromData);
					$scope.newForm.downLoadUrl = file.name;
					$scope.$apply();
				});
			}
		});
	})
	$scope.save = function() {
		if ($scope.fun == "add" || $scope.fun == "edit") {
			if ($scope.newForm.productName == '') {
				alert("请选择产品类型！")
				return false;
			}
			//			if($scope.newForm.productModel == '') {
			//				alert("请填写产品型号！")
			//				return false;
			//			}
			if ($scope.newForm.firmwareModel == '') {
				alert("请选择模块型号！")
				return false;
			}
			if ($scope.newForm.firmwareVersion == '') {
				alert("请填写固件版本！")
				return false;
			}
			if ($scope.newForm.downLoadUrl == '') {
				alert("请上传新固件！")
				return false;
			}
			$scope.productNameList.forEach(function(msg) {
				if (msg.productName == $scope.newForm.productName)
					$scope.newForm.productKey = msg.productKey;
			})
			dataRequest("post", "manage/firmwareVersion/saveFirmwareVersion", $scope.newForm, function(res) {
				if (res.success) {
					if ($scope.fun == "add") {
						alert("新增成功！");
					} else {
						alert("编辑成功！");
					}
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else if ($scope.fun == "delete") {
			dataRequest("post", "manage/firmwareVersion/deleteFirmwareVersion", {
				id: $scope.id
			}, function(res) {
				if (res.success) {
					alert("删除成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else {
			dataRequest("post", "manage/firmwareVersion/forbidden", {
				id: $scope.id,
				status: $scope.fun == "on" ? 1 : 0
			}, function(res) {
				if (res.success) {
					alert($scope.fun == "on" ? '启用' : '禁用' + "成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		}
	}
})
app.controller('appUpgradeC', function($scope, $http, $location) {
	//权限处理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/upgrade/create/appVersion") {
			$scope.isAdd = msg.checked;
		}
		if (msg.url == "/web/api/manage/upgrade/delete/appVersion") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/upgrade/list") {
			$scope.isList = msg.checked;
		}
	})
	$scope.form = {
		"forceUpgrade": "",
		"startTime": "",
		"endTime": "",
		"versionCode": "",
	}
	$scope.addForm = {
		type: "",
		versionCode: "",
		upgradeDate: "",
		jsonStr: ""
	}
	// 定义方法
	layui.use(['form', 'layedit', 'laydate'], function() { // 初始化日期选择控件
		var form = layui.form,
			layer = layui.layer,
			layedit = layui.layedit,
			laydate = layui.laydate;
		//日期
		laydate.render({
			elem: '#datessss',
			btns: ['clear', 'confirm'],
			type: 'datetime',
			done: function(value, date, endDate) {
				$scope.addForm.upgradeDate = value;
			}
		});
		layui.use('element', function() {
			var element = layui.element;
		});
	});
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		if (fun == 'showUser') {
			$scope.propertyInit = function(a, b, c) {
				var productAttr = [];
				for (var i = a; i < b; i++) {
					if (c[i] != undefined) {
						productAttr.push(c[i])
					}
				}
				$scope.users = productAttr;
			}
			$scope.propertyInit(0, 10, JSON.parse(id));
			pageUtils(JSON.parse(id).length, 'users', function(obj) {
				$scope.propertyInit((obj.curr - 1) * obj.limit, obj.curr * obj.limit, JSON.parse(id));
			});
		} else {
			$scope.id = id;
		}
		if (fun == 'delete' || fun == 'empty') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '170px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
		} else if (fun == "showUser") {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '600px',
				maxHeight: '500px',
				height: 'auto',
				top: '20%',
				left: '50%',
				marginLeft: '-300px'
			}
		} else {
			$scope.addForm = {
				type: "",
				versionCode: "",
				upgradeDate: "",
				jsonStr: ""
			}
			$scope.phoneList = "";
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '500px',
				maxHeight: '500px',
				height: 'auto',
				top: '20%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		if (fun == "add") {
			$scope.newForm = {
				"remark": "",
				"explain": "",
				"fileId": "",
				"versionCode": "",
			}
			$scope.upObject = '';
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	//版本管理
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/upgrade/list", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(res) {
			$scope.versionList = res.data;
			if (d) {
				pageUtils(res.total, "appVersion", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	//升级管理列表
	$scope.versionInit = function(a, b, c, d) {
		dataRequest("get", "manage/upgrade/appUpgrade/list", {
			pageNum: a,
			pageSize: b,
			type: c,
		}, function(res) {
			$scope.nomal = res.data.nomal;
			$scope.forceUp = res.data.forceUpgrade;
			$scope.historyVer = res.data.history;
			if ($scope.nomal.createTime != "-" && a == 1) {
				$scope.historyVer.unshift($scope.nomal);
			}
			if ($scope.forceUp.createTime != "-" && a == 1) {
				$scope.historyVer.unshift($scope.forceUp);
			}
			$scope.type = c;
			$scope.historyInit = function(n, m, p) {
				var attr = [];
				for (var i = n; i < m; i++) {
					if (p[i] != undefined) {
						attr.push(p[i])
					}
				}
				$scope.history = attr;
				$scope.$apply();
			}
			$scope.historyInit(0, 10, $scope.historyVer);
			pageUtils($scope.historyVer.length, d, function(obj) {
				$scope.historyInit((obj.curr - 1) * obj.limit, obj.curr * obj.limit, $scope.historyVer);
			});
		})
	}
	//版本号列表
	$scope.getVersionCode = function() {
		dataRequest("get", "common/getVersionCode/list", {}, function(res) {
			$scope.versionCode = res.data;
			$scope.$apply();
		})
	}
	$scope.getVersionCode();
	$scope.versionInit(1, 10, 1, 'officialVersion');
	$scope.init(1, 10, $scope.form, true);
	//上传文档
	$scope.updataFile = function(a) {
		$.ajax({
			type: "POST",
			url: config.webAPI.address + "manage/upgrade/upload/apk",
			data: a,
			contentType: false,
			cache: false,
			processData: false,
			xhr: function() { //获取上传进度
				var myXhr = $.ajaxSettings.xhr();
				if (myXhr.upload) {
					myXhr.upload.addEventListener('progress', function(e) { //监听progress事件
						var loaded = e.loaded; //已上传
						var total = e.total; //总大小
						var percent = Math.floor(100 * loaded / total); //百分比
						//$('.progress').text(percent + "%"); //数显进度
						$('.progress').css("width", percent + "%"); //图显进度
					}, false);
				}
				return myXhr;
			},
			success: function(res) {
				if (res.success) {
					$scope.newForm.fileId = res.data.fileId;
					$scope.$apply();
				} else {
					alert(res.message);
				}
				$('.layui-progress').hide();
			},
			error: function(err) {
				$('.layui-progress').hide();
			}
		});
	}
	layui.use('upload', function() {
		var $ = layui.jquery,
			upload = layui.upload;
		upload.render({
			elem: '#testList',
			accept: 'file',
			multiple: true,
			auto: false,
			choose: function(obj) {
				obj.preview(function(index, file, result) {
					if (file.size > 83886080) {
						alert('上传文件超出80M大小!');
						return false;
					}
					$('.layui-progress').show();
					$(".loading").hide();
					var fromData = new FormData();
					fromData.append("apkFile", file);
					$scope.updataFile(fromData);
					$scope.$apply();
				});
			}
		});
	})
	$scope.save = function() {
		if ($scope.fun == "add") {
			if ($scope.newForm.versionCode == '') {
				alert("请填写app版本号！")
				return false;
			}
			if ($scope.newForm.fileId == '') {
				alert("请上传app安装包！")
				return false;
			}
			if ($scope.newForm.remark == '' || $scope.newForm.remark == undefined) {
				alert("请填写版本备注！")
				return false;
			}
			if ($scope.newForm.explain == '' || $scope.newForm.explain == undefined) {
				alert("请填写更新说明！")
				return false;
			}
			dataRequest("post", "manage/upgrade/create/appVersion ", $scope.newForm, function(res) {
				if (res.success) {
					alert("新增成功！");
					$scope.init(1, 10, $scope.form, true);
					$scope.getVersionCode();
				} else {
					alert(res.message);
				}
			})
		}
		if ($scope.fun == "versionAdd") {
			if ($scope.addForm.forceUpgrade == '') {
				alert("请选择更新方式！")
				return false;
			}
			if ($scope.addForm.versionCode == '') {
				alert("请选择app版本号！")
				return false;
			}
			$scope.addForm.type = 1;
			dataRequest("post", "manage/upgrade/create/appUpgrade", $scope.addForm, function(res) {
				if (res.success) {
					alert("新增成功！");
					$scope.versionInit(1, 10, 1, 'officialVersion')
				} else {
					alert(res.message);
				}
			})
		}
		if ($scope.fun == "userAdd") {
			if ($scope.addForm.forceUpgrade == '') {
				alert("请选择更新方式！")
				return false;
			}
			if ($scope.addForm.versionCode == '') {
				alert("请选择app版本号！")
				return false;
			}
			if ($scope.phoneList == '' || $scope.phoneList == undefined) {
				alert("请填写要发送的用户号码！")
				return false;
			}
			var numList = $scope.phoneList.split(",");
			$scope.numList = [];
			for (var i = 0; i < numList.length; i++) {
				var row = {
					phone: ""
				};
				row.phone = numList[i];
				$scope.numList.push(row)
			}
			$scope.addForm.type = 2
			$scope.addForm.jsonStr = JSON.stringify($scope.numList);
			dataRequest("post", "manage/upgrade/create/appUpgrade", $scope.addForm, function(res) {
				if (res.success) {
					alert("新增成功！");
					$scope.versionInit(1, 10, 2, 'userVersion')
				} else {
					alert(res.message);
				}
			})
		}
		if ($scope.fun == "delete") {
			dataRequest("post", "manage/upgrade/delete/appVersion", {
				id: $scope.id
			}, function(res) {
				if (res.success) {
					alert("删除成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
		}
		if ($scope.fun == "verDelete") {
			dataRequest("post", "manage/upgrade/delete/appUpgrade", {
				id: $scope.id
			}, function(res) {
				if (res.success) {
					alert("删除成功！");
					if ($scope.type == 1) {
						$scope.versionInit(1, 10, 1, 'officialVersion');
					} else {
						$scope.versionInit(1, 10, 2, 'userVersion');
					}
				} else {
					alert(res.message);
				}
			})
		}
		if ($scope.fun == "empty") {
			dataRequest("post", "manage/upgrade/reset/appUpgrade", {
				id: $scope.id
			}, function(res) {
				if (res.success) {
					alert("操作成功！");
					if ($scope.type == 1) {
						$scope.versionInit(1, 10, 1, 'officialVersion');
					} else {
						$scope.versionInit(1, 10, 2, 'userVersion');
					}
				} else {
					alert(res.message);
				}
			})
		}
		$scope.close();
	}
})