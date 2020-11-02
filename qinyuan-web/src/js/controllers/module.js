'use strict';
app.controller('usedListC', function($scope, $http, $location) {
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		$scope.id = id;
		if (fun == 'change') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '400px',
				height: '350px',
				top: '30%',
				left: '50%',
				marginLeft: '-200px'
			}
			$scope.moduleCode = "";
			$scope.identityId = "";
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '700px',
				height: '500px',
				top: '20%',
				left: '50%',
				marginLeft: '-300px'
			}
			dataRequest("get", "manage/moduleRecord/getModuleRecordInfo", {
				id: $scope.id
			}, function(msg) {
				$scope.historyList = msg.data;
				$scope.$apply();
			})
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.save = function() {
		if ($scope.fun == 'change') {
			if ($scope.moduleCode == "" || $scope.moduleCode == undefined) {
				alert("请输入模块编码！");
				return false;
			}
			if ($scope.identityId == "" || $scope.identityId == undefined) {
				alert("请输入MAC编码！");
				return false;
			}
			dataRequest("post", "manage/module/changeModule", {
				moduleCode: $scope.moduleCode,
				identityId: $scope.identityId,
				id: $scope.id
			}, function(msg) {
				if (msg.success) {
					alert("更换成功!");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(msg.message);
				}
			})
		}
	}

	$scope.form = {
		productModel: "",
		manufacturer: "",
		moduleCode: "",
		identityId: "",
		snCode: "",
		deviceName: "",
		netType: "NET_WIFI",
		status: "3"
	};
	$scope.selectNet = function(e) {
		$scope.form.netType = e;
		$scope.init(1, 10, $scope.form, true);
	}
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/module/getModuleList", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(msg) {
			$scope.usedList = msg.data;
			if (d) {
				pageUtils(msg.total, "usedlist", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.form, true);
})

app.controller('stockListC', function($scope, $http, $location) {
	//获取入网类型
	$scope.netTypeList = JSON.parse(sessionStorage.getItem("netType"));
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		$scope.id=id;
		if (fun == 'scrap' || fun == 'delete' || fun == 'edit') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '450px',
				height: '180px',
				top: '30%',
				left: '50%',
				marginLeft: '-210px'
			}
			$(".layui-layer-shade").show();
			$(".layui-layer").show();
		} else {}

	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	//获取导入模块的列表
	$scope.getImportList=function(){
	dataRequest("get", "manage/module/getModuleImportPreList", {
					pageNum: 1,
					pageSize: 10
				}, function(res) {
					$scope.listData = res.data;
					$scope.$apply();
                   $(".layui-layer-shade").show();
                   $(".layui-layer").show();
				})
				}
	//上传文件
	$scope.updataFile = function(a) {
		imgUpload("POST", 'manage/module/import', a, function(res) {
			if (res.success) {
				$scope.fun = "add";
				$scope.dialogStyle = {
					zIndex: 19891015,
					width: '700px',
					maxHeight: '500px',
					height: 'auto',
					top: '20%',
					left: '50%',
					marginLeft: '-300px'
				}
		    $scope.getImportList();			
			} else {
				alert(res.message);
			}
		})
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
					if (file.size > 1048576) {
						alert('上传文件超出1M大小!');
						return false;
					}
					var fromData = new FormData();
					fromData.append("file", file);
					$scope.updataFile(fromData)
				});
			}
		});
	})

	//删除导入的数据
	$scope.delete = function(e) {
		dataRequest("post", "manage/module/deleteModule", {
			id:e
		}, function(res) {
			if(res.success){			
			$scope.getImportList();
			}else{
				alert(res.message);
			}
		})
	}
	//窗口确定操作
	$scope.save = function() {
		if ($scope.fun == "add") {
			dataRequest("post", "manage/module/addModuleBatch", {}, function(res) {
				if (res.success) {
					alert(res.message);
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
				$scope.close();
			})
		}
		if($scope.fun == "scrap"){
			dataRequest("post", "manage/module/updateModuleStatus", {
				id:$scope.id,
				status:4,
			}, function(res) {
				if (res.success) {
					alert("报废成功!");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
				$scope.close();
			})
		}
		if($scope.fun == "delete"){
			dataRequest("post", "manage/module/deleteModule", {
				id:$scope.id,
			}, function(res) {
				if (res.success) {
					alert("删除成功!");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
				$scope.close();
			})
		}
		if($scope.fun == "edit"){
			dataRequest("post", "manage/module/updateModuleStatus", {
				id:$scope.id,
				status:2,
			}, function(res) {
				if (res.success) {
					alert("添加成功!");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
				$scope.close();
			})
		}
	}
	$scope.form = {
		productModel: "",
		manufacturer: "",
		moduleCode: "",
		identityId: "",
		snCode: "",
		deviceName: "",
		netType: "",
		status: 2
	};
	$scope.selectNet = function(e) {
		$scope.form.status = e;
		$scope.init(1, 10, $scope.form, true);
	}
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/module/getModuleList", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(msg) {
			$scope.stockList = msg.data;
			if (d) {
				pageUtils(msg.total, "stockList", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.form, true);
})
