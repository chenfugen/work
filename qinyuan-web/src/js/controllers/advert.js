'use strict';

//广告管理
app.controller('advertManageC', function($scope, $http, $location, $rootScope) {
	//权限处理
	var permission = JSON.parse(sessionStorage.getItem("permission"));
	permission.forEach(function(msg) {
		if (msg.url == "/web/api/manage/advertise/add") {
			$scope.isAdd = msg.checked;
		}
		if (msg.url == "/web/api/manage/advertise/update") {
			$scope.isUpdate = msg.checked;
		}
		if (msg.url == "/web/api/manage/product/detail") {
			$scope.isDetail = msg.checked;
		}
		if (msg.url == "/web/api/manage/advertise/delete") {
			$scope.isDelete = msg.checked;
		}
		if (msg.url == "/web/api/manage/advertise/change") {
			$scope.isChange = msg.checked;
		}
	});
	// 初始化数据
	$scope.btnEdit = ['layui-btn', 'layui-btn-sm', 'layui-btn-normal']
	$scope.btnDelete = ['layui-btn', 'layui-btn-sm', 'layui-btn-danger']
	$scope.btnDisable = ['layui-btn', 'layui-btn-sm', 'layui-btn-disabled']
	$scope.filter = { // 初始化筛选数据
		name: '',
		used: '',
	}
	$scope.form = { // 初始化表单
		name: '',
		content: '',
		link: '',
	}
	// 方法定义
	$scope.initLaypage = function(total, pageSize) { // 翻页控件
		$scope.total = total
		$scope.pageSize = pageSize
		layui.use('laypage', function() {
			var laypage = layui.laypage;
			laypage.render({
				elem: 'advListPage',
				count: total,
				limit: pageSize,
				layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
				jump: function(obj, first) {
					if (!first) {
						$scope.pageNum = obj.curr
						$scope.pageSize = obj.limit
						$scope.getDataList({
							pageNum: obj.curr,
							pageSize: obj.limit
						})
					}
				}
			});
		});
	}
	$scope.getInfoData = function(id) { // 获取详细信息
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_advertise_selectOne,
			data: {
				id: id
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
	$scope.getDataList = function(para, first) { // 获取广告列表
		$.ajax({
			type: "get",
			url: config.webAPI.address + apiConfig.manage_advertise_list,
			data: _extends({}, para, $scope.filter),
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
	$scope.close = function() { // 关闭表单
		$(".layui-layer-shade").hide();
		$scope.dialogStyle = {
			display: 'none',
		}
		$scope.form = {
			name: '',
			content: '',
			link: '',
		}
	}
	$scope.save = function() { // 保存表单
		var para = {}
		var api = ''
		if ($scope.fun == 'stop') {
			para = {
				id: $scope.adverId,
				used: 1,
			}
			var api = apiConfig.manage_advertise_change
			$scope.submit(para, api)
		} else if ($scope.fun == 'start') {
			para = {
				id: $scope.adverId,
				used: 2,
			}
			var api = apiConfig.manage_advertise_change
			$scope.submit(para, api)
		} else if ($scope.fun == 'delete') {
			para = {
				id: $scope.adverId
			}
			var api = apiConfig.manage_advertise_delete
			$scope.submit(para, api)
		} else {
			$scope.submitFile()
		}
	}
	$scope.submit = function(para, api) { // 发送表单(停用/删除)
		$.ajax({
			type: "post",
			url: config.webAPI.address + api,
			data: _extends({}, para),
			async: true,
			dataType: 'json',
			success: function(res) {
				if (res.success) {
					alert('成功！');
					$scope.close();
					$scope.getDataList({
						pageNum: $scope.pageNum,
						pageSize: $scope.pageSize,
					}, true)
				} else {
					alert(res.message);
				}
			},
			error: function(err) {
				console.log(err)
			}
		});
	}
	$scope.submitFile = function() { // 发送表单(编辑/添加)
		var api = $scope.fun == 'edit' ? apiConfig.manage_advertise_update : apiConfig.manage_advertise_add
		var form_edit = document.getElementById('form_edit')
		var formData = new FormData(form_edit);
		if ($scope.fun == 'edit') {
			formData.append('id', $scope.adverId)
		}
		if ($scope.fun == 'add') {
			formData.append('used', 1)
		}
		var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
		if (formData.get('name').length < 1) {
			alert('请输入广告名称!')
		} else if (formData.get('multipartFile').size > 1048576 && $scope.fun == 'add') {
			alert('上传图片超出1M大小!')
		} else if ((formData.get('multipartFile').type != 'image/jpeg' && formData.get('multipartFile').type != 'image/png') && $scope.fun == 'add') {
			alert('图片格式有误,请选择jpg或png格式图片!')
		} else if (formData.get('multipartFile').size < 1 && $scope.fun == 'add') {
			alert('请选择图片!')
		} else if (!reg.test(formData.get('link'))) {
			alert('请输入正确的广告链接!')
		} else {
			$.ajax({
				type: "post",
				cache: false,
				url: config.webAPI.address + api,
				processData: false,
				contentType: false,
				data: formData,
				async: true,
				success: function(res) {
					if (res.success) {
						alert('成功!')
						$scope.close()
						$scope.getDataList({
							pageNum: $scope.pageNum,
							pageSize: $scope.pageSize,
						}, true)
						$scope.form = {
							name: '',
							content: '',
							link: '',
						}
					} else {
						alert(res.message)
					}
				},
				error: function(err) {
					console.log(err)
				}
			});
		}
	}
	$scope.dialog = function(id, fun) { // 弹窗控制
		$scope.fun = fun
		$scope.adverId = id
		if ($scope.fun == 'edit') {
			$scope.getInfoData(id)
			$scope.api = apiConfig.manage_advertise_update
		}
		if ($scope.fun == 'add') {
			$scope.api = apiConfig.manage_advertise_add
		}
		if ($scope.fun == 'edit' || $scope.fun == 'add') {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '600px',
				height: '300px',
				top: '20%',
				left: '50%',
				marginLeft: '-200px',
			}
		} else {
			$scope.dialogStyle = {
				zIndex: 19891015,
				width: '470px',
				height: '150px',
				top: '40%',
				left: '50%',
				marginLeft: '-200px',
			}
		}
		$(".layui-layer-shade").show();
	}
	// 方法调用
	$scope.getDataList({
		pageNum: 1,
		pageSize: 10,
	}, true)
})