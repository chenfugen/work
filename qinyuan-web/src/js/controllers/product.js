'use strict';
//产品列表
app.controller('homeC', function($scope, $http, $location, $timeout) {
	//权限处理
	$scope.showPart = true
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/product/create") {
			$scope.isAdd = msg.checked;
		}
		if (msg.url == "/web/api/manage/product/update") {
			$scope.isUpdate = msg.checked;
		}
		if (msg.url == "/web/api/manage/product/detail") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/product/forbidden") {
			$scope.isSwitch = msg.checked;
		}
	})
	var sort = ""; //产品类型选择
	var api = ''
	//进入详情
	$scope.goDetail = function(id) {
		$location.path("/proDetail/" + id);
	}

	//产品统计
	$.get(config.webAPI.address + 'manage/product/getCount', function(res) {
		$scope.productCount = res.data;
		$scope.$apply();
	})
	//获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	//获取列表
	$scope.selProductList = JSON.parse(sessionStorage.getItem("productNameList"));
	//获取入网类型
	$scope.netTypeList = JSON.parse(sessionStorage.getItem("netType"));

	//获取产品列表
	$scope.init = function(h, a, b, c, d, e, f, g) {
		dataRequest("GET", '/manage/product/list', {
			"productModel": h,
			"leaseType": a,
			"productName": b,
			"producType": c,
			"netType": d,
			"pageNum": e,
			"pageSize": f,
		}, function(res) {
			$scope.productList = res.data;
			$scope.$apply();
			if (g) {
				pageUtils(res.total, 'productAll', function(obj) {
					$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, obj.curr, obj.limit, false);
				});
			}

		})
	}
	$scope.init("", "", "", "", "", 1, 10, true);
	//产品类型选择
	$scope.productSort = function(e) {
		sort = e;
		$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, 1, 10, true);
	}
	//产品查询
	$scope.search = function() {
		$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, 1, 10, true);
	}
	//关闭弹窗
	$scope.close = function() {
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.form = {
		resource: 2,
		productName: '',
		erpNum: '',
		productModel: '',
		productType: '',
		netType: '',
		leaseType: ''
	}
	//添加产品
	$scope.addProduct = function() {
		$scope.productKey = "";
		$scope.resource = "";
		$scope.leaseType = "";
		$scope.productModel = ""
		$(".layui-layer-shade").show();
		$(".add").show();
		$scope.save = function() {
			if ($scope.leaseType == "" || $scope.leaseType == undefined) {
				alert("请选择租售类型！");
				return false;
			}
			if ($scope.resource == "" || $scope.resource == undefined) {
				alert("请选择产品来源！");
				return false;
			}
			if ($scope.productModel == "" || $scope.productModel == undefined) {
				alert("请输入产品型号！");
				return false;
			}
			if ($scope.productKey == "" || $scope.productKey == undefined) {
				alert("请输入产品代码！");
				return false;
			}
			if (/^[\u3220-\uFA29]+$/.test($scope.productKey)) {
				alert("请输入非中文代码！");
				return false;
			}
			$scope.close();
			dataRequest("POST", 'manage/product/create', {
				"productKey": $scope.productKey,
				"resource": $scope.resource,
				"leaseType": $scope.leaseType,
				"productModel": $scope.productModel
			}, function(res) {
				if (res.success) {
					alert("获取成功!")
					$timeout(function() {
						$location.path("/productEdit/" + $scope.productKey);
					}, 1);
				} else {
					alert(res.message);
				}
			})
		}
		$scope.add = function() {
			var regC = /[\u4E00-\u9FA5]/g;
			var regx = new RegExp("[a-zA-Z0-9_\u4e00-\u9fa5]+$")
			var num = $scope.form.productName.length + $scope.form.productName.match(regC)
			if (num > 30 || num < 4) {
				alert("产品名称长度需为4～30位（中文算两位）");
				return false;
			}
			if (!regx.test($scope.form.productName)) {
				alert("产品名称需为中文、英文字母、数字、下划线");
				return false;
			}
			if ($scope.form.productName == "" || $scope.form.productName == undefined) {
				alert("请输入产品名称！");
				return false;
			}
			if ($scope.form.erpNum == "" || $scope.form.erpNum == undefined) {
				alert("请输入ERP编码！");
				return false;
			}
			if ($scope.form.productModel == "" || $scope.form.productModel == undefined) {
				alert("请输入产品型号！");
				return false;
			}
			if ($scope.form.productType == "" || $scope.form.productType == undefined) {
				alert("请输入产品类型！");
				return false;
			}
			if ($scope.form.leaseType == "") {
				alert("请选择通信类型！");
				return false;
			}
			if ($scope.form.netType == "") {
				alert("请选择租售类型！");
				return false;
			}
			dataRequest("POST", 'manage/product/createIoTProduct', $scope.form, function(res) {
				if (res.success) {
					alert("新增成功!");
					$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, 1, 10, true);
				} else {
					alert(res.message);
				}
				$scope.close();
			})
		}
	}
	//是否启用开关
	$scope.switch = function(e, q) {
		if (e == 1) {
			$(".title").text("启用");
		} else {
			$(".title").text("禁用");
		}
		$(".layui-layer-shade").show();
		$(".switch").show();
		$scope.save = function() {
			$scope.close();
			dataRequest("POST", 'manage/product/forbidden', {
				"productKey": q,
				"status": e
			}, function(res) {
				if (res.success) {
					if (e == 1) {
						alert("启用成功");
					} else {
						alert("禁用成功");
					}
					$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, 1, 10, true);
				} else {
					alert(res.message);
				}
			})
		}
	}
	//产品编辑
	$scope.edit = function(key) {
		$location.path("/productEdit/" + key);
	}
	//产品刷新
	$scope.refresh = function(key) {
		dataRequest("post", "manage/product/refresh", {
			"productKey": key
		}, function(res) {
			if (res.success) {
				alert("刷新成功");
				$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, 1, 10, false);
			} else {
				alert(res.message);
			}
		})
	}
	// ————————————————————————————————批量操作相关————————————————————————————————
	$scope.handleSubmitProductActAtt = function() {
		api = apiConfig.saveProductBatchOperate
		$scope.productActAttForm.configs = ''
		var list = []
		for (var x = 0; x < $scope.productActAttList.length; x++) {
			list.push($scope.productActAttList[x].id)
		}
		var para = {
			configs: JSON.stringify(list),
			productKey: $scope.productActAttForm.productKey
		}
		console.log(para.configs);
		dataRequest("POST", api, para, function(res) {
			alert(res.message)
			$scope.init($scope.productModel, sort, $scope.productName, $scope.producType, $scope.netType, 1, 10, true);
			$scope.handleCancel()
		})
	}
	$scope.productActListAll = []
	$scope.productActAttList = []
	$scope.productActAttForm = {
		productKey: '',
		configs: '',
	}
	// 添加功能至产品功能表中
	$scope.handleProductAddAtt = function(value) {
		var flag = true
		for (var x = 0; x < $scope.productActAttList.length; x++) {
			if ($scope.productActAttList[x].id == value) {
				$scope.productActAttForm.configs = ''
				alert('该功能已添加')
				flag = false
			}
		}
		if (flag) {
			for (var x = 0; x < $scope.productActListAll.length; x++) {
				if (value === $scope.productActListAll[x].id) {
					$scope.productActAttList.push($scope.productActListAll[x])
				}
			}
		}
	}
	// 删减功能从产品功能表中
	$scope.handleProductSubAtt = function(index) {
		$scope.productActAttList.splice(index, 1)
	}
	// 根据产品获取批量操作列表
	$scope.getActAttByProduct = function(item) {
		$scope.productActAttForm.productKey = item.productKey
		api = apiConfig.getBatchOperateConfigByPK
		var para = {
			productKey: item.productKey
		}
		// 获取所有操作
		dataRequest("GET", api, para, function(res) {
			$scope.productActListAll = res.data
			$scope.$apply()
		})
		api = apiConfig.getProductBatchOperateList
		para = {
			productKey: item.productKey
		}
		// 获取已勾选操作
		dataRequest("GET", api, para, function(res) {
			$scope.productActAttList = res.data
			for (var x = 0; x < $scope.productActAttList.length; x++) {
				$scope.productActAttList[x].id = $scope.productActAttList[x].configId
			}
			$scope.$apply()
			$(".layui-layer-shade").show();
			$(".checkAct").show();
		})
	}

	// 获取批量操作库
	$scope.getActAttList = function(a, b, c, e, f, g) {
		api = apiConfig.getBatchOperateConfigPage
		var para = {
			"productKey": a,
			"operateName": b,
			"status": c,
			"pageNum": e,
			"pageSize": f,
		}
		dataRequest("GET", api, para, function(res) {
			$scope.actAttList = res.data;
			$scope.$apply();
			if (g) {
				pageUtils(res.total, 'actAttPage', function(obj) {
					$scope.getActAttList($scope.actAttFilter.productKey, $scope.actAttFilter.operateName, $scope.actAttFilter.status, obj.curr, obj.limit, false);
				});
			}
		})
	}
	$scope.handleSearchAttList = function() {
		$scope.getActAttList($scope.actAttFilter.productKey, $scope.actAttFilter.operateName, $scope.actAttFilter.status, 1, 10, true);
	}
	// 批量操作表单
	$scope.actAttProductKeys = []
	$scope.actAttForm = {
		productKeys: '',
		operateName: '',
		batchName: '',
		url: '',
	}
	// 编辑批量操作
	$scope.handleEditActAtt = function(item) {
		$scope.dialogTitle = '编辑'
		api = apiConfig.getBatchOperateConfigInfo
		dataRequest("GET", api, {
			id: item.id,
		}, function(res) {
			var list = JSON.parse(res.data.productKeys)
			for (var x = 0; x < list.length; x++) {
				for (var i = 0; i < $scope.selProductList.length; i++) {
					if (list[x] == $scope.selProductList[i].productKey) {
						$scope.actAttProductKeys.push($scope.selProductList[i])
					}
				}
			}
			$scope.actAttForm = {
				productKeys: '',
				operateName: res.data.operateName,
				batchName: res.data.batchName,
				url: res.data.url,
				id: res.data.id
			}
			$scope.$apply()
			$(".layui-layer-shade").show();
			$(".addAtt").show();
		})
	}
	// 禁用批量操作
	$scope.handleForbiddenActAtt = function(flag, item) {
		if (flag) {
			$scope.forbiddenActAtt = {
				id: item.id,
				status: item.status
			}
			$(".layui-layer-shade").show();
			$(".forbiddenActAtt").show();
		} else {
			api = apiConfig.batch_operate_config_forbidden
			dataRequest("POST", api, {
				id: $scope.forbiddenActAtt.id,
				status: $scope.forbiddenActAtt.status == 1 ? 0 : 1
			}, function(res) {
				if (res.success) {
					alert('操作成功')
				} else {
					alert(res.message)
				}
				$scope.getActAttList($scope.actAttFilter.productKey, $scope.actAttFilter.operateName, $scope.actAttFilter.status, 1, 10, true);
				$scope.handleCancel()
			})
		}
	}
	// 删除批量操作
	$scope.handleDeleteActAtt = function(flag, item) {
		if (flag) {
			$scope.deleteActAtt = item.id
			$(".layui-layer-shade").show();
			$(".deleteActAtt").show();
		} else {
			api = apiConfig.batch_operate_config_delete
			var para = {
				id: $scope.deleteActAtt
			}
			dataRequest("POST", api, para, function(res) {
				if (res.success) {
					alert('操作成功')
				} else {
					alert(res.message)
				}
				$scope.getActAttList($scope.actAttFilter.productKey, $scope.actAttFilter.operateName, $scope.actAttFilter.status, 1, 10, true);
				$scope.handleCancel()
			})
		}
	}
	// 查看可操作
	$scope.handleViewProduct = function(item) {
		var list = JSON.parse(item.productKeys)
		for (var x = 0; x < list.length; x++) {
			for (var i = 0; i < $scope.selProductList.length; i++) {
				if (list[x] == $scope.selProductList[i].productKey) {
					$scope.actAttProductKeys.push($scope.selProductList[i])
				}
			}
		}
		$(".layui-layer-shade").show();
		$(".viewProduct").show();
	}
	// 批量操作筛选表单
	$scope.actAttFilter = {
		productKey: '',
		operateName: '',
		status: '',
	}
	// 删除产品列表中某一项
	$scope.handleSubProducts = function(index) {
		$scope.actAttProductKeys.splice(index, 1)
	}
	// 添加产品至列表中
	$scope.handleAddAttProduct = function(value) {
		$scope.dialogTitle = '添加'
		var flag = true
		for (var y = 0; y < $scope.actAttProductKeys.length; y++) {
			if ($scope.actAttProductKeys[y].productKey == value) {
				alert('该产品已添加')
				$scope.actAttForm.productKeys = ''
				flag = false
				break;
			}
		}
		if (flag) {
			for (var x = 0; x < $scope.selProductList.length; x++) {
				if ($scope.selProductList[x].productKey == value) {
					$scope.actAttProductKeys.push($scope.selProductList[x])
				}
			}
		}
	}
	// 提交批量操作表单
	$scope.handleSubmit = function() {
		api = apiConfig.saveBatchOperateConfig
		if ($scope.actAttProductKeys.length < 1) {
			alert('请选择适配产品')
			return false
		} else if ($scope.actAttForm.operateName == '') {
			alert('请填写操作名称')
			return false
		} else if ($scope.actAttForm.url == '') {
			alert('请页面路径')
			return false
		}
		var list = []
		for (var i = 0; i < $scope.actAttProductKeys.length; i++) {
			list.push($scope.actAttProductKeys[i].productKey)
		}
		var para = {
			productKeys: JSON.stringify(list),
			operateName: $scope.actAttForm.operateName,
			url: $scope.actAttForm.url,
			batchName: $scope.actAttForm.batchName
		}
		if ($scope.actAttForm.id) {
			para.id = $scope.actAttForm.id
		}
		dataRequest("POST", api, para, function(res) {
			$scope.getActAttList($scope.actAttFilter.productKey, $scope.actAttFilter.operateName, $scope.actAttFilter.status, 1, 10, true);
			$scope.handleCancel()
		})
	}
	// 取消批量操作表单
	$scope.handleCancel = function() {
		$scope.productActAttList = []
		$scope.productActAttForm = {
			productKey: '',
			configs: '',
		}
		$scope.actAttProductKeys = []
		$scope.actAttForm = {
			productKeys: '',
			operateName: '',
			batchName: '',
			url: '',
		}
		$(".layui-layer-shade").hide();
		$(".deleteActAtt").hide();
		$(".addAtt").hide();
		$(".forbiddenActAtt").hide();
		$(".viewProduct").hide();
		$(".checkAct").hide();
	}
	// 进入批量操作部分
	$scope.handleGoActStore = function() {
		$scope.showPart = !$scope.showPart
		if ($scope.showPart == false) {
			$scope.getActAttList("", "", "", 1, 10, true)
		} else {
			$scope.init("", "", "", "", "", 1, 10, true);
		}
	}
	// 新增批量操作功能
	$scope.handleAddAtt = function() {
		$(".layui-layer-shade").show();
		$(".addAtt").show();
	}
})
//产品增加
app.controller('productAddC', function($scope, $http, $location, $routeParams) {})
//自定义属性
app.controller('addAttributeC', function($scope, $http, $location, $routeParams) {
	//权限处理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/product/properties/save") {
			$scope.isSave = msg.checked;
		}
		if (msg.url == "/web/api/manage/product/properties/delete") {
			$scope.isDelete = msg.checked;
		}
	})
	$scope.init = function(a, b, c, d, e) {
		dataRequest("GET", "manage/product/properties/list", {
			"pageNum": a,
			"pageSize": b,
			"name": c,
			"dataType": d,
		}, function(res) {
			$scope.propertyList = [];
			for (var i in res.data) {
				$scope.propertyList[i] = {}
				$scope.propertyList[i]['attr'] = JSON.parse(res.data[i].properties);
				$scope.propertyList[i]['id'] = res.data[i].id;
			}
			$scope.$apply();
			if (e) {
				pageUtils(res.total, 'attributeList', function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.attributeName, $scope.dataTypes, false);
				});
			}
		})
	}

	//单位获取
	$scope.unitInit = function() {
		dataRequest("get", "common/getUnitInfoList", {}, function(res) {
			$scope.units = res.data;
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.attributeName, $scope.dataTypes, true);
	$scope.unitInit();
	$scope.search = function() {
		$scope.init(1, 10, $scope.attributeName, $scope.dataTypes, true);
	}
	//新增属性
	var i;
	$scope.addEnum = function(e) {
		if (e == undefined) {
			if (isNaN(i)) {
				i = $scope.attrNum.length - 1;
			}
			i++;
			$scope.attrNum.push({
				'name': i,
				'value': ""
			});
		} else {
			if (isNaN(i)) {
				i = $scope.attributes[e].attrNum.length - 1;
			}
			i++;
			$scope.attributes[e].attrNum.push({
				'name': i,
				'value': ""
			});
		}
	}
	$scope.removeEnum = function(e, num) {
		i--;
		if (num == undefined) {
			$scope.attrNum.splice(e, 1);
		} else {
			$scope.attributes[num].attrNum.splice(e, 1);
		}
	}

	//选择数据类型
	$scope.dataType = function(num, e) {
		if (num == 1) {
			$('.arrMsg').hide();
			$scope.property.dataType.specs = {};
			switch ($scope.type) {
				case "int":
					$('.int').show();
					break;
				case "float":
					$('.int').show();
					break;
				case "enum":
					i = 0;
					$scope.attrNum = [{
						'name': 0,
						'value': ""
					}];
					$('.enum').show();
					break;
				case "bool":
					$scope.value1 = 0;
					$scope.value2 = 1;
					$('.bool').show();
					break;
				case "text":
					$('.text').show();
					break;
				case "url":
					$('.url').show();
					break;
				case "struct":
					//初始复合型数组
					$scope.attributes = [{
						"identifier": "",
						"name": "",
						"dataType": {
							"specs": {},
							"type": ""
						}
					}]
					$('.struct').show();
					break;
				default:
					$('.struct').show();
					break;
			}
		} else {
			$scope.attributes[e].dataType.specs = {};
			delete $scope.attributes[e].units;
			$('.setMsg' + e).hide();
			switch ($scope.attributes[e].dataType.type) {
				case "int":
					$('.intType' + e).show();
					break;
				case "float":
					$('.intType' + e).show();
					break;
				case "enum":
					i = 0;
					$scope.attributes[e].attrNum = [{
						'name': 0,
						'value': ""
					}];
					$('.enumType' + e).show();
					break;
				case "bool":
					$scope.value1 = 0;
					$scope.value2 = 1;
					$('.boolType' + e).show();
					break;
				case "text":
					$('.textType' + e).show();
					break;
				case "url":
					$('.urlType' + e).show();
					break;
				default:
					$('.intType' + e).show();
					break;
			}
		}
	}

	//添加复合型数组
	$scope.addSet = function() {
		var obj = {
			"identifier": "",
			"name": "",
			"dataType": {
				"specs": {},
				"type": ""
			}
		};
		$scope.attributes.push(obj);
	}
	$scope.removeSet = function(e) {
		$scope.attributes.splice(e, 1);
	}
	//自定义表单验证
	$scope.jdugeAttr = function() {
		if ($scope.property.addressCode == "" || $scope.property.addressCode == undefined) {
			alert("请填写长度为4的十六进制地址码！")
			return false;
		}
		if (!/^[0-9a-fA-F]+$/.test($scope.property.addressCode) || $scope.property.addressCode.length != 4) {
			alert("请填写长度为4的十六进制地址码！");
			return false;
		}
		if ($scope.property.name == "") {
			alert("请填写属性名称！")
			return false;
		}
		if ($scope.property.identifier == "" || $scope.property.identifier == undefined) {
			alert("请填写标识符！")
			return false;
		}
		var re = /^\w+$/;
		if (!re.test($scope.property.identifier)) {
			alert("请填写数字、英文或包括下划线组成标识符！");
			return false;
		}
		if ($scope.type == "") {
			alert("请选择数据类型！")
			return false;
		}
		$scope.property.dataType.type = $scope.type;
		if ($scope.type == "int" || $scope.type == "float") {
			var re = "",
				hint = "";
			if ($scope.type == "int") {
				re = /^\d+$/;
				hint = "整数的"
			} else {
				re = /^(-?\d+)(\.\d+)?$/;
				hint = "浮点的"
			}
			if (!re.test($scope.min)) {
				alert("请正确输入" + hint + "最小值！")
				return false;
			}
			if (!re.test($scope.max)) {
				alert("请正确输入" + hint + "最大值！")
				return false;
			}
			if (Number($scope.min) >= Number($scope.max)) {
				alert(hint + "最小值不能大于等于最大值")
				return false;
			}
			//if(!re.test($scope.step)) {
			//	alert("请正确输入" + hint + "步长值！")
			//	return false;
			//	}
			if ($scope.unit == "" || $scope.unit == undefined) {
				alert("请选择单位！")
				return false;
			}
			$scope.property.dataType.specs.min = $scope.min;
			$scope.property.dataType.specs.max = $scope.max;
			//$scope.property.dataType.specs.step = $scope.step;
			$scope.property.dataType.specs.unit = $scope.unit.split('(')[1].split(')')[0];
			$scope.property.dataType.specs.unitName = $scope.unit.split('(')[0];
		}
		if ($scope.type == "enum") {
			var attr = {}
			for (var j = 0; j < $scope.attrNum.length; j++) {
				if ($scope.attrNum[j].value == "") {
					alert("请完整填写枚举型属性！")
					return false;
				}
				attr[$scope.attrNum[j].name] = $scope.attrNum[j].value;
			}
			$scope.property.dataType.specs = attr;
		}
		if ($scope.type == "bool") {
			var re = /^[0-9]+.?[0-9]*$/;
			if (re.test($scope.bName1) || re.test($scope.bName2)) {
				alert("布尔值名称不能为数字!");
				return false;
			}
			if ($scope.bName1 == "" || $scope.bName2 == "") {
				alert("请完整填写布尔值名称!");
				return false;
			}
			if ($scope.bName1 == $scope.bName2) {
				alert("请布尔值名称1与名称2不能相同!");
				return false;
			}
			var attr = {};
			attr[$scope.value1] = $scope.bName1;
			attr[$scope.value2] = $scope.bName2;
			$scope.property.dataType.specs = attr;
		}
		if ($scope.type == "text") {
			var r = /^([1-9]\d*|[0]{1,1})$/;
			if (!r.test($scope.length)) {
				alert("请输入正整数字符长度！");
				return false;
			}
			$scope.property.dataType.specs.length = $scope.length;
		}
		if ($scope.type == "url") {
			var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			if ($scope.URL == "") {
				alert("请输入地址");
				return false;
			}
			if (!reg.test($scope.URL)) {
				alert("请输入正确格式的地址！");
				return false;
			}
			$scope.property.dataType.specs.URL = $scope.URL;
		}
		if ($scope.type == "struct") {
			for (var i = 0; i < $scope.attributes.length; i++) {
				if ($scope.attributes[i].name == "") {
					alert("请填写复合型内置的属性名称！")
					return false;
				}
				if ($scope.attributes[i].identifier == "" || $scope.attributes[i].identifier == undefined) {
					alert("请填写复合型内置的标识符！")
					return false;
				}
				var re = /^\w+$/;
				if (!re.test($scope.attributes[i].identifier)) {
					alert("请填写复合型内置的数字、英文或包括下划线组成的标识符！");
					return false;
				}
				if ($scope.attributes[i].dataType.type == "") {
					alert("请选择复合型内置的数据类型！")
					return false;
				}
				if ($scope.attributes[i].dataType.type == "") {
					alert("请选择复合型内置的数据类型！")
					return false;
				}
				if ($scope.attributes[i].dataType.type == "int" || $scope.attributes[i].dataType.type == "float") {
					var re = "",
						hint = "";
					$scope.min = $scope.attributes[i].dataType.specs.min;
					$scope.max = $scope.attributes[i].dataType.specs.max;
					if ($scope.attributes[i].dataType.type == "int") {
						re = /^\d+$/;
						hint = "复合型内置的整数的"
					} else {
						re = /^(-?\d+)(\.\d+)?$/;
						hint = "复合型内置的浮点的"
					}
					if (!re.test($scope.min)) {
						alert("请正确输入" + hint + "最小值！")
						return false;
					}
					if (!re.test($scope.max)) {
						alert("请正确输入" + hint + "最大值！")
						return false;
					}
					if (Number($scope.min) >= Number($scope.max)) {
						alert(hint + "最小值不能大于等于最大值")
						return false;
					}
					if ($scope.attributes[i].units == "" || $scope.attributes[i].units == undefined) {
						alert("请选择复合型内置的单位！")
						return false;
					}
					$scope.attributes[i].dataType.specs.unit = $scope.attributes[i].units.split('(')[1].split(')')[0];
					$scope.attributes[i].dataType.specs.unitName = $scope.attributes[i].units.split('(')[0];
				}
				if ($scope.attributes[i].dataType.type == "enum") {
					var attr = {}
					for (var j = 0; j < $scope.attributes[i].attrNum.length; j++) {
						if ($scope.attributes[i].attrNum[j].value == "") {
							alert("请完整填写复合型内置的枚举型属性！")
							return false;
						}
						attr[$scope.attributes[i].attrNum[j].name] = $scope.attributes[i].attrNum[j].value;
					}
					$scope.attributes[i].dataType.specs = attr;
				}
				if ($scope.attributes[i].dataType.type == "bool") {
					var re = /^[0-9]+.?[0-9]*$/;
					$scope.bName1 = $scope.attributes[i].dataType.specs.bName1;
					$scope.bName2 = $scope.attributes[i].dataType.specs.bName2;
					if (re.test($scope.bName1) || re.test($scope.bName2)) {
						alert("布尔值名称不能为数字!");
						return false;
					}
					if ($scope.bName1 == "" || $scope.bName2 == "") {
						alert("请完整填写布尔值名称!");
						return false;
					}
					if ($scope.bName1 == $scope.bName2) {
						alert("请布尔值名称1与名称2不能相同!");
						return false;
					}
					var attr = {};
					attr[0] = $scope.bName1;
					attr[1] = $scope.bName2;
					$scope.attributes[i].dataType.specs = attr;
				}
				if ($scope.attributes[i].dataType.type == "url") {
					var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
					$scope.URL = $scope.attributes[i].dataType.specs.URL;
					if ($scope.URL == "") {
						alert("请输入复合型内置的地址");
						return false;
					}
					if (!reg.test($scope.URL)) {
						alert("请输入复合型内置的正确格式地址！");
						return false;
					}
				}
				if ($scope.attributes[i].dataType.type == "text") {
					var r = /^([1-9]\d*|[0]{1,1})$/;
					if (!r.test($scope.attributes[i].dataType.specs.length)) {
						alert("请输入复合型内置的正整数字符长度！");
						return false;
					}
				}
			}
			$scope.attributes.forEach(function(msg) {
				if (msg.attrNum) {
					delete msg.attrNum;
				}
				if (msg.units) {
					delete msg.units;
				}
			})
			$scope.property.dataType.specs = $scope.attributes;
		}
		$scope.property.addressNum = $scope.property.addressCode;
		$scope.property.addressCode = parseInt($scope.property.addressCode, 16);
		return true;
	}
	$scope.SaveAttribute = function(a, b, c, d, e) {
		dataRequest("POST", "manage/product/properties/save", {
			"properties": a,
			"id": b,
			"name": d,
			"dataType": e,
		}, function(res) {
			if (res.success) {
				alert(c + "成功!");
				$scope.init(1, 10, $scope.attributeName, $scope.dataTypes, true);
			} else {
				alert(res.message);
				$scope.close();
			}
		})
	}
	//关闭弹框
	$scope.close = function() {
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}

	//新增自定义属性
	$scope.addAttr = function() {
		$scope.property = {
			name: "",
			identifier: "",
			addressCode: "",
			dataType: {
				type: "",
				specs: "",
			}
		};
		//初始复合型数组
		$scope.attributes = [{
			"identifier": "",
			"name": "",
			"dataType": {
				"specs": {},
				"type": ""
			}
		}]
		$('.arrMsg').hide();
		$('.int').show();
		//$scope.step = "";
		$scope.type = "";
		$scope.min = "";
		$scope.max = "";
		$scope.unit = "";
		$scope.length = "";
		$scope.URL = "";
		$scope.bName1 = "";
		$scope.bName2 = "";
		$(".layui-layer-title").text('新增');
		$(".layui-layer-shade").show();
		$(".attribute").show();
		$('.upDown').hide();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".attribute").hide();
		}
		$scope.save = function() {
			if ($scope.jdugeAttr()) {
				$scope.SaveAttribute(JSON.stringify($scope.property), "", "新增", $scope.property.name, $scope.property.dataType.type);
				$scope.close();
			}
		}
	}

	//删除
	$scope.delete = function(e) {
		$(".layui-layer-shade").show();
		$(".delete").show();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".delete").hide();
		}
		$scope.remove = function() {
			dataRequest("POST", "manage/product/properties/delete", {
				"id": e,
			}, function(res) {
				if (res.success) {
					alert("删除成功!");
					$scope.close();
					$scope.init(1, 10, $scope.attributeName, $scope.dataTypes, true);
				} else {
					alert(res.message);
					$scope.close();
				}
			})
		}
	}

	//编辑自定义属性
	$scope.edit = function(res) {
		sessionStorage.setItem("attrs", JSON.stringify(res.attr.dataType.specs));
		$scope.property = res.attr;
		$scope.property.addressCode = res.attr.addressNum;
		$scope.type = $scope.property.dataType.type;
		$('.arrMsg').hide();
		$('.upDown').hide();
		switch ($scope.type) {
			case "int":
				$('.int').show();
				$scope.min = $scope.property.dataType.specs.min;
				$scope.max = $scope.property.dataType.specs.max;
				//$scope.step = $scope.property.dataType.specs.step;
				$scope.unit = $scope.property.dataType.specs.unitName + "(" + $scope.property.dataType.specs.unit + ")";
				$(".layui-select-title input").val($scope.unit);
				break;
			case "float":
				$('.int').show();
				$scope.min = $scope.property.dataType.specs.min;
				$scope.max = $scope.property.dataType.specs.max;
				//$scope.step = $scope.property.dataType.specs.step;
				$scope.unit = $scope.property.dataType.specs.unitName + "(" + $scope.property.dataType.specs.unit + ")";
				$(".layui-select-title input").val($scope.unit);
				break;
			case "enum":
				var enums = [],
					tag = [];
				for (var i in $scope.property.dataType.specs) {
					enums.push(i);
					tag.push($scope.property.dataType.specs[i])
				}
				var attrNum = [];
				for (var i = 0; i < tag.length; i++) {
					attrNum[i] = {};
					attrNum[i].name = enums[i];
					attrNum[i].value = tag[i];
				}
				$scope.attrNum = attrNum;
				$('.enum').show();
				break;
			case "bool":
				$('.bool').show();
				var a = [];
				for (var x in $scope.property.dataType.specs) {
					a.push(x);
				}
				$scope.value1 = a[0];
				$scope.value2 = a[1];
				$scope.bName1 = $scope.property.dataType.specs[0];
				$scope.bName2 = $scope.property.dataType.specs[1];
				break;
			case "text":
				$('.text').show();
				$scope.length = $scope.property.dataType.specs.length;
				break;
			case "url":
				$('.url').show();
				$scope.URL = $scope.property.dataType.specs.URL;
				break;
			case "struct":
				$scope.attributes = $scope.property.dataType.specs;
				$scope.attributes.forEach(function(msg, e) {
					$('.setMsg' + e).hide();
				})
				$('.upDown').show();
				break;
			default:
				$('.int').show();
				break;
		}
		$(".layui-layer-title").text('编辑');
		$(".layui-layer-shade").show();
		$(".attribute").show();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".attribute").hide();
			$scope.property.dataType.specs = JSON.parse(sessionStorage.getItem("attrs"));
		}
		$scope.upDown = function() {
			$scope.attributes.forEach(function(msg, e) {
				$('.setMsg' + e).hide();
				switch (msg.dataType.type) {
					case "int":
						msg.units = msg.dataType.specs.unitName + "(" + msg.dataType.specs.unit + ")";
						$('.intType' + e).show();
						break;
					case "float":
						msg.units = msg.dataType.specs.unitName + "(" + msg.dataType.specs.unit + ")";
						$('.intType' + e).show();
						break;
					case "enum":
						var enums = [],
							tag = [];
						for (var i in msg.dataType.specs) {
							enums.push(i);
							tag.push(msg.dataType.specs[i])
						}
						var attrNum = [];
						for (var i = 0; i < tag.length; i++) {
							attrNum[i] = {};
							attrNum[i].name = enums[i];
							attrNum[i].value = tag[i];
						}
						msg.attrNum = attrNum;
						$('.enumType' + e).show();
						break;
					case "bool":
						$scope.value1 = 0;
						$scope.value2 = 1;
						msg.dataType.specs.bName1 = msg.dataType.specs[0];
						msg.dataType.specs.bName2 = msg.dataType.specs[1];
						$('.boolType' + e).show();
						break;
					case "text":
						$('.textType' + e).show();
						break;
					case "url":
						$('.urlType' + e).show();
						break;
					default:
						$('.intType' + e).show();
						break;
				}
			})
			$('.struct').show();
			$('.upDown').hide();
		}
		$scope.save = function() {
			if ($scope.jdugeAttr()) {
				$scope.SaveAttribute(JSON.stringify($scope.property), res.id, "编辑", $scope.property.name, $scope.property.dataType.type);
				$scope.close();
			}
		}
	}
	$scope.addUnit = false;
	$scope.removeUnit = false;
	$scope.showUnit = function(e) {
		if (e == undefined) {
			$scope.unitName = "";
			$scope.unitSymbol = "";
			$scope.addUnit = !$scope.addUnit;
			$scope.removeUnit = false;
		} else {
			$scope.attributes[e].removeUnit = false;
			if ($scope.attributes[e].addUnit) {
				$scope.attributes[e].addUnit = false;
			} else {
				$scope.attributes[e].addUnit = true;
			}
		}
	}
	$scope.reduceUnit = function(e) {
		if (e == undefined) {
			$scope.unitId = "";
			$scope.addUnit = false;
			$scope.removeUnit = !$scope.removeUnit;
		} else {
			$scope.attributes[e].addUnit = false;
			if ($scope.attributes[e].removeUnit) {
				$scope.attributes[e].removeUnit = false;
			} else {
				$scope.attributes[e].removeUnit = true;
			}
		}
	}

	$scope.addUnits = function(e) {
		if (e != undefined) {
			$scope.unitName = $scope.attributes[e].unitName;
			$scope.unitSymbol = $scope.attributes[e].unitSymbol;
		}
		if ($scope.unitName == "" || $scope.unitName == undefined) {
			alert("请输入中文单位名称!");
			return false;
		}
		var china = /[\u4e00-\u9fa5]/gm;
		if (!china.test($scope.unitName)) {
			alert("请输入正确的单位名称!");
			return false;
		}
		if ($scope.unitSymbol == "" || $scope.unitSymbol == undefined) {
			alert("请输入对应的单位符号!");
			return false;
		}
		dataRequest("POST", "common/create/unitInfo", {
			name: $scope.unitName,
			symbol: $scope.unitSymbol
		}, function(res) {
			if (res.success) {
				alert("添加成功");
				$scope.unitInit();
				if (e != undefined) {
					$scope.attributes[e].dataType.specs.unit = $scope.unitName + "(" + $scope.unitSymbol + ")";
					$scope.attributes[e].unitName == "";
					$scope.attributes[e].unitSymbol == '';
					$scope.attributes[e].addUnit = false;
				} else {
					$scope.unit = $scope.unitName + "(" + $scope.unitSymbol + ")";
					$scope.unitName = "";
					$scope.unitSymbol = "";
					$scope.addUnit = false;
				}
			} else {
				alert(res.message);
			}
		})
	}
	$scope.removeUnits = function(e) {
		if (e != undefined) {
			$scope.unitId = $scope.attributes[e].unitId;
		}
		if ($scope.unitId == "" || $scope.unitId == undefined) {
			alert("请输入要选择删除的单位!");
			return false;
		}
		dataRequest("POST", "common/delete/unitInfo", {
			id: $scope.unitId,
		}, function(res) {
			if (res.success) {
				alert("删除成功");
				$scope.unitInit();
				if (e != undefined) {
					$scope.attributes[e].unitId == "";
					$scope.attributes[e].dataType.specs.unit = "";
				} else {
					$scope.unit = "";
					$scope.unitId = "";
				}
			} else {
				alert(res.message);
			}
		})
	}
})
//产品编辑
app.controller('productEditC', function($scope, $http, $location, $routeParams) {
	$scope.netFile = {}
	$scope.wifiUseFile = {}
	$scope.inputFile = {}
	$scope.scanFile = {}
	$scope.gprsUserFile = {}
	$scope.bindFile = {}
	$scope.flowCorrectionForm = {
		productKey: null,
		waterType: null,
		standardFlow: null,
		minFlow: null,
		maxFlow: null,
		status: null,
	}
	//获取产品配置说明和使用说明
	$scope.initFile = function(count) {
		dataRequest("GET", apiConfig.manage_productFile_getProductFileInfo, {
			"type": count,
			"productKey": $routeParams.productKey
		}, function(res) {
			if (res.data != null && res.data.fileName == null) {
				res.data.fileName = res.data.fileId
			}
			if (res.data == null) {
				res.data = {
					fileId: null,
					type: count,
					fileName: '未配置'
				}
			}
			switch (count) {
				case 1:
					$scope.netFile = res.data
					break;
				case 2:
					$scope.wifiUseFile = res.data
					break;
				case 3:
					$scope.inputFile = res.data
					break;
				case 4:
					$scope.scanFile = res.data
					break;
				case 5:
					$scope.gprsUserFile = res.data
					break;
				default:
					$scope.bindFile = res.data
					break;
			}
			$scope.$apply()
		})
	}
	$scope.productMsg = $routeParams; //路由信息
	//设置自定义 水质/属性/
	$scope.waters = [{
			"name": "优",
			"max": "",
			"min": 0
		},
		{
			"name": "良",
			"max": "",
			"min": ""
		},
		{
			"name": "需要更换",
			"max": "",
			"min": ""
		}
	];
	$scope.filterRelate = {
		tds: 300,
		ntu: 0.5,
		hclo: 0.5,
	};
	$scope.deviceLeaseDebug = {
		deviceLeaseMinutes: "24",
		deviceLeaseNum: ''
	}
	//加载自定义属性
	$scope.initing = function(a, b, c, d, e, f) {
		dataRequest("GET", "manage/product/properties/list", {
			"pageNum": a,
			"pageSize": b,
			"name": c,
			"dataType": d,
		}, function(res) {
			$scope.propertyList = [];
			var result = [];
			if (f != undefined) {
				for (var i = 0; i < res.data.length; i++) {
					result[i] = {};
					result[i]['attr'] = JSON.parse(res.data[i].properties);
					var num = result[i]['attr'].identifier;
					var isRepeated = false;
					for (var j = 0; j < f.length; j++) {
						if (f[j].attr.identifier == num) {
							isRepeated = true;
							break;
						}
					}
					if (!isRepeated) {
						$scope.propertyList.push(result[i]);
					}
				}
			} else {
				for (var i in res.data) {
					$scope.propertyList[i] = {}
					$scope.propertyList[i]['attr'] = JSON.parse(res.data[i].properties);
					$scope.propertyList[i]['isUse'] = false;
				}
			}
			$scope.properts = function(a, b, c) {
				var productAttr = [];
				for (var i = a; i < b; i++) {
					if (c[i] != undefined) {
						productAttr.push(c[i])
					}
				}
				$scope.propertyNum = productAttr;
				$scope.$apply();
			}
			$scope.properts(0, 10, $scope.propertyList);
			if (e) {
				pageUtils($scope.propertyList.length, 'propertyAll', function(obj) {
					$scope.properts((obj.curr - 1) * obj.limit, obj.curr * obj.limit, $scope.propertyList);
				});
			}
		})
	}
	$scope.init = function(a) {
		dataRequest("GET", 'manage/product/detail', {
			"productKey": a
		}, function(res) {
			$scope.product = res.product;
			if ($scope.product.netType != 'NET_GPRS') {
				$scope.initFile(1)
				$scope.initFile(2)
			} else {
				$scope.initFile(3)
				$scope.initFile(4)
				$scope.initFile(5)
				$scope.initFile(6)
			}
			if (res.waterConfig.length > 0) {
				$scope.flowCorrectionForm = res.waterConfig[0]
				$scope.flowCorrectionForm.status = res.waterConfig[0].status == 1 ? true : false
			} else {
				$scope.flowCorrectionForm.status = false
			}
			$scope.filters = res.filterProperties;
			if (res.defineProperties != "") {
				if (res.defineProperties.water) {
					$scope.waters = res.defineProperties.water;
				}
				if (res.defineProperties.filter.length > 0 && res.defineProperties.filter) {
					for (var j = 0; j < $scope.filters.length; j++) {
						for (var i = 0; i < res.defineProperties.filter.length; i++) {
							if ($scope.filters[j].identifier == res.defineProperties.filter[i].identifier) {
								$scope.filters[j] = res.defineProperties.filter[i];
							}
						}
					}
				}
				if (res.defineProperties.filterRelate) {
					$scope.filterRelate = res.defineProperties.filterRelate;
				}
				if (res.defineProperties.deviceLeaseDebug) {
					$scope.deviceLeaseDebug = res.defineProperties.deviceLeaseDebug;
				}
				if (res.defineProperties.propertyList) {
					if (res.defineProperties.propertyList.length > 0 || res.defineProperties.propertyList != "") {
						$scope.definePropertie = res.defineProperties.propertyList;
						$scope.defineProperties = function(a, b, c) {
							var productAttr = [];
							for (var i = a; i < b; i++) {
								if (c[i] != undefined) {
									productAttr.push(c[i])
								}
							}
							$scope.arrList = productAttr;
							$scope.$apply();
						}
						$scope.defineProperties(0, 10, res.defineProperties.propertyList);
						pageUtils(res.defineProperties.propertyList.length, 'arrList', function(obj) {
							$scope.defineProperties((obj.curr - 1) * obj.limit, obj.curr * obj.limit, res.defineProperties.propertyList);
						})
					}
				}
			}
			if (res.product.networkFile) {
				$scope.networkFile = res.product.networkFile.split("getFile")[1].split("/")[1];
			}
			if (res.product.useFile) {
				$scope.useFile = res.product.useFile.split("getFile")[1].split("/")[1];
			}
			$scope.propertieInit = function(a, b, c) {
				var productAttr = [];
				for (var i = a; i < b; i++) {
					if (c[i] != undefined) {
						productAttr.push(c[i])
					}
				}
				$scope.properties = productAttr;
				$scope.$apply();
			}
			$scope.propertieInit(0, 10, res.properties);
			pageUtils(res.properties.length, 'productAll', function(obj) {
				$scope.propertieInit((obj.curr - 1) * obj.limit, obj.curr * obj.limit, res.properties);
			})
		})
	}
	$scope.init($routeParams.productKey);
	//上传文档
	$scope.updataFile = function(a, type) {
		imgUpload("POST", 'manage/productFile/uploadProductFile?type=' + type, a, function(res) {
			if (res.success) {
				alert("上传成功！");
				switch (type) {
					case 1:
						$scope.netFile.fileName = res.data.fileName
						$scope.netFile.fileId = res.data.fileId
						break;
					case 2:
						$scope.wifiUseFile.fileName = res.data.fileName
						$scope.wifiUseFile.fileId = res.data.fileId
						break;
					case 3:
						$scope.inputFile.fileName = res.data.fileName
						$scope.inputFile.fileId = res.data.fileId
						break;
					case 4:
						$scope.scanFile.fileName = res.data.fileName
						$scope.scanFile.fileId = res.data.fileId
						break;
					case 5:
						$scope.gprsUserFile.fileName = res.data.fileName
						$scope.gprsUserFile.fileId = res.data.fileId
						break;
					default:
						$scope.bindFile.fileName = res.data.fileName
						$scope.bindFile.fileId = res.data.fileId
						break;

				}
				$scope.$apply()
				$scope.close();
			} else {
				alert(res.message);
			}
		})
	}
	// wifi配网图片上传
	$("#netFile").uploadView({
		uploadBox: '#productAdd', //设置上传框容器
		allowType: ["gif", "jpeg", "jpg", "bmp", "png"], //允许上传图片的类型
		maxSize: 5, //允许上传图片的最大尺寸，单位M
		success: function(e) {
			var fromData = new FormData();
			var imgMsg = $("#netFile")[0].files[0]
			var imgUrl = URL.createObjectURL(imgMsg);
			fromData.append("file", imgMsg);
			$('.imgUrl').attr('src', imgUrl);
			$('.imgName').text(imgMsg.name);
			$('.imgSize').text(imgMsg.size + "B");
			$(".layui-layer-shade").show();
			$(".addImage").show();
			$scope.close = function() {
				$(".layui-layer-shade").hide();
				$(".addImage").hide();
			}
			$scope.save = function() {
				$scope.updataFile(fromData, 1);
			}
		}
	});
	// wifi使用说明上传
	$("#wifiUseFile").uploadView({
		uploadBox: '#productAdd', //设置上传框容器
		allowType: ["gif", "jpeg", "jpg", "bmp", "png"], //允许上传图片的类型
		maxSize: 5, //允许上传图片的最大尺寸，单位M
		success: function(e) {
			var fromData = new FormData();
			var imgMsg = $("#wifiUseFile")[0].files[0]
			var imgUrl = URL.createObjectURL(imgMsg);
			fromData.append("file", imgMsg);
			$('.imgUrl').attr('src', imgUrl);
			$('.imgName').text(imgMsg.name);
			$('.imgSize').text(imgMsg.size + "B");
			$(".layui-layer-shade").show();
			$(".addImage").show();
			$scope.close = function() {
				$(".layui-layer-shade").hide();
				$(".addImage").hide();
			}
			$scope.save = function() {
				$scope.updataFile(fromData, 2);
			}
		}
	});
	// 2G产品SN输入图片上传
	$("#inputFile").uploadView({
		uploadBox: '#productAdd', //设置上传框容器
		allowType: ["gif", "jpeg", "jpg", "bmp", "png"], //允许上传图片的类型
		maxSize: 5, //允许上传图片的最大尺寸，单位M
		success: function(e) {
			var fromData = new FormData();
			var imgMsg = $("#inputFile")[0].files[0]
			var imgUrl = URL.createObjectURL(imgMsg);
			fromData.append("file", imgMsg);
			$('.imgUrl').attr('src', imgUrl);
			$('.imgName').text(imgMsg.name);
			$('.imgSize').text(imgMsg.size + "B");
			$(".layui-layer-shade").show();
			$(".addImage").show();
			$scope.close = function() {
				$(".layui-layer-shade").hide();
				$(".addImage").hide();
			}
			$scope.save = function() {
				$scope.updataFile(fromData, 3);
			}
		}
	});
	// 2G产品SN扫码图片上传
	$("#scanFile").uploadView({
		uploadBox: '#productAdd', //设置上传框容器
		allowType: ["gif", "jpeg", "jpg", "bmp", "png"], //允许上传图片的类型
		maxSize: 5, //允许上传图片的最大尺寸，单位M
		success: function(e) {
			var fromData = new FormData();
			var imgMsg = $("#scanFile")[0].files[0]
			var imgUrl = URL.createObjectURL(imgMsg);
			fromData.append("file", imgMsg);
			$('.imgUrl').attr('src', imgUrl);
			$('.imgName').text(imgMsg.name);
			$('.imgSize').text(imgMsg.size + "B");
			$(".layui-layer-shade").show();
			$(".addImage").show();
			$scope.close = function() {
				$(".layui-layer-shade").hide();
				$(".addImage").hide();
			}
			$scope.save = function() {
				$scope.updataFile(fromData, 4);
			}
		}
	});
	// 2G使用说明
	$("#gprsUserFile").uploadView({
		uploadBox: '#productAdd', //设置上传框容器
		allowType: ["gif", "jpeg", "jpg", "bmp", "png"], //允许上传图片的类型
		maxSize: 5, //允许上传图片的最大尺寸，单位M
		success: function(e) {
			var fromData = new FormData();
			var imgMsg = $("#gprsUserFile")[0].files[0]
			var imgUrl = URL.createObjectURL(imgMsg);
			fromData.append("file", imgMsg);
			$('.imgUrl').attr('src', imgUrl);
			$('.imgName').text(imgMsg.name);
			$('.imgSize').text(imgMsg.size + "B");
			$(".layui-layer-shade").show();
			$(".addImage").show();
			$scope.close = function() {
				$(".layui-layer-shade").hide();
				$(".addImage").hide();
			}
			$scope.save = function() {
				$scope.updataFile(fromData, 5);
			}
		}
	});
	// 2G绑定说明
	$("#bindFile").uploadView({
		uploadBox: '#bindFile', //设置上传框容器
		allowType: ["gif", "jpeg", "jpg", "bmp", "png"], //允许上传图片的类型
		maxSize: 5, //允许上传图片的最大尺寸，单位M
		success: function(e) {
			var fromData = new FormData();
			var imgMsg = $("#bindFile")[0].files[0]
			var imgUrl = URL.createObjectURL(imgMsg);
			fromData.append("file", imgMsg);
			$('.imgUrl').attr('src', imgUrl);
			$('.imgName').text(imgMsg.name);
			$('.imgSize').text(imgMsg.size + "B");
			$(".layui-layer-shade").show();
			$(".addImage").show();
			$scope.close = function() {
				$(".layui-layer-shade").hide();
				$(".addImage").hide();
			}
			$scope.save = function() {
				$scope.updataFile(fromData, 6);
			}
		}
	});
	// 流量限制
	$scope.submitFlow = function() {
		if ($scope.flowCorrectionForm.minFlow > $scope.flowCorrectionForm.maxFlow) {
			alert('流量上限不能小于流量下限,请重新编辑')
			return false
		} else if ($scope.flowCorrectionForm.standardFlow > $scope.flowCorrectionForm.maxFlow || $scope.flowCorrectionForm.standardFlow < $scope.flowCorrectionForm.minFlow) {
			alert('流量标准不能小于流量下限或大于流量下限 ,请重新编辑')
			return false
		}
		var api = apiConfig.manage_waterConfig_saveWaterCorrectConfig,
			para = {
				"productKey": $routeParams.productKey,
				"waterType": 0,
				'standardFlow': $scope.flowCorrectionForm.standardFlow,
				'minFlow': $scope.flowCorrectionForm.minFlow,
				'maxFlow': $scope.flowCorrectionForm.maxFlow,
				'status': $scope.flowCorrectionForm.status ? 1 : 0,
			}
		if ($scope.flowCorrectionForm.id) {
			para.id = $scope.flowCorrectionForm.id
		}
		dataRequest("POST", api, para, function(res) {
			if (res.success) {
				alert(res.message)
				$scope.init($routeParams.productKey);
			} else {
				alert(res.message);
			}
		})
	}
	//水质编辑
	$scope.fillIn = function(e) {
		var r = /^([1-9]\d*|[0]{1,1})$/;
		if (!r.test($scope.waters[e].max)) {
			$scope.waters[e].max = "";
			$(".err" + e).text("请输入正整数!");
			return false;
		}
		if (e < 2) {
			if ($scope.waters[e].min >= $scope.waters[e].max) {
				$(".err" + e).text(" 最小值必须小于最大值!")
				$scope.waters[e].max = "";
				$scope.waters[e + 1].min = "";
				event.stopPropagation();
				return false;
			} else {
				$(".err" + e).text("");
				$scope.waters[e + 1].min = $scope.waters[e].max - 0 + 1;
				$scope.waters[e].max = parseInt($scope.waters[e].max);
			}
		}
		if (e == 2) {
			if ($scope.waters[e].min >= $scope.waters[e].max) {
				$(".err" + e).text(" 最小值必须小于最大值!")
				$scope.waters[e].max = "";
			} else {
				$(".err" + e).text("");
				$scope.waters[e].max = parseInt($scope.waters[e].max);
			}
		}
	}
	//编辑保存
	$scope.addProduct = function(num) {
		if (num == 2) {
			var r = /^([1-9]\d*|[0]{1,1})$/;
			for (var i = 0; i < $scope.waters.length; i++) {
				if (!r.test($scope.waters[i].min) || !r.test($scope.waters[i].max)) {
					alert("请填写完整的正整数水质参数?");
					return false;
				}
			}
			if ($scope.product.netType != 'NET_WIFI') {
				if ($scope.deviceLeaseDebug.deviceLeaseMinutes == "" || $scope.deviceLeaseDebug.deviceLeaseNum == "" || $scope.deviceLeaseDebug.deviceLeaseNum == undefined) {
					alert("请选择完整的调试时间和次数!");
					return false;
				}
				var reg = /^[1-9]+\d*$/;
				if (!reg.test($scope.deviceLeaseDebug.deviceLeaseNum)) {
					alert("调试次数请填写大于零的正整数!");
					return false;
				}
				if ($scope.filterRelate.tds < 0 || $scope.filterRelate.tds > 800 || $scope.filterRelate.tds == undefined) {
					alert("请填写完整的TDS值,且范围为整数0～800");
					return false;
				}
				if ($scope.filterRelate.ntu < 0 || $scope.filterRelate.ntu > 2.55 || $scope.filterRelate.ntu == undefined) {
					alert("请填写完整的浊度值,且范围为0～2.55");
					return false;
				}
				if ($scope.filterRelate.hclo < 0 || $scope.filterRelate.hclo > 2.55 || $scope.filterRelate.hclo == undefined) {
					alert("请填写完整的余氯值,且范围为0～2.55");
					return false;
				}
			}
			var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
			for (var i = 0; i < $scope.filters.length; i++) {
				if ($scope.filters[i].name == "" || $scope.filters[i].name == undefined) {
					alert("滤芯" + (i + 1) + "的名称不能为空！");
					return false;
				}
				if ($scope.filters[i].desc == "" || $scope.filters[i].desc == undefined) {
					alert("滤芯" + (i + 1) + "的描述不能为空！");
					return false;
				}
				//				if($scope.filters[i].url != undefined) {
				//					if(!reg.test($scope.filters[i].url)) {
				//						alert("滤芯" + (i + 1) + "请输入正确的购买地址！");
				//						return false;
				//					}
				//				}
			}
		}
		$scope.attributes = {
			"filter": $scope.filters,
			"water": $scope.waters,
			"propertyList": $scope.definePropertie,
			"filterRelate": $scope.filterRelate,
			"deviceLeaseDebug": $scope.deviceLeaseDebug,
		}
		$scope.leaseType = $scope.product.leaseType == "售卖" ? "1" : "2";
		dataRequest("POST", 'manage/product/update', {
			"productKey": $routeParams.productKey,
			"erpNum": "",
			"leaseType": $scope.leaseType,
			"definedMsg": JSON.stringify($scope.attributes),
			"productModel": "",
		}, function(res) {
			if (res.success) {
				alert("编辑成功！")
				$scope.init($routeParams.productKey);
			} else {
				alert(res.message);
			}
		})
	}
	//保存文档配置编辑
	$scope.fileSave = function() {
		var para = {
			fileInfo: [],
			productKey: $scope.product.productKey
		}
		if ($scope.product.netType == 'NET_GPRS') {
			if ($scope.inputFile.fileId) {
				para.fileInfo.push({
					type: 3,
					fileId: $scope.inputFile.fileId
				})
			}
			if ($scope.scanFile.fileId) {
				para.fileInfo.push({
					type: 4,
					fileId: $scope.scanFile.fileId
				})

			}
			if ($scope.gprsUserFile.fileId) {
				para.fileInfo.push({
					type: 5,
					fileId: $scope.gprsUserFile.fileId
				})
			}
			if ($scope.bindFile.fileId) {
				para.fileInfo.push({
					type: 6,
					fileId: $scope.bindFile.fileId
				})
			}
		} else {
			if ($scope.netFile.fileId) {
				para.fileInfo.push({
					type: 1,
					fileId: $scope.netFile.fileId
				})
			}
			if ($scope.wifiUseFile.fileId) {
				para.fileInfo.push({
					type: 2,
					fileId: $scope.wifiUseFile.fileId
				})
			}
		}
		para.fileInfo = JSON.stringify(para.fileInfo)
		dataRequest("POST", apiConfig.manage_productFile_saveProductFile, para, function(res) {
			if (res.success) {
				alert("编辑成功！")
				$scope.init($routeParams.productKey);
			} else {
				alert(res.message);
			}
			$scope.propertieInit(0, 10, $scope.properties);
		})
	}
	//新增自定义属性
	$scope.addAttr = function() {
		$scope.initing(1, 1000, $scope.attributeName, $scope.dataTypes, true, $scope.definePropertie);
		$(".layui-layer-shade").show();
		$(".addAttr").show();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".addAttr").hide();
		}
		$scope.save = function() {
			for (var i = 0; i < $scope.propertyList.length; i++) {
				if ($scope.propertyList[i].isUse == true) {
					if ($scope.definePropertie == undefined) {
						$scope.definePropertie = []
						$scope.definePropertie.push($scope.propertyList[i]);
					} else {
						$scope.definePropertie.push($scope.propertyList[i]);
					}
				}
			}
			$scope.addProduct();
			$scope.close();
		}
	}
	//删除属性
	$scope.delete = function(identifier) {
		$(".layui-layer-shade").show();
		$(".deleteAttr").show();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".deleteAttr").hide();
		}
		$scope.save = function() {
			$scope.definePropertie = $scope.definePropertie.filter(function(msg) {
				return msg.attr.identifier != identifier
			});
			if ($scope.product.resource == 2) {
				$scope.filters = $scope.filters.filter(function(msg) {
					return msg.identifier != identifier
				})
			}
			$scope.addProduct();
			$scope.close();
		}
	}
	//编辑基本信息
	$scope.editProduct = function() {
		$scope.productModel = $scope.product.productModel;
		$scope.erpNum = $scope.product.erpNum;
		$scope.leaseType = $scope.product.leaseType == "售卖" ? '1' : '2';
		$(".layui-layer-shade").show();
		$(".editProduct").show();
		$scope.close = function() {
			$(".layui-layer-shade").hide();
			$(".editProduct").hide();
		}
		$scope.save = function() {
			if ($scope.productModel == "" || $scope.productModel == undefined) {
				alert("请填写产品型号?");
				return false;
			}
			if ($scope.erpNum == "" || $scope.erpNum == undefined) {
				alert("请填写ERP编码?");
				return false;
			}
			if ($scope.leaseType == "" || $scope.leaseType == undefined) {
				alert("租售类型不能为空?");
				return false;
			}
			if ($scope.productModel == $scope.product.productModel) {
				$scope.productModel = "";
			}
			if ($scope.erpNum == $scope.product.erpNum) {
				$scope.erpNum = "";
			}
			$scope.close();
			dataRequest("POST", 'manage/product/update', {
				"productKey": $routeParams.productKey,
				"erpNum": $scope.erpNum,
				"leaseType": $scope.leaseType,
				"definedMsg": "",
				"productModel": $scope.productModel,
			}, function(res) {
				if (res.success) {
					alert("编辑成功！")
					$scope.init($routeParams.productKey);
				} else {
					alert(res.message);
				}

			})
		}
	}
	$scope.basicAttr = true;
	$scope.selfAttr = true;
	$scope.allocation = true;
	$scope.flowCorrection = true
	$scope.waterTab = true;
	$scope.filterTab = true;
	$scope.packUpList = ['收起', ]
	$scope.packUp = function(e) {
		$scope[e] = !$scope[e]
	}
})
//产品详情
app.controller('proDetailC', function($scope, $http, $location, $routeParams) {
	$scope.netFile = {}
	$scope.wifiUseFile = {}
	$scope.inputFile = {}
	$scope.scanFile = {}
	$scope.gprsUserFile = {}
	$scope.bindFile = {}
	//获取产品列表
	$scope.productNameList = JSON.parse(sessionStorage.getItem("productNameList"));
	$scope.init = function(a) {
		dataRequest("GET", '/manage/product/detail', {
			"productKey": a,
		}, function(res) {
			$scope.product = res.product;
			if ($scope.product.netType != 'NET_GPRS') {
				$scope.initFile(1)
				$scope.initFile(2)
			} else {
				$scope.initFile(3)
				$scope.initFile(4)
				$scope.initFile(5)
				$scope.initFile(6)
			}
			pageUtils(res.properties.length, 'productAll', function(obj) {
				$scope.propertieInit((obj.curr - 1) * obj.limit, obj.curr * obj.limit);
			})
			$scope.filters = res.filterProperties;
			$scope.waterConfig = res.waterConfig[0]
			if (res.defineProperties) {
				if (res.defineProperties.water) {
					$scope.waters = res.defineProperties.water;
				}
				if (res.defineProperties.filterRelate) {
					$scope.filterRelate = res.defineProperties.filterRelate;
				}
				if (res.defineProperties.deviceLeaseDebug) {
					$scope.deviceLeaseDebug = res.defineProperties.deviceLeaseDebug;
				}
				if (res.defineProperties.filter.length > 0 && res.defineProperties.filter) {
					for (var j = 0; j < $scope.filters.length; j++) {
						for (var i = 0; i < res.defineProperties.filter.length; i++) {
							if ($scope.filters[j].identifier == res.defineProperties.filter[i].identifier) {
								$scope.filters[j] = res.defineProperties.filter[i];
							}
						}
					}
				}
				$scope.propertyInit = function(a, b, c) {
					var productAttr = [];
					for (var i = a; i < b; i++) {
						if (c[i] != undefined && c[i].isUse) {
							productAttr.push(c[i])
						}
					}
					$scope.propertyList = productAttr;
					$scope.$apply();
				}
				if (res.defineProperties.propertyList) {
					$scope.propertyInit(0, 10, res.defineProperties.propertyList);
					pageUtils(res.defineProperties.propertyList.length, 'propertyAll', function(obj) {
						$scope.propertyInit((obj.curr - 1) * obj.limit, obj.curr * obj.limit, res.defineProperties.propertyList);
					})
				}
			}
			$scope.networkFile = res.product.networkFile;
			$scope.useFile = res.product.useFile;
			$scope.propertieInit = function(n, m) {
				var productAttr = [];
				for (var i = n; i < m; i++) {
					if (res.properties[i] != undefined) {
						productAttr.push(res.properties[i])
					}
				}
				$scope.properties = productAttr;
				$scope.$apply();
			}
			$scope.propertieInit(0, 10);

			$scope.$apply();
		})
		dataRequest("get", "manage/product/detail/getCount", {
			productKey: a
		}, function(msg) {
			$scope.counts = msg.data;
			$scope.$apply();
		})
	}
	$scope.init($routeParams.id);
	$scope.selectPro = function() {
		$scope.init($scope.productName);
	}
	$scope.edit = function(id) {
		$location.path("/productEdit/" + id);
	}
	$scope.initFile = function(count) {
		dataRequest("GET", apiConfig.manage_productFile_getProductFileInfo, {
			"type": count,
			"productKey": $scope.product.productKey
		}, function(res) {
			if (res.data != null && res.data.fileName == null) {
				res.data.fileName = res.data.fileId
			}
			if (res.data == null) {
				res.data = {
					fileId: null,
					type: count,
					fileName: '未配置'
				}
			}
			switch (count) {
				case 1:
					$scope.netFile = res.data
					$scope.netFile.href = '/web/api/common/getFiles/' + res.data.fileId
					break;
				case 2:
					$scope.wifiUseFile = res.data
					$scope.wifiUseFile.href = '/web/api/common/getFiles/' + res.data.fileId
					break;
				case 3:
					$scope.inputFile = res.data
					$scope.inputFile.href = '/web/api/common/getFiles/' + res.data.fileId
					break;
				case 4:
					$scope.scanFile = res.data
					$scope.scanFile.href = '/web/api/common/getFiles/' + res.data.fileId
					break;
				case 5:
					$scope.gprsUserFile = res.data
					$scope.gprsUserFile.href = '/web/api/common/getFiles/' + res.data.fileId
					break;
				default:
					$scope.bindFile = res.data
					$scope.bindFile.href = '/web/api/common/getFiles/' + res.data.fileId
					break;
			}
			$scope.$apply()
		})
	}
	$scope.basicAttr = true;
	$scope.selfAttr = true;
	$scope.allocation = true;
	$scope.waterTab = true;
	$scope.filterTab = true;
	$scope.flowSet = true;
	$scope.filterRelateTab = true;
	$scope.deBugTab = true;
	// 控制收索框
	$scope.packUp = function(e) {
		$scope[e] = !$scope[e]
	}
	$scope.watchImg = function(href) {
		var newwin = window.open()
		newwin.document.write("<img src=" + href + " />")
	}
})