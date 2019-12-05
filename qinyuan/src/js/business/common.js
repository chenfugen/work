//ajax配置
$.ajaxSetup({
	dataType: "json",
	cache: false,
	headers: { // 默认添加请求头
		"token": getCookie('token')
	},
	beforeSend: function() {
		$('.cover').show();
	},
	complete: function(xhr) {
		$('.cover').hide();
		//token过期，则跳转到登录页面
		if (xhr.responseJSON != undefined) {
			if (xhr.responseJSON.code == 1002) {
				delCookie("token");
				alert('身份验证失败，请重新登录！');
				parent.location.href = 'index.html';
			}
			if (xhr.responseJSON.code == 1001) {
				alert(xhr.responseJSON.message);
				return false;
			}
		}
	},
	error: function(xhr, status, error) {
		$('.cover').hide();
		alert("后台系统错误");
	}
});

var _extends = Object.assign || function(target) {
	for (var i = 1; i < arguments.length; i++) {
		var source = arguments[i];
		for (var key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};

//导出图片
function downImgs(imgPathURL) {
	//如果隐藏IFRAME不存在，则添加
	if (!document.getElementById("IframeReportImg"))
		$("").appendTo("body");
	if (document.all.IframeReportImg.src != imgPathURL) {
		//加载图片
		document.all.IframeReportImg.src = imgPathURL;
	} else {
		//图片直接另存为
		DoSaveAsIMG();
	}
}

function DoSaveAsIMG() {
	if (document.all.IframeReportImg.src != "about:blank")
		document.frames("IframeReportImg").document.execCommand("SaveAs");
}

//获取现在时间
Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
var nowDate = new Date();
var nowTime = nowDate.format("yyyy-MM-dd");

//导出
function toExcel(e) {
	$(".layui-table").table2excel({
		// 不被导出的表格行的CSS class类
		exclude: ".noExl",
		// 导出的Excel文档的名称
		name: "Excel Document Name",
		// Excel文件的名称
		filename: e + nowTime,
		//文件后缀名
		fileext: ".xls",
		//是否排除导出图片
		exclude_img: false,
		//是否排除导出超链接
		exclude_links: false,
		//是否排除导出输入框中的内容
		exclude_inputs: false
	});
}

//ajax请求数据
function dataRequest(method, murl, mdata, success) {
	$.ajax({
		type: method,
		url: config.webAPI.address + murl,
		dataType: "json",
		data: mdata,
		async: true,
		timeout: 20000,
		error: function(data) {
			alert("请求失败");
		},
		success: function(data) {
			success ? success(data) : function() {};
		}
	});
}

//上传图片
function imgUpload(method, murl, mdata, success) {
	$.ajax({
		type: method,
		url: config.webAPI.address + murl,
		data: mdata,
		contentType: false,
		cache: false,
		processData: false,
		success: function(res) {
			success ? success(res) : function() {};
		},
		error: function(err) {
			console.log(err)
		}
	});
}

//分页
function pageUtils(total, name, func) {
	layui.use('laypage', function() {
		var laypage = layui.laypage;
		laypage.render({
			elem: name,
			count: total,
			limits: [10, 20, 30, 40, 50, 60, 70, 80, 90],
			theme: "#1E9FFF",
			layout: ['count', 'prev', 'page', 'next', 'skip', 'limit'],
			jump: function(obj, first) {
				//首次不执行
				if (!first) {
					func ? func(obj) : function() {};
				}
			}
		});
	});
}

//判断是否有权限
function isRoot(a, b, c) {
	if (a == undefined || a) {
		c ? c() : function() {};
	} else {
		alert("抱歉," + b + "暂时没有权限！")
		return false;
	}
}

//权限列表
var module = [{
		"children": [{
				"children": [{
					"name": "新增产品信息",
					"checked": true,
					"url": "/web/api/manage/product/create"
				}, {
					"name": "导出产品",
					"checked": true,
					"url": "/"
				}, {
					"name": "查询产品数量",
					"checked": true,
					"url": "/web/api/manage/product/getCount"
				}, {
					"name": "产品属性详情",
					"checked": true,
					"url": "/web/api/manage/product/getProductPropertiesInfo"
				}, {
					"name": "修改产品信息",
					"checked": true,
					"url": "/web/api/manage/product/update"
				}, {
					"name": "产品信息详情",
					"checked": true,
					"url": "/web/api/manage/product/detail"
				}, {
					"name": "更新产品禁用、启用状态",
					"checked": true,
					"url": "/web/api/manage/product/forbidden"
				}, {
					"name": "产品信息列表",
					"checked": true,
					"url": "/web/api/manage/product/list"
				}],
				"name": "产品列表",
				"checked": true,
				"childId": "productList"
			},
			{
				"children": [{
					"name": "保存自定义属性",
					"checked": true,
					"url": "/web/api/manage/product/properties/save"
				}, {
					"name": "自定义属性列表",
					"checked": true,
					"url": "/web/api/manage/product/properties/list"
				}, {
					"name": "导出自定义属性",
					"checked": true,
					"url": "/"
				}, {
					"name": "删除自定义属性",
					"checked": true,
					"url": "/web/api/manage/product/properties/delete"
				}],
				"name": "自定义属性",
				"checked": true,
				"childId": "definedProperties"
			}
		],
		"name": "产品管理",
		"checked": true,
		"moduleId": "product"
	}, {
		"children": [{
			"children": [{
				"name": "导出设备",
				"checked": true,
				"url": "/"
			}, {
				"name": "设备详情",
				"checked": true,
				"url": "/web/api/manage/device/detail"
			}, {
				"name": "设备详情故障报警列表",
				"checked": true,
				"url": "/web/api/manage/device/detail/deviceError/trend/list"
			}, {
				"name": "设备数量统计",
				"checked": true,
				"url": "/web/api/manage/device/deviceCount"
			}, {
				"name": "解绑分享用户",
				"checked": true,
				"url": "/web/api/manage/device/unbind/shareUser"
			}, {
				"name": "设备列表",
				"checked": true,
				"url": "/web/api/manage/device/list"
			}, {
				"name": "设备详情分享用户列表",
				"checked": true,
				"url": "/web/api/manage/device/detail/shareUser/list"
			}],
			"name": "设备列表",
			"checked": true,
			"childId": "deviceList"
		}, {
			"children": [{
				"name": "报警趋势列表",
				"checked": true,
				"url": "/web/api/manage/device/trend/deviceError/list"
			}, {
				"name": "设备新增、报修新增、故障新增数据统计",
				"checked": true,
				"url": "/web/api/manage/device/trend/deviceCount"
			}, {
				"name": "设备故障数",
				"checked": true,
				"url": "/web/api/manage/device/deviceError/Count"
			}, {
				"name": "设备趋势列表",
				"checked": true,
				"url": "/web/api/manage/device/trend/list"
			}],
			"name": "设备趋势",
			"checked": true,
			"childId": "deviceTrend"
		}, {
			"children": [{
				"name": "水质地图",
				"checked": true,
				"url": "/web/api/manage/device/test"
			}, {
				"name": "水质地图",
				"checked": true,
				"url": "/web/api/manage/device/tds/map"
			}],
			"name": "水质地图",
			"checked": true,
			"childId": "deviceTdsMap"
		}, {
			"children": [{
				"name": "设备地图",
				"checked": true,
				"url": "/web/api/manage/device/map"
			}],
			"name": "设备地图",
			"checked": true,
			"childId": "deviceMap"
		}],
		"name": "设备管理",
		"checked": true,
		"moduleId": "device"
	}, {
		"children": [{
			"children": [{
				"name": "删除故障",
				"checked": true,
				"url": "/web/api/manage/breakdown/deleteDeviceError"
			}, {
				"name": "根据时间查询设备故障总数",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getDeviceCurrentErrorCount"
			}, {
				"name": "查询设备当前故障列表",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getDeviceCurrentErrorList"
			}, {
				"name": "导出故障",
				"checked": true,
				"url": "/"
			}],
			"name": "故障列表",
			"checked": true,
			"childId": "faultList"
		}, {
			"children": [{
				"name": "根据时间查询设备故障总数",
				"checked": true,
				"url": "/web/api/manage/breakdown/getCountOfDeviceError"
			}, {
				"name": "导出故障趋势",
				"checked": true,
				"url": "/"
			}, {
				"name": "查询设备当前故障趋势",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getDeviceCurrentErrorTrent"
			}],
			"name": "故障趋势",
			"checked": true,
			"childId": "faultTrend"
		}, {
			"children": [{
				"name": "删除预处理方案",
				"checked": true,
				"url": "/web/api/manage/breakdown/deletePretreatment"
			}, {
				"name": "新增故障设置",
				"checked": true,
				"url": "/web/api/manage/breakdown/createBreakdown"
			}, {
				"name": "更新预处理方案",
				"checked": true,
				"url": "/web/api/manage/breakdown/updatePretreatment"
			}, {
				"name": "更改故障设置",
				"checked": true,
				"url": "/web/api/manage/breakdown/updateBreakdown"
			}, {
				"name": "故障设置列表",
				"checked": true,
				"url": "/web/api/manage/breakdown/getBreakdownList"
			}, {
				"name": "更新自动故障报修禁用、启用状态",
				"checked": true,
				"url": "/web/api/manage/breakdown/forbidden"
			}, {
				"name": "删除故障设置",
				"checked": true,
				"url": "/web/api/manage/breakdown/deleteBreakdown"
			}, {
				"name": "新增预处理方案",
				"checked": true,
				"url": "/web/api/manage/breakdown/createPretreatment"
			}, {
				"name": "查询故障的预处理方案列表",
				"checked": true,
				"url": "/web/api/manage/breakdown/getPretreatmentList"
			}],
			"name": "故障设置",
			"checked": true,
			"childId": "faultSetUp"
		}, {
			"children": [{
				"name": "设备报修记录",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getBreakdownDealList"
			}, {
				"name": "故障设备报修记录",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getBreakdownAndDealInfo"
			}, {
				"name": "设备报修记录",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getBreakdownDealInfo"
			}],
			"name": "报修记录",
			"checked": true,
			"childId": "faultRepair"
		}, {
			"children": [{
				"name": "查询保养记录",
				"checked": true,
				"url": "/web/api/manage/breakdowns/getBreakdownDealList"
			}],
			"name": "保养记录",
			"checked": true,
			"childId": "faultMaintain"
		}],
		"name": "故障管理",
		"checked": true,
		"moduleId": "fault"
	}, {
		"children": [{
			"children": [{
				"name": "系統消息推送",
				"checked": true,
				"url": "/web/api/manage/messageRecord/systemMessagePush"
			}],
			"name": "即时消息推送",
			"checked": true,
			"childId": "pushMessage"
		}, {
			"children": [{
				"name": "设置消息配置是否启用",
				"checked": true,
				"url": "/web/api/manage/message/updateMessageConfigStatus"
			}, {
				"name": "删除消息配置",
				"checked": true,
				"url": "/web/api/manage/message/deleteMessageConfig"
			}, {
				"name": "保存消息配置",
				"checked": true,
				"url": "/web/api/manage/message/saveMessageConfig"
			}, {
				"name": "导出消息规则设置",
				"checked": true,
				"url": "/"
			}, {
				"name": "获取消息配置列表",
				"checked": true,
				"url": "/web/api/manage/message/getMessageConfigList"
			}],
			"name": "消息规则设置",
			"checked": true,
			"childId": "pushRule"
		}, {
			"children": [{
				"name": "保存消息类型配置",
				"checked": true,
				"url": "/web/api/manage/messageType/saveMessageType"
			}, {
				"name": "消息类型列表",
				"checked": true,
				"url": "/web/api/manage/messageType/getMessageTypeList"
			}, {
				"name": "删除消息类型",
				"checked": true,
				"url": "/web/api/manage/messageType/deleteMessageType"
			}],
			"name": "消息类型设置",
			"checked": true,
			"childId": "setUp"
		}, {
			"children": [{
				"name": "查询消息记录",
				"checked": true,
				"url": "/web/api/manage/messageRecord/getMessageRecordAndUserInfoList"
			}, {
				"name": "删除消息记录",
				"checked": true,
				"url": "/web/api/manage/messageRecord/deleteMessagePushHistory"
			}, {
				"name": "导出消息推送历史",
				"checked": true,
				"url": "/"
			}, {
				"name": "删除消息记录",
				"checked": true,
				"url": "/web/api/manage/messageRecord/deleteMessageRecord"
			}, {
				"name": "查询消息推送历史记录列表",
				"checked": true,
				"url": "/web/api/manage/messageRecord/getMessageHistoryList"
			}, {
				"name": "查询消息列表",
				"checked": true,
				"url": "/web/api/manage/messageRecord/getMessageRecordList"
			}],
			"name": "消息推送历史",
			"checked": true,
			"childId": "messagesList"
		}],
		"name": "消息管理",
		"checked": true,
		"moduleId": "message"
	}, {
		"children": [{
			"children": [{
				"name": "用户设备列表",
				"checked": true,
				"url": "/web/api/manage/user/detail/deviceList"
			}, {
				"name": "用户详情",
				"checked": true,
				"url": "/web/api/manage/user/detail"
			}, {
				"name": "用户被分享设备列表",
				"checked": true,
				"url": "/web/api/manage/user/share/device/list"
			}, {
				"name": "查询用户App使用数量",
				"checked": true,
				"url": "/web/api/manage/user/appCount"
			}, {
				"name": "删除用户",
				"checked": true,
				"url": "/web/api/manage/user/delete"
			}, {
				"name": "用户解绑设备",
				"checked": true,
				"url": "/web/api/manage/user/unbind/device"
			}, {
				"name": "导出用户列表",
				"checked": true,
				"url": "/"
			}, {
				"name": "用户列表",
				"checked": true,
				"url": "/web/api/manage/user/list"
			}],
			"name": "用户列表",
			"checked": true,
			"childId": "userList"
		}, {
			"children": [{
				"name": "查询用户新增数",
				"checked": true,
				"url": "/web/api/manage/user/trend/count"
			}, {
				"name": "导出用户趋势",
				"checked": true,
				"url": "/"
			}, {
				"name": "用户趋势列表",
				"checked": true,
				"url": "/web/api/manage/user/trend/list"
			}],
			"name": "用户趋势",
			"checked": true,
			"childId": "userTrend"
		}],
		"name": "用户管理",
		"checked": true,
		"moduleId": "user"
	}, {
		"children": [{
			"children": [{
				"name": "删除故障日志",
				"checked": true,
				"url": "/web/api/manage/breakdown/deleteHistoryDeviceError"
			}, {
				"name": "导出故障日志",
				"checked": true,
				"url": "/"
			}, {
				"name": "故障日志列表",
				"checked": true,
				"url": "/web/api/manage/breakdown/getBreakdownRecordList"
			}],
			"name": "故障日志",
			"checked": true,
			"childId": "faultLog"
		}, {
			"children": [{
				"name": "导出管理日志",
				"checked": true,
				"url": "/"
			}, {
				"name": "管理后台日志列表",
				"checked": true,
				"url": "/web/api/manage/log/list"
			}, {
				"name": "管理后台操作日志详情",
				"checked": true,
				"url": "/web/api/manage/log/detail"
			}],
			"name": "管理日志",
			"checked": true,
			"childId": "administratorsLog"
		}, {
			"children": [{
				"name": "取水日志列表",
				"checked": true,
				"url": "/web/api/manage/log/water/list"
			}, {
				"name": "取水日志详情",
				"checked": true,
				"url": "/web/api/manage/log/water/detail"
			}, {
				"name": "导出取水日志",
				"checked": true,
				"url": "/"
			}],
			"name": "取水日志",
			"checked": true,
			"childId": "waterIntakeLog"
		}, {
			"children": [{
				"name": "app用户操作日志详情",
				"checked": true,
				"url": "/web/api/manage/log/app/detail"
			}, {
				"name": "导出用户日志",
				"checked": true,
				"url": "/"
			}, {
				"name": "app用户日志列表",
				"checked": true,
				"url": "/web/api/manage/log/app/list"
			}],
			"name": "用户日志",
			"checked": true,
			"childId": "userLog"
		}],
		"name": "日志管理",
		"checked": true,
		"moduleId": "log"
	}, {
		"children": [{
			"children": [{
				"name": "管理后台反馈详情",
				"checked": true,
				"url": "/web/api/manage/feedBack/detail"
			}, {
				"name": "导出意见反馈",
				"checked": true,
				"url": "/"
			}, {
				"name": "管理后台反馈列表",
				"checked": true,
				"url": "/web/api/manage/feedBack/list"
			}, {
				"name": "管理员回复反馈",
				"checked": true,
				"url": "/web/api/manage/feedBack/updateFeedBackFeedContent"
			}],
			"name": "意见反馈",
			"checked": true,
			"childId": "messageFeedback"
		}, {
			"children": [{
				"name": "删除管理员",
				"checked": true,
				"url": "/web/api/manage/userAccount/delete"
			}, {
				"name": "管理员列表",
				"checked": true,
				"url": "/web/api/manage/userAccount/list"
			}, {
				"name": "新增管理员",
				"checked": true,
				"url": "/web/api/manage/userAccount/create"
			}, {
				"name": "管理员个人中心",
				"checked": true,
				"url": "/web/api/manage/userAccount/detail"
			}, {
				"name": "修改管理员信息",
				"checked": true,
				"url": "/web/api/manage/userAccount/update"
			}, {
				"name": "禁用管理员",
				"checked": true,
				"url": "/web/api/manage/userAccount/forbidden"
			}, {
				"name": "重置密码",
				"checked": true,
				"url": "/web/api/manage/userAccount/reset/password"
			}, {
				"name": "启用管理员",
				"checked": true,
				"url": "/web/api/manage/userAccount/used"
			}],
			"name": "系统用户",
			"checked": true,
			"childId": "managerList"
		}, {
			"children": [{
				"name": "修改角色",
				"checked": true,
				"url": "/web/api/manage/role/update"
			}, {
				"name": "新增角色",
				"checked": true,
				"url": "/web/api/manage/role/create"
			}, {
				"name": "角色详情",
				"checked": true,
				"url": "/web/api/manage/role/detail"
			}, {
				"name": "角色列表",
				"checked": true,
				"url": "/web/api/manage/role/list"
			}, {
				"name": "删除角色",
				"checked": true,
				"url": "/web/api/manage/role/delete"
			}],
			"name": "角色管理",
			"checked": true,
			"childId": "roleManage"
		}, {
			"children": [],
			"name": "系统维护",
			"checked": true,
			"childId": "systemMaintenance"
		}],
		"name": "系统管理",
		"checked": true,
		"moduleId": "system"
	}, {
		"children": [{
			"children": [{
				"name": "获取单条广告详情",
				"checked": true,
				"url": "/web/api/manage/advertise/selectOne"
			}, {
				"name": "广告启用停用",
				"checked": true,
				"url": "/web/api/manage/advertise/change"
			}, {
				"name": "编辑广告",
				"checked": true,
				"url": "/web/api/manage/advertise/update"
			}, {
				"name": "广告列表",
				"checked": true,
				"url": "/web/api/manage/advertise/list"
			}, {
				"name": "删除广告",
				"checked": true,
				"url": "/web/api/manage/advertise/delete"
			}, {
				"name": "导出广告",
				"checked": true,
				"url": "/"
			}, {
				"name": "新增广告",
				"checked": true,
				"url": "/web/api/manage/advertise/add"
			}],
			"name": "广告管理",
			"checked": true,
			"childId": "advertManage"
		}],
		"name": "广告管理",
		"checked": true,
		"moduleId": "advertise"
	},
	{
		"children": [{
				"children": [],
				"name": "物联卡管理",
				"checked": true,
				"childId": "cardManage"
			},
			{
				"children": [],
				"name": "操作历史",
				"checked": true,
				"childId": "simCardActHistory"
			}
		],
		"name": "流量卡管理",
		"checked": true,
		"moduleId": "netWorkManage"
	}, {
		"children": [{
			"children": [{
				"name": "上传app文件",
				"checked": true,
				"url": "/web/api/manage/upgrade/upload/apk"
			}, {
				"name": "创建app升级记录",
				"checked": true,
				"url": "/web/api/manage/upgrade/create/appVersion"
			}, {
				"name": "删除app升级记录",
				"checked": true,
				"url": "/web/api/manage/upgrade/delete/appVersion"
			}, {
				"name": "app升级版本列表",
				"checked": true,
				"url": "/web/api/manage/upgrade/list"
			}],
			"name": "app升级",
			"checked": true,
			"childId": "appUpgrade"
		}],
		"name": "升级更新",
		"checked": true,
		"moduleId": "updateManage"
	},
	{
		"children": [{
			"children": [],
			"name": "升级任务",
			"checked": true,
			"childId": "upgradeTask"
		}, {
			"children": [],
			"name": "固件列表",
			"checked": true,
			"childId": "firmwareVersion"
		}],
		"name": "固件升级",
		"checked": true,
		"moduleId": "firmwareUpgrade"
	}, {
		"children": [{
			"children": [],
			"name": "产品维度",
			"checked": true,
			"childId": "proDimension"
		}, {
			"children": [],
			"name": "地区修正系数",
			"checked": true,
			"childId": "regionAmend"
		}, {
			"children": [],
			"name": "个体修正系数",
			"checked": true,
			"childId": "unitAmend"
		}],
		"name": "FMS管理",
		"checked": true,
		"moduleId": "FMSManage"
	}
];