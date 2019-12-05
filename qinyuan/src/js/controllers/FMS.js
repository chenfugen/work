'use strict';
app.controller('proDimensionC', function($scope, $http, $location) {
	//获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	$scope.productNameList = JSON.parse(sessionStorage.getItem("productNameList"));
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		if(fun == 'delete') {
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
				maxHeight: '500px',
				height: "auto",
				top: '20%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		if(fun == 'edit') {
			$scope.newForm = id;
			$scope.filters = JSON.parse(id.fmsData);
			$scope.upDown = false;
		}
		if(fun == "showUser") {
			$scope.fmsData = JSON.parse(id);
		}
		if(fun == "delete") {
			$scope.id = id;
		}
		if(fun == "add") {
			$scope.newForm = {
				"provinceId": "",
				"provinceName": "",
				"cityName": "",
				"fmsData": ""
			}
			$scope.newForm.productType='';
			$scope.newForm.productModel='';
			$scope.upDown = true;
			$scope.filters = [{
				"filterName": "filter1",
				"filterFactor": ""
			}, {
				"filterName": "filter2",
				"filterFactor": ""
			}, {
				"filterName": "filter3",
				"filterFactor": ""
			}, {
				"filterName": "filter4",
				"filterFactor": ""
			}, {
				"filterName": "filter5",
				"filterFactor": ""
			}]
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
		$(".layui-form-select .layui-input").blur(function() {
			$scope.upDown = true;
			$scope.$apply();
		})
	}

	$scope.upDown = true;
	$scope.filtetInit = function() {
		if($(".productModel").val() == '' || $(".productModel").val() == undefined) {
			alert("请选择产品型号！")
			return false;
		}
		$scope.upDown = false;
		$scope.productNameList.forEach(function(msg) {
			if($(".productModel").val() == msg.productModel) {
				$scope.productKey = msg.productKey;
			}
		})
		dataRequest("get", "manage/fms/getFilter/product", {
			productKey: $scope.productKey
		}, function(res) {
			if(res.success) {
				if(res.data.filterData) {
					var filters = [];
					for(var i = 0; i < res.data.filterData.length; i++) {
						var obj = {};
						obj.filterName = "filter" + (i + 1);
						obj.filterFactor = "";
						filters.push(obj)
					}
					$scope.filters = filters;
				}
			} else {
				alert(res.message);
				$scope.filters = [];
			}
			$scope.$apply();
		})
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.form = {
		productType: "",
		productModel: "",
	}
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/fms/getFMS/product", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(res) {
			$scope.products = res.data;
			if(d) {
				pageUtils(res.total, "products", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.form, true);
	$scope.save = function() {
		if($scope.fun == "add" || $scope.fun == "edit") {
			if($scope.newForm.productType == '' || $scope.newForm.productType == undefined) {
				alert("请选择产品类型！")
				return false;
			}
			$scope.newForm.productModel = $(".productModel").val();
			if($scope.newForm.productModel == '' || $scope.newForm.productModel == undefined) {
				alert("请选择产品型号！")
				return false;
			}
			var re = /^\d{1,2}$|^\d{1,2}[.]\d{1}$|(\-|\+)?\d{0.1}$|^(\-|\+)?\d{0,1}[.]\d{1}$/;
			for(var i = 0; i < $scope.filters.length; i++) {
				if($scope.filters[i].filterFactor == "" || $scope.filters[i].filterFactor == undefined) {
					alert("请填写滤芯" + (i + 1) + "系数！")
					return false;
				}
				if(!re.test($scope.filters[i].filterFactor) || $scope.filters[i].filterFactor < 0 || $scope.filters[i].filterFactor > 25) {
					alert("滤芯" + (i + 1) + "请填写0~25且精确为0.1的滤芯系数！")
					return false;
				}
			}
		}
		if($scope.fun == "add") {
			$scope.newForm.fmsData = JSON.stringify($scope.filters);
			dataRequest("post", "manage/fms/addFMS/product", $scope.newForm, function(res) {
				if(res.success) {
					alert("新增成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else if($scope.fun == "delete") {
			dataRequest("post", "manage/fms/delete/product/fmsData", {
				id: $scope.id
			}, function(res) {
				if(res.success) {
					alert("删除成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else {
			dataRequest("post", "manage/fms/update/product/fmsData", {
				id: $scope.newForm.id,
				fmsData: JSON.stringify($scope.filters)
			}, function(res) {
				if(res.success) {
					alert("编辑成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		}
	}

})
app.controller('regionAmendC', function($scope, $http, $location) {
	//获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	dataRequest("get", "common/getAreaInfo/list", "", function(msg) {
		$scope.provinceList = msg.data;
		$scope.$apply();
	})
	$scope.selectCity = function(str, e) {
		if(str != "") {
			if(e == 1) {
				var provinceList = $scope.provinceList.filter(function(msg) {
					return msg.id == str
				})
			} else {
				var provinceList = $scope.provinceList.filter(function(msg) {
					return msg.province == str
				})
			}
			$scope.cityList = provinceList[0].citys;
		}
	}
	$scope.form = {
		provinceId: "",
		cityId: "",
	}
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		if(fun == 'delete') {
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
				maxHeight: '500px',
				height: "auto",
				top: '20%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		if(fun == 'edit') {
			$scope.newForm = id;
			$scope.filters = JSON.parse(id.fmsData);
		}
		if(fun == "showUser") {
			$scope.fmsData = JSON.parse(id);
		}
		if(fun == "delete") {
			$scope.id = id;
		}
		if(fun == "add") {
			$scope.newForm = {
				"provinceId": "",
				"provinceName": "",
				"cityName": "",
				"fmsData": ""
			}
			$scope.filters = [{
				"filterName": "filter1",
				"filterFactor": ""
			}, {
				"filterName": "filter2",
				"filterFactor": ""
			}, {
				"filterName": "filter3",
				"filterFactor": ""
			}, {
				"filterName": "filter4",
				"filterFactor": ""
			}, {
				"filterName": "filter5",
				"filterFactor": ""
			}]
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/fms/getFMS/area", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(res) {
			$scope.regionList = res.data;
			if(d) {
				pageUtils(res.total, "regionList", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.form, true);
	$scope.save = function() {
		if($scope.fun == "add" || $scope.fun == "edit") {
			if($scope.newForm.provinceName == '' || $scope.newForm.provinceName == undefined) {
				alert("请选择省份！")
				return false;
			}
			if($scope.newForm.cityName == '' || $scope.newForm.cityName == undefined) {
				alert("请选择该省份下的市！")
				return false;
			}
			var re = /^\d{1,2}$|^\d{1,2}[.]\d{1}$|(\-|\+)?\d{0.1}$|^(\-|\+)?\d{0,1}[.]\d{1}$/;
			for(var i = 0; i < $scope.filters.length; i++) {
				if($scope.filters[i].filterFactor == "" || $scope.filters[i].filterFactor == undefined) {
					alert("请填写滤芯" + (i + 1) + "系数！")
					return false;
				}
				if(!re.test($scope.filters[i].filterFactor) || $scope.filters[i].filterFactor < 0 || $scope.filters[i].filterFactor > 25) {
					alert("滤芯" + (i + 1) + "请填写0~25且精确为0.1的滤芯系数！")
					return false;
				}
			}
			$scope.cityList.filter(function(msg) {
				if(msg.name == $scope.newForm.cityName) {
					$scope.newForm.cityId = msg.id;
					$scope.newForm.provinceId = msg.pId;
				}
			})
		}
		if($scope.fun == "add") {
			$scope.newForm.fmsData = JSON.stringify($scope.filters);
			dataRequest("post", "manage/fms/addFMS/area", $scope.newForm, function(res) {
				if(res.success) {
					alert("新增成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else if($scope.fun == "delete") {
			dataRequest("post", "manage/fms/delete/area/fmsData", {
				id: $scope.id
			}, function(res) {
				if(res.success) {
					alert("删除成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else {
			dataRequest("post", "manage/fms/update/area/fmsData", {
				id: $scope.newForm.id,
				fmsData: JSON.stringify($scope.filters)
			}, function(res) {
				if(res.success) {
					alert("编辑成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		}
	}
})
app.controller('unitAmendC', function($scope, $http, $location) {
	//获取产品类型
	$scope.productTypeList = JSON.parse(sessionStorage.getItem("productType"));
	$scope.form = {
		sncode: "",
		name: "",
	}
	$scope.dialog = function(fun, id) {
		$scope.fun = fun;
		if(fun == 'delete') {
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
				maxHeight: '500px',
				height: "auto",
				top: '20%',
				left: '50%',
				marginLeft: '-200px'
			}
		}
		if(fun == 'edit') {
			$scope.newForm = id;
			$scope.filters = JSON.parse(id.fmsData);
		}
		if(fun == "add") {
			$scope.newForm = {
				"sncode": "",
				"name": "",
				"fmsData": ""
			}
			$scope.filters = [{
				"filterName": "filter1",
				"filterFactor": ""
			}, {
				"filterName": "filter2",
				"filterFactor": ""
			}, {
				"filterName": "filter3",
				"filterFactor": ""
			}, {
				"filterName": "filter4",
				"filterFactor": ""
			}, {
				"filterName": "filter5",
				"filterFactor": ""
			}]
		}
		if(fun == "showUser") {
			$scope.fmsData = JSON.parse(id);
		}
		if(fun == "delete") {
			$scope.id = id;
		}
		$(".layui-layer-shade").show();
		$(".layui-layer").show();
	}
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$(".layui-layer").hide();
	}
	$scope.init = function(a, b, c, d) {
		dataRequest("get", "manage/fms/getFMS/device", _extends({
			pageNum: a,
			pageSize: b,
		}, c), function(res) {
			$scope.dimensionList = res.data;
			if(d) {
				pageUtils(res.total, "dimensionList", function(obj) {
					$scope.init(obj.curr, obj.limit, $scope.form, false);
				})
			}
			$scope.$apply();
		})
	}
	$scope.init(1, 10, $scope.form, true);
	$scope.save = function() {
		if($scope.fun == "add" || $scope.fun == "edit") {
			if($scope.newForm.sncode == '' || $scope.newForm.sncode == undefined) {
				alert("请输入设备SN码！")
				return false;
			}
			if(!/^\d+$/.test($scope.newForm.sncode)) {
				alert("请输入正确的设备SN码！")
				return false;
			}
			if($scope.newForm.name == '' || $scope.newForm.name == undefined) {
				alert("请填写分类名称！")
				return false;
			}
			var re = /^\d{1,2}$|^\d{1,2}[.]\d{1}$|(\-|\+)?\d{0.1}$|^(\-|\+)?\d{0,1}[.]\d{1}$/;
			for(var i = 0; i < $scope.filters.length; i++) {
				if($scope.filters[i].filterFactor == "" || $scope.filters[i].filterFactor == undefined) {
					alert("请填写滤芯" + (i + 1) + "系数！")
					return false;
				}
				if(!re.test($scope.filters[i].filterFactor) || $scope.filters[i].filterFactor < 0 || $scope.filters[i].filterFactor > 25) {
					alert("滤芯" + (i + 1) + "请填写0~25且精确为0.1的滤芯系数！")
					return false;
				}
			}
		}
		if($scope.fun == "add") {
			$scope.newForm.fmsData = JSON.stringify($scope.filters);
			dataRequest("post", "manage/fms/addFMS/device", $scope.newForm, function(res) {
				if(res.success) {
					alert("新增成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else if($scope.fun == "delete") {
			dataRequest("post", "manage/fms/delete/device/fmsData", {
				id: $scope.id
			}, function(res) {
				if(res.success) {
					alert("删除成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		} else {
			dataRequest("post", "manage/fms/update/device/fmsData", {
				id: $scope.newForm.id,
				fmsData: JSON.stringify($scope.filters)
			}, function(res) {
				if(res.success) {
					alert("编辑成功！");
					$scope.init(1, 10, $scope.form, true);
				} else {
					alert(res.message);
				}
			})
			$scope.close();
		}
	}
	$scope.filterNum = function() {
		if($scope.newForm.sncode == "" || $scope.newForm.sncode == undefined) {
			alert("请输入SN码！");
			return false;
		}
		dataRequest("get", "manage/fms/getFilter/device", {
			sncode: $scope.newForm.sncode
		}, function(res) {
			if(res.success) {
				var filters = [];
				for(var i = 0; i < res.data.filterData.length; i++) {
					var obj = {};
					obj.filterName = "filter" + (i + 1);
					obj.filterFactor = "";
					filters.push(obj)
				}
				$scope.filters = filters;			
			} else {
				alert(res.message);
				$scope.filters=[];
			}
			$scope.$apply();
		})
		event.stopPropagation();
	}
})