// nelson 更新版本
// 固件升级任务
app.controller('upgradeTaskC', function($scope, $http, $location, $rootScope) {
	var filterReadyForm = {},
		editTag = false // 标示产品选择框修改是否为用户手动
	// 初始化表单变量
	$scope.initFormData = function() {
		$scope.dialog = false
		$scope.checkedAll = false
		$scope.showNext = false
		$scope.targetVersionList = []
		$scope.taskDeviceList = {}
		$scope.act = '' // 当前表单模式
		$scope.deleteForm = {} // 删除表单
		$scope.addForm = { // 添加表单
			taskName: '',
			productKey: '',
			productModel: '',
			upgradableVersion: '',
			firmwareVersion: '',
			targetVersion: '',
			upgradeWay: '',
			upgradeAll: '',
			deviceList: [],
			typeName: '',
			type: '',
		}
		$scope.readyVersionList = [] // 搜索到的版本列表
		$scope.choseVersionList = [] // 已选择的版本列表
		$scope.forbiddenForm = {} // 禁用表单
		$scope.choseDialog = false //版本搜索弹窗显示
		$scope.searchVersion = '' // 表单内搜索固件版本参数
		$scope.searchDevice = '' // 表单内搜索设备参数
		$scope.readyDeviceList = [] // 表单内已搜索到的设备列表
		$scope.choseDeviceList = [] // 表单内已导入的设备列表
		$scope.dialogTitle = '' // 表单弹窗Title
		$scope.deviceForm = { // 表单内设备列表数据(带 是否为全部设备 参数)
			list: [],
			data: ''
		}
	}
	// 初始化已提交的筛选表单
	var filterReadyForm = {}
	// 初始化筛选表单
	$scope.filterForm = {
		type: '',
		productKey: '',
		productModel: '',
		upgradeWay: '', //升级方式 1.app 自主升级 2.静默升级
		upgradableVersion: '', //可升级列表
		targetVersion: '', //目标版本
	}
	//获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productNameList"));
	$scope.filterProduct = function(e) {
		$scope.productTypeList.forEach(function(msg) {
			if (e.productModel == msg.productModel) {
				e.productKey = msg.productKey
			}
		})
	}
	// 获取列表数据
	$scope.getTableList = function(pageNum, pageSize, filterForm, reInitPage) {
		dataRequest("GET", "manage/firmwareVersionTask/getFirmwareUpgradeTaskList", {
			"pageNum": pageNum,
			"pageSize": pageSize,
			"productKey": filterForm.productKey,
			"productModel": filterForm.productModel,
			"upgradeWay": filterForm.upgradeWay,
			"upgradableVersion": filterForm.upgradableVersion,
			"targetVersion": filterForm.targetVersion,
			"type": filterForm.type
		}, function(res) {
			$scope.tableList = res.data
			if (reInitPage) {
				pageUtils(res.total, "UT_tableList", function(obj) {
					$scope.getTableList(obj.curr, obj.limit, filterReadyForm, false)
				})
			}
			$scope.$apply();
		})
	}
	// 搜索
	$scope.handleSearch = function() {
		filterReadyForm = $scope.filterForm
		$scope.getTableList(1, 10, filterReadyForm, true)
	}
	// 编辑
	$scope.handleEdit = function(item) {
		editTag = true
		var api = '/web/api/manage/firmwareVersionTask/getFirmwareUpgradeTaskInfo',
			para = {
				id: item.id
			}
		$.ajax({
			type: "get",
			url: api,
			data: para,
			dataType: 'json',
			success: function(res) {
				if (res.data.upgradeAll == 2) {
					$scope.getTaskDeviceList(res.data)
				}
				$scope.dialog = true
				$scope.act = 'edit'
				$scope.dialogTitle = '编辑任务'
				$scope.addForm = res.data;
				$scope.addForm.typeName = res.data.type == 1 ? '模组升级' : res.data.type == 2 ? '主板升级' : ''
				$scope.getTargetVersionList();
				$scope.addForm.upgradeWay = $scope.addForm.upgradeWay.toString();
				$scope.addForm.firmwareVersion = $scope.addForm.targetVersion;
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 新增
	$scope.handleAdd = function() {
		$scope.initFormData()
		$scope.act = 'add'
		$scope.dialogTitle = '添加任务'
		$scope.dialog = true
	}
	// 查看列表内版本列表
	$scope.handleShowVersion = function(item) {
		$scope.act = 'showDeviceList'
		$scope.dialogTitle = '起始版本'
		$scope.deviceForm.data = '产品' + item.productModel + '  固件版本：' + item.upgradableVersion
		$scope.dialog = true
	}
	// 查看列表内设备列表
	$scope.handleShowDevice = function(item) {
		$scope.act = 'showDeviceList'
		$scope.dialogTitle = '设备列表'
		if (item.upgradeAll == 1) {
			$scope.deviceForm.data = '产品:' + item.productModel + '  所有设备'
		} else {
			var api = '/web/api/manage/firmwareVersionTask/getFirmwareUpgradeDeviceNoPageList',
				para = {
					taskId: item.id,
				}
			$.ajax({
				type: "get",
				url: api,
				data: para,
				dataType: 'json',
				success: function(res) {
					$scope.deviceForm.list = res.data
					$scope.$apply()
				},
				error: function(err) {
					console.log(err)
				}
			});
		}
		$scope.dialog = true
	}
	// 根据选择的产品搜索固件目标版本
	$scope.getTargetVersionList = function() {
		$scope.addForm.productKey = ''
		for (var i = 0, len = $scope.productTypeList.length; i < len; i++) {
			if ($scope.addForm.productModel == $scope.productTypeList[i].productModel) {
				$scope.addForm.productKey = $scope.productTypeList[i].productKey
			}
		}
		if ($scope.addForm.typeName == '' || $scope.addForm.productModel == '') {
			return false
		}
		$scope.filterProduct($scope.addForm);
		var para = {
				pageNum: 1,
				pageSize: 1000,
				type: $scope.addForm.typeName == '模组升级' ? '1' : '2',
				productKey: $scope.addForm.productKey,
				status: 1
			},
			productList = JSON.parse(sessionStorage.getItem("productNameList")),
			api = '/web/api/manage/firmwareVersion/getFirmwareVersionNoPageList'
		$.ajax({
			type: "get",
			url: api,
			data: para,
			dataType: 'json',
			success: function(res) {
				$scope.targetVersionList = res.data;
				$scope.$apply();
			},
			error: function(err) {
				console.log(err)
			}
		});
		if (editTag == false) {
			$scope.addForm.firmwareVersion = ''
			$scope.addForm.upgradableVersion = ''
		}
		if ($scope.act == 'add') {
			$scope.addForm.firmwareVersion = ''
			$scope.addForm.upgradableVersion = ''
		}
		editTag = false
	}
	// 开始选择版本号 - 进入版本选择页面
	$scope.handleChoseVersion = function() {
		if ($scope.addForm.productKey == '') {
			alert('请先选择产品型号')
		} else if ($scope.addForm.typeName == '') {
			alert('请先选择任务类型')
		} else {
			$scope.dialogTitle = '添加起始固件版本'
			$scope.choseDialog = true
			$scope.handleSearchVersion()
		}
	}
	// 获取起始版本号列表数据
	$scope.handleSearchVersion = function() {
		var para = {
				type: $scope.addForm.typeName == '主板升级' ? '2' : '1',
				productKey: $scope.addForm.productKey,
				firmwareVersion: $scope.searchVersion,
			},
			api = '/web/api/manage/firmwareVersion/getFirmwareVersionDistribution'
		$.ajax({
			type: "get",
			url: api,
			data: para,
			dataType: 'json',
			success: function(res) {
				var list = []
				// 记录原已选的其实版本列表
				for (var i in $scope.readyVersionList) {
					if ($scope.readyVersionList[i].check) {
						list.push($scope.readyVersionList[i])
					}
				}
				$scope.readyVersionList = []
				if (res.data.length < 1) {
					alert('未搜索到相应固件版本')
				} else {
					for (var i in res.data) {
						$scope.readyVersionList.push({
							firmwareVersion: res.data[i],
							productKey: $scope.addForm.productKey,
							check: false
						})
					}
					// 比对原已选版本列表PK，相等则将已选数据导入新搜索到的列表
					for (var i in $scope.readyVersionList) {
						for (var x in list) {
							if (list[x].productKey == $scope.readyVersionList[i].productKey && list[x].firmwareVersion == $scope.readyVersionList[i].firmwareVersion) {
								$scope.readyVersionList[i].check = true
							}
						}
					}
				}
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 选中/取消选中 起始版本
	$scope.handleCheckVersion = function(item, index) {
		$scope.readyVersionList[index].check = !$scope.readyVersionList[index].check
	}
	// 选择目标版本后列表数据导入表单
	$scope.getFirmwareVersion = function() {
		if ($scope.addForm.firmwareVersion != "") {
			$scope.addForm.targetVersion = $scope.addForm.firmwareVersion;
		}
	}
	// 进入设备选择视图
	$scope.handelSelectDevice = function() {
		if (!$scope.addForm.productKey) {
			alert('请先选择产品型号')
			return false
		} else if (!$scope.addForm.upgradableVersion) {
			alert('请先选择起始版本')
			return false
		} else if (!$scope.addForm.targetVersion) {
			alert('请先选择目标版本')
			return false
		} else if (!$scope.addForm.upgradeWay) {
			alert('请先选择升级方式')
			return false
		} else {
			// $scope.handleSearchDevice()
			$scope.handleDealAllReadyDevice()
			return false
		}
	}
	// 搜索设备列表
	$scope.handleSearchDevice = function() {
		if ($scope.searchDevice == '') {
			alert('请输入待选择SN码，以xxxxx,xxxxx的形式批量查询')
			return false
		}
		var para = {
				batchSnCode: $scope.searchDevice,
				productKey: $scope.addForm.productKey,
				pageNum: 1,
				pageSize: 100000,
				filterSncode: true,
			},
			// api = '/web/api/manage/device/deviceList'
			api = '/web/api/manage/device/batchDeviceList'
		$.ajax({
			type: "get",
			url: api,
			data: para,
			dataType: 'json',
			success: function(res) {
				$scope.readyDeviceList = res.data
				for (var i in $scope.readyDeviceList) {
					$scope.readyDeviceList[i].checked = false
				}
				$scope.handleDealAllReadyDevice()
				$scope.$apply()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 重新选择设备时，处理已选择的设备列表
	$scope.handleDealAllReadyDevice = function() {
		// if ($scope.act == 'edit') {
		// 	var api = '/web/api/manage/firmwareVersionTask/getFirmwareUpgradeDeviceNoPageList',
		// 		para = {
		// 			taskId: $scope.addForm.id,
		// 		}
		// 	$.ajax({
		// 		type: "get",
		// 		url: api,
		// 		data: para,
		// 		dataType: 'json',
		// 		success: function(res) {
		// 			$scope.choseDeviceList = []
		// 			for (var i in res.data) {
		// 				$scope.choseDeviceList.push({
		// 					productKey: res.data[i].productKey,
		// 					deviceName: res.data[i].deviceName,
		// 					sncode: res.data[i].sncode,
		// 					deviceId: res.data[i].deviceId,
		// 				})
		// 			}
		$scope.choseDeviceDialog = true
		// 			$scope.$apply()
		// 		},
		// 		error: function(err) {
		// 			console.log(err)
		// 		}
		// 	});
		// } else {
		// 	$scope.choseDeviceDialog = true
		// }
	}
	// 选中/取消选中 设备
	$scope.handleCheckDevice = function(item, index) {
		$scope.readyDeviceList[index].checked = !$scope.readyDeviceList[index].checked
	}
	// 获取任务中的设备列表
	$scope.getTaskDeviceList = function(data) {
		var api = '/web/api/manage/firmwareVersionTask/getFirmwareUpgradeDeviceNoPageList',
			para = {
				taskId: data.id,
			}
		$.ajax({
			type: "get",
			url: api,
			data: para,
			dataType: 'json',
			success: function(res) {
				$scope.addForm.deviceList = []
				for (var i = 0, len = res.data.length; i < len; i++) {
					$scope.addForm.deviceList.push({
						productKey: res.data[i].productKey,
						deviceName: res.data[i].deviceName,
						sncode: res.data[i].sncode,
						deviceId: res.data[i].deviceId,
					})
				}
				$scope.addForm.deviceList = JSON.stringify($scope.addForm.deviceList)
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 删除
	$scope.handleDelete = function(item) {
		$scope.act = 'delete'
		$scope.dialogTitle = '删除任务'
		$scope.deleteForm = item
		$scope.dialog = true
	}
	// 停用/启用
	$scope.handleForbidden = function(item) {
		$scope.act = 'forbidden'
		$scope.forbiddenForm = item
		$scope.dialog = true
	}
	// 选择设备以及选择版本的下一步
	$scope.handleNext = function(item) {
		if ($scope.choseDialog) {
			var flag = false
			for (var i in $scope.readyVersionList) {
				if ($scope.readyVersionList[i].check) {
					flag = true
				}
			}
			$scope.addForm.upgradableVersion = ''
			// 将已选择的版本列表按照 字符串排序放入表单
			var count = true
			for (var x = 0; x < $scope.readyVersionList.length; x++) {
				if ($scope.readyVersionList[x].check) {
					if (count) {
						$scope.addForm.upgradableVersion = $scope.addForm.upgradableVersion + $scope.readyVersionList[x].firmwareVersion
						count = false
					} else {
						$scope.addForm.upgradableVersion = $scope.addForm.upgradableVersion + ',' + $scope.readyVersionList[x].firmwareVersion
					}
				}
			}
			$scope.searchVersion = ''
			$scope.choseDialog = false
		} else if ($scope.choseDeviceDialog) {
			if ($scope.choseDeviceList.length == 0) {
				alert('请至少选择一个设备')
				return false
			}
			$scope.addForm.deviceList = []
			for (var i in $scope.choseDeviceList) {
				$scope.addForm.deviceList.push({
					productKey: $scope.choseDeviceList[i].productKey,
					deviceName: $scope.choseDeviceList[i].deviceName,
					sncode: $scope.choseDeviceList[i].sncode,
					deviceId: $scope.choseDeviceList[i].deviceId,
				})
			}
			$scope.addForm.deviceList = JSON.stringify($scope.addForm.deviceList)
			$scope.dialog = false
			$scope.handleSubmit()
		}
	}
	// 提交表单
	$scope.handleSubmit = function(item) {
		// 停用启用模式
		if ($scope.act == 'forbidden') {
			var api = 'web/api/manage/firmwareVersionTask/forbidden',
				para = {
					id: $scope.forbiddenForm.id,
					status: $scope.forbiddenForm.status == 1 ? 0 : 1
				},
				msg = $scope.forbiddenForm.status == 1 ? '停用成功！' : '启用成功！'
		}
		// 删除模式
		else if ($scope.act == 'delete') {
			var api = '/web/api/manage/firmwareVersionTask/delete',
				para = {
					id: $scope.deleteForm.id,
				},
				msg = '删除成功！'
		}
		// 查看模式
		else if ($scope.act == 'showDeviceList') {
			$scope.handleCancel()
			return true
		}
		// 增加模式
		else if ($scope.act == 'add') {
			if (!$scope.addForm.productModel) {
				alert('请先选择产品型号')
				return false
			} else if (!$scope.addForm.typeName) {
				alert('请先选择任务类型')
				return false
			} else if (!$scope.addForm.upgradableVersion) {
				alert('请先选择起始版本')
				return false
			} else if (!$scope.addForm.targetVersion) {
				alert('请先选择目标版本')
				return false
			} else if (!$scope.addForm.upgradeWay) {
				alert('请先选择升级方式')
				return false
			} else if ($scope.addForm.upgradeAll == "2" && $scope.addForm.deviceList.length < 1) {
				alert('请先选择目标设备')
				return false
			} else {
				$scope.addForm.type = $scope.addForm.typeName == '模组升级' ? '1' : '2'
				var api = '/web/api/manage/firmwareVersionTask/saveFirmwareUpgradeTask',
					para = $scope.addForm,
					msg = '创建成功！'
			}
		} else if ($scope.act == 'edit') {
			var api = '/web/api/manage/firmwareVersionTask/saveFirmwareUpgradeTask',
				para = $scope.addForm,
				msg = '编辑成功！'
			// delete para.type
		}
		$.ajax({
			type: "post",
			url: api,
			data: para,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert(msg)
					$scope.getTableList(1, 10, filterReadyForm, true)
				} else {
					alert(res.message)
				}
				$scope.handleCancel()
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	// 关闭弹窗
	$scope.handleCancel = function() {
		if ($scope.choseDialog || $scope.choseDeviceDialog) {
			$scope.choseDialog = false
			$scope.choseDeviceDialog = false
		} else {
			$scope.initFormData()
		}
	}
	// 全选
	$scope.handleChoseDeviceAll = function() {
		for (var i in $scope.readyDeviceList) {
			$scope.readyDeviceList[i].checked = !$scope.checkedAll
		}
		$scope.checkedAll = !$scope.checkedAll
	}
	// 导入选择设备
	$scope.handleInputChoseDevice = function() {
		var flag = false
		for (var i in $scope.readyDeviceList) {
			flag = false
			if ($scope.readyDeviceList[i].checked) {
				if ($scope.choseDeviceList.length != 0) {
					for (var x in $scope.choseDeviceList) {
						if ($scope.choseDeviceList[x].sncode == $scope.readyDeviceList[i].sncode) {
							flag = true
						}
					}
				}
				if (!flag) {
					$scope.choseDeviceList.push($scope.readyDeviceList[i])
				}
			}
		}
	}
	// 从导入设备中删除
	$scope.handleDelDeviceInReady = function(item, index) {
		$scope.choseDeviceList.splice(index, 1)
	}
	// 页面初始化
	$scope.getTableList(1, 10, $scope.filterForm, true)
	$scope.initFormData()
})

// 固件版本
app.controller('firmwareVersionC', function($scope, $http, $location, $rootScope) {
	//获取产品类型
	$scope.uploadInst = null
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
				$scope.newForm.typeName = $scope.newForm.type == 1 ? '模组' : '主板'
				$scope.productNameList.forEach(function(msg) {
					if (msg.productKey == res.data.productKey)
						$scope.newForm.productModel = msg.productModel;
				})
				$scope.$apply();
			})
		}
		if (fun == "add") {
			$scope.newForm = {
				fileSize: "",
				crcSign: "",
				productKey: "",
				productModel: "",
				firmwareModel: 2,
				firmwareVersion: "",
				downLoadUrl: "",
				description: "",
				type: '',
				typeName: '',
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
	// 获取列表数据
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
	// 上传固件
	$scope.updataFile = function(a) {
		$.ajax({
			type: "POST",
			url: config.webAPI.address + "common/uploadFile",
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
		$scope.uploadInst = upload.render({
			elem: '#testList',
			accept: 'file',
			multiple: true,
			auto: false,
			choose: function(obj) {
				obj.preview(function(index, file, result) {
					if ($scope.newForm.typeName == '') {
						alert('请先选择固件类型');
						return false
					}
					if (file.name.length > 10 && $scope.newForm.typeName == '主板') {
						alert('主板升级文件名长度请控制在10个以内（文件名包括文件类型以及 . ）!');
						return false;
					}
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
			},
		});
	})
	$scope.save = function() {
		if ($scope.fun == "add" || $scope.fun == "edit") {
			if ($scope.newForm.productName == '') {
				alert("请选择产品类型！")
				return false;
			}
			if ($scope.newForm.typeName == '') {
				alert("请选择固件类型！")
				return false;
			}
			if ($scope.newForm.firmwareModel == '') {
				alert("请选择模块型号！")
				return false;
			}
			if ($scope.newForm.firmwareVersion == '') {
				alert("请填写固件版本！")
				return false;
			}
			if ($scope.newForm.crcSign == '' && $scope.newForm.typeName != '模组') {
				alert("请填写CRC！")
				return false;
			}
			if ($scope.newForm.fileSize == '' && $scope.newForm.typeName != '模组') {
				alert("请填写文件长度！")
				return false;
			}
			if ($scope.newForm.downLoadUrl == '') {
				alert("请上传新固件！")
				return false;
			}
			$scope.productNameList.forEach(function(msg) {
				if (msg.productModel == $scope.newForm.productModel)
					$scope.newForm.productKey = msg.productKey;
			})
			$scope.newForm.type = $scope.newForm.typeName == '模组' ? '1' : '2'
			dataRequest("post", "manage/firmwareVersion/saveFirmwareVersion", $scope.newForm, function(res) {
				if (res.success) {
					if ($scope.fun == "add") {
						alert("新增成功！");
					} else {
						alert("编辑成功！");
					}
					$scope.uploadInst.config.elem.next()[0].value = ''
					$scope.init(1, 10, $scope.form, true);
					$scope.$apply()
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