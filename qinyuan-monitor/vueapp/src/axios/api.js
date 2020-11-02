const api = {
	//管理员登录
	manage_login: "/api/antifake/web/common/v1/login",
	//短信发送
	manage_superAdminVerify: "/api/antifake/web/common/v1/superAdminVerify",
	//修改密码
	manage_updatePassword: "/api/antifake/web/systemManage/accountManage/v1/updatePassword",
	//获取权限树
	manage_tree: "/api/antifake/web/common/v1/getTrees",
	//创建权限url
	manage_addUrl: "/api/antifake/web/common/v1/addUrl",

	//获取工厂下拉框列表
	manage_getFactorys: "/api/antifake/web/common/v1/getFactorys",
	//获取对应工厂厂线下拉列表
	manage_getProductLines: "/api/antifake/web/common/v1/getProductLineList",

	//获取角色下拉框列表
	manage_getRoles: "/api/antifake/web/common/v1/getRoles",

	//获取ERP列表
	manage_getErpCodeList: "/api/antifake/web/common/v1/erpCodeList",

	//获取角色列表
	manage_roleList: "/api/antifake/web/systemManage/roleManage/v1/roleList",
	//新增角色
	manage_createRole: "/api/antifake/web/systemManage/roleManage/v1/createRole",
	//删除角色
	manage_deleteRole: "/api/antifake/web/systemManage/roleManage/v1/deleteRole",
	//启用、禁用角色
	manage_updateRoleStatus: "/api/antifake/web/systemManage/roleManage/v1/updateRoleStatus",
	//编辑角色
	manage_updateRole: "/api/antifake/web/systemManage/roleManage/v1/updateRole",



	//员工列表
	manage_userAccountList: "/api/antifake/web/systemManage/accountManage/v1/userAccountList",
	//新增员工
	manage_createAccount: "/api/antifake/web/systemManage/accountManage/v1/createAccount",
	//启用、禁用员工
	manage_updateUserAccountStatus: "/api/antifake/web/systemManage/accountManage/v1/updateUserAccountStatus",
	//编辑员工
	manage_updateAccount: "/api/antifake/web/systemManage/accountManage/v1/updateUserAccount",
	//删除员工
	manage_deleteAccount: "/api/antifake/web/systemManage/accountManage/v1/deleteAccount",

	//工厂列表
	manage_factoryList: "/api/antifake/web/systemManage/factoryManage/v1/list",
	//工厂列表分页
	manage_factoryManage: "/api/antifake/web/systemManage/factoryManage/v1/page",
	//工厂详情
	manage_factoryDetail: "/api/antifake/web/systemManage/factoryManage/v1/detail",
	//新增工厂
	manage_factoryCreate: "/api/antifake/web/systemManage/factoryManage/v1/create",
	//编辑工厂
	manage_factoryEdit: "/api/antifake/web/systemManage/factoryManage/v1/edit",
	//删除工厂
	manage_factoryDelete: "/api/antifake/web/systemManage/factoryManage/v1/delete",
	//工厂启用禁用
	manage_factoryUpdateStatus: "/api/antifake/web/systemManage/factoryManage/v1/forbidden",

	//分页产线列表
	manage_getProductLinePageList: "/api/antifake/web/systemManage/productLine/v1/getProductLinePageList",
	//产线列表
	manage_getProductLineList: "/api/antifake/web/systemManage/productLine/v1/getProductLineList",
	//产线详情
	manage_getProductLineInfo: "/api/antifake/web/systemManage/productLine/v1/getProductLineInfo",
	//新增产线
	manage_createProductLine: "/api/antifake/web/systemManage/productLine/v1/createProductLine",
	//编辑产线
	manage_editProductLine: "/api/antifake/web/systemManage/productLine/v1/editProductLine",
	//删除产线
	manage_productLineDelete: "/api/antifake/web/systemManage/productLine/v1/deleteProductLine",
	//产线启用禁用
	manage_productLineUpdateStatus: "/api/antifake/web/systemManage/productLine/v1/forbidden",

	//工单复位
	manage_reset: "/api/antifake/web/filterQc/check/v1/reset",

	//成品抽检
	manage_spotCheck: "/api/antifake/web/filterQc/check/v1/spotCheck",
	//成品复位
	manage_filterReset: "/finishedFilter/reset",
	//成品抽检记录
	manage_getSpotCheckRecordPageList: "/api/antifake/web/filterQc/checkRecord/v1/getSpotCheckRecordPageList",

	//滤芯产测
	//任务工单
	manage_getTaskOrderList: "/api/antifake/web/filterQc/taskOrder/v1/getTaskOrderList",
	//工单修改
	manage_editTaskOrder: "/api/antifake/web/filterQc/taskOrder/v1/editTaskOrder",
	//工单新增
	manage_createTaskOrder: "/api/antifake/web/filterQc/taskOrder/v1/createTaskOrder",
	//工单结束
	manage_TaskOrderEnd: "/api/antifake/web/filterQc/taskOrder/v1/end",
	//工单开启
	manage_TaskOrderOpen: "/api/antifake/web/filterQc/taskOrder/v1/open",
	//工单允许重码
	manage_updateRepeatStatus: "/api/antifake/web/filterQc/taskOrder/v1/updateRepeatStatus",
	//工单删除
	manage_deleteTaskOrder: "/api/antifake/web/filterQc/taskOrder/v1/deleteTaskOrder",
	//任务工单详情
	manage_getProductionTaskInfo: "/api/antifake/web/filterQc/taskOrder/v1/getTaskOrderInfo",
	//产测当天完成数
	manage_countTodayCheckRecord: "/api/antifake/web/filterQc/checkRecord/v1/countTodayCheckRecord",
	//生产记录
	manage_record: "/api/antifake/web/filterQc/checkRecord/v1/getCheckRecordPageList",
	//生产记录详情
	manage_getCheckRecordInfo: "/api/antifake/web/filterQc/checkRecord/v1/getCheckRecordInfo",
	//复检生产记录
	manage_getRecheckRecordPageList: "/api/antifake/web/filterQc/checkRecord/v1/getRecheckRecordPageList",
	//滤芯数码检测接口
	manage_reCheckRecord: "/api/antifake/web/filterQc/check/v1/check",
	//滤芯数码复检接口
	manage_recheck: "/api/antifake/web/filterQc/check/v1/recheck",

	//产品列表	
	manage_getErpCodePageList: "/api/antifake/web/systemManage/productManage/v1/getErpCodePageList",
	//ERP同步刷新
	manage_productManage_refresh: "/api/antifake/web/systemManage/productManage/v1/refresh",
	//产品禁用启用
	manage_productForbidden: "/api/antifake/web/systemManage/productManage/v1/forbidden",

	//日志记录
	manage_logList: "/api/antifake/web/systemManage/logRecord/v1/logList",

	//工装列表
	manage_getFrockDevicePageList: "/api/antifake/web/systemManage/machineConfig/v1/getFrockDevicePageList",
	//工装机新增
	manage_machineConfigcreate: "/api/antifake/web/systemManage/machineConfig/v1/create",
	//工装机删除
	manage_machineConfigdelete: "/api/antifake/web/systemManage/machineConfig/v1/delete",
	//工装机编辑
	manage_machineConfigEdit: "/api/antifake/web/systemManage/machineConfig/v1/edit",

}

export default api
