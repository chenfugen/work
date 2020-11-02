const api = {
	//管理员登录
	manage_login: "/api/antifakeManage/web/common/v1/login",
	//短信发送
	manage_superAdminVerify: "/api/antifakeManage/web/common/v1/superAdminVerify",
	//修改密码
	manage_updatePassword: "/api/antifakeManage/web/systemManage/accountManage/v1/updatePassword",
	//获取权限树
	manage_tree: "/api/antifakeManage/web/common/v1/getTrees",
	//创建权限url
	manage_addUrl: "/api/antifake/web/common/v1/addUrl",
    
	//erp列表
	manage_getErpCodeList:"/api/antifakeManage/web/common/v1/getErpCodeList",
	
	//获取角色下拉框列表
	manage_getRoles: "/api/antifakeManage/web/common/v1/getRoles",

	//获取产品列表
	manage_getProductList: "/api/antifakeManage/web/common/v1/getProductList",

	//获取角色列表
	manage_roleList: "/api/antifakeManage/web/systemManage/roleManage/v1/roleList",
	//新增角色
	manage_createRole: "/api/antifakeManage/web/systemManage/roleManage/v1/createRole",
	//删除角色
	manage_deleteRole: "/api/antifakeManage/web/systemManage/roleManage/v1/deleteRole",
	//启用、禁用角色
	manage_updateRoleStatus: "/api/antifakeManage/web/systemManage/roleManage/v1/updateRoleStatus",
	//编辑角色
	manage_updateRole: "/api/antifakeManage/web/systemManage/roleManage/v1/updateRole",
   

	//员工列表
	manage_userAccountList: "/api/antifakeManage/web/systemManage/accountManage/v1/userAccountList",
	//新增员工
	manage_createAccount: "/api/antifakeManage/web/systemManage/accountManage/v1/createAccount",
	//启用、禁用员工
	manage_updateUserAccountStatus: "/api/antifakeManage/web/systemManage/accountManage/v1/updateUserAccountStatus",
	//编辑员工
	manage_updateAccount: "/api/antifakeManage/web/systemManage/accountManage/v1/updateUserAccount",
	//删除员工
	manage_deleteAccount: "/api/antifakeManage/web/systemManage/accountManage/v1/deleteAccount",

	//产品设置列表
	manage_productSet_list: "/api/antifakeManage/web/productManage/product/v1/list",
	//产品设置
	manage_productSet_updateSetting: "/api/antifakeManage/web/productManage/product/v1/updateSetting",
	//产品对应滤芯
	manage_productSet_filters: "/api/antifakeManage/web/productManage/product/v1/filters",
	//产品设置是否禁用
	manage_productSet_updateInUse: "/api/antifakeManage/web/productManage/product/v1/updateInUse",
	//产品设置滤芯安装引导
	manage_productSet_updateFilterInstallGuide: "/api/antifakeManage/web/product/productSet/v1/updateFilterInstallGuide",
	//产品设置蓝牙权限引导
	manage_productSet_updateBluetoothInstallGuide: "/api/antifakeManage/web/product/productSet/v1/updateBluetoothInstallGuide",
	//产品滤芯同步刷新
	manage_product_fresh: "/api/antifakeManage/web/productManage/filter/v1/fresh",
	//产品同步刷新
	manage_productSet_fresh: "/api/antifakeManage/web/productManage/product/v1/fresh",
     //产品配置文件获取
     manage_getGuide :"/api/antifakeManage/web/productManage/product/v1/getGuide",
	//产品配置文件新增/修改
	 manage_guideUpload :"/api/antifakeManage/web/productManage/product/v1/guideUpload",
    //产品配置文件设为默认
	 manage_setDefaultGuide :"/api/antifakeManage/web/productManage/product/v1/setDefaultGuide",
    //获取默认产品配置文件
	 manage_getDefaultGuide :"/api/antifakeManage/web/productManage/product/v1/getDefaultGuide",


	//滤芯iot同步
	manage_iotFilterDefinitionSync: "/api/antifakeManage/web/product/productSet/v1/fresh",
	//产品同步
	manage_productSync: "/api/antifakeManage/web/product/dataSync/v1/productSync",
	//设备同步
	manage_deviceSync: "/api/antifakeManage/web/product/dataSync/v1/deviceSync",

	//设备列表
	manage_device_list: "/api/antifakeManage/web/deviceManage/device/v1/page",
	//设备详情
	manage_device_detail: "/api/antifakeManage/web/deviceManage/device/v1/detail",
	//设备编辑
	manage_device_update: "/api/antifakeManage/web/deviceManage/device/v1/update",
	//设备批量编辑
	manage_device_batchUpdate: "/api/antifakeManage/web/deviceManage/device/v1/batchUpdate",
	//设备删除
	manage_device_delete:"/api/antifakeManage/web/deviceManage/device/v1/delete",
	//同步
	manage_device_fresh:"/api/antifakeManage/web/deviceManage/device/v1/fresh",
	
	//客户服务
	
	//查询单品
	manage_customer_getItem:"/api/antifakeManage/web/product/customerService/v1/getItem",
	//用户列表
	manage_customer_getUserList:"/api/antifakeManage/web/customerManage/user/v1/getUserList",
	//用户-设备
	manage_customer_getUserDeviceList:"/api/antifakeManage/web/customerManage/user/v1/getUserDeviceList",

	//用户编辑次数
	manage_customer_updateUserActivationNumber:"/api/antifakeManage/web/customerManage/user/v1/updateUserActivationNumber",
	
	//用户设备激活状态
	manage_customer_updateDeviceActiveStatus:"/api/antifakeManage/web/customerManage/device/v1/updateDeviceActiveStatus",
	
	//设备-设备列表
	manage_customer_getDeviceList:"/api/antifakeManage/web/customerManage/device/v1/getDeviceList",
	//设备-激活记录
	manage_customer_getDeviceActiveRecordList:"/api/antifakeManage/web/customerManage/device/v1/getDeviceActiveRecordList",
	//设备-创建激活码
	manage_customer_sendDeviceActiveCode:"/api/antifakeManage/web/customerManage/device/v1/sendDeviceActiveCode",

	//滤芯-列表
	manage_customer_getFilterList:"/api/antifakeManage/web/customerManage/filter/v1/getFilterList",
	//滤芯-激活记录
	manage_customer_getFilterActiveRecordList:"/api/antifakeManage/web/customerManage/filter/v1/getFilterActiveRecordList",
	//滤芯-激活码
	manage_customer_sendFilterActiveCode:"/api/antifakeManage/web/customerManage/filter/v1/sendFilterActiveCode",
	//滤芯-增加次数
	manage_customer_addFilterNumber:"/api/antifakeManage/web/customerManage/filter/v1/addFilterNumber",
	//设备-SN设备列表
	manage_customer_getSnDeviceList:"/api/antifakeManage/web/customerManage/device/v1/getSnDeviceList",
		
	
	//数码管理
	//邮件发送数码
	manage_number_send:"/api/antifakeManage/web/number/operation/v1/send",
	//数码下载
	manage_number_download:"/api/antifakeManage/web/number/operation/v1/download",
	//重发邮件
	manage_number_resend:"/api/antifakeManage/web/number/operation/v1/resend",
	//邮件发送列表
	manage_number_list:"/api/antifakeManage/web/number/operation/v1/list",
	//重试
	manage_number_retry:"/api/antifakeManage/web/number/operation/v1/retry",
	//数码列表
	manage_number_getNumberList:"/api/antifakeManage/web/numberManage/number/v1/getNumberList",
	//数码统计
	manage_number_getAllNumberCount:"/api/antifakeManage/web/numberManage/number/v1/getAllNumberCount",
	//数码统计（月日）
	manage_number_getNumberCount:"/api/antifakeManage/web/numberManage/number/v1/getNumberCount",
	//数码配置
	manage_number_addFilterNumberBatch:"/api/antifakeManage/web/numberManage/number/v1/addFilterNumberAndUpdateStatusBatch",
	//滤芯配置
	manage_number_updateFilterErp:"/api/antifakeManage/web/productManage/product/v1/updateFilterErp",
	
	//用户管理
	//用户列表
	manage_user_list:"/api/antifakeManage/web/userManage/userList/v1/list",
	//用户更新
	manage_user_update:"/api/antifakeManage/web/userManage/userList/v1/update",
	//用户删除
	manage_user_delete:"/api/antifakeManage/web/userManage/userList/v1/delete",
	//更新默认可以激活次数
	manage_user_updateDefaultActivationTotalNumber:"/api/antifakeManage/web/userManage/userList/v1/updateDefaultActivationTotalNumber",

    //邮箱管理
	manage_mailManage_list:"/api/antifakeManage/web/systemManage/mailManage/v1/list",
	//新增邮箱
	manage_mailManage_add:"/api/antifakeManage/web/systemManage/mailManage/v1/add",
	//编辑邮箱
	manage_mailManage_edit:"/api/antifakeManage/web/systemManage/mailManage/v1/edit",
	//删除邮箱
	manage_mailManage_delete:"/api/antifakeManage/web/systemManage/mailManage/v1/delete",
    //启用，禁用邮箱
	manage_mailManage_changeStatus:"/api/antifakeManage/web/systemManage/mailManage/v1/changeStatus",
	

	
	//供应商列表
	manage_supplierManage_list:"/api/antifakeManage/web/systemManage/supplierManage/v1/list",
    //编辑供应商
    manage_supplierManage_edit:"/api/antifakeManage/web/systemManage/supplierManage/v1/edit",
	//删除供应商
	manage_supplierManage_delete:"/api/antifakeManage/web/systemManage/supplierManage/v1/delete",
	//启用，禁用供应商
	manage_supplierManage_changeStatus:"/api/antifakeManage/web/systemManage/supplierManage/v1/changeStatus",
	
	//新增供应商
	manage_supplierManage_add:"/api/antifakeManage/web/systemManage/supplierManage/v1/add",

    //系统日志
	manage_log_list:"/api/antifakeManage/web/systemManage/logRecord/v1/logList"
}

export default api
