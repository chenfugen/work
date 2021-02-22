// websorket api地址配置
// let wsApi = {
// 	// 根据不同版本获取（当前为直接获取当前访问地址）
// 	production: 'wss://' + document.location.origin.split('//')[1] + ':18094/ws', // 生产环境api
// 	release: 'wss://' + document.location.origin.split('//')[1] + ':18094/ws', // 测试环境api
// 	development: 'wss://qinyuan-test-h5.yunext.com:18094/ws', // 开发环境api
// }
// 配置api地址（方便紧急api地址修改）
const api = {
	// 通用
	common_getCheckCode: 'common/getCheckCode', // 获取验证码
	common_getPermissionTree: 'common/getPermissionTree', // 获取权限树形结构
	common_upload_file: 'common/upload/file', // 上传文件接口
	common_getFile: 'common/getFile/',
	common_getRoles: 'common/getRoles', // 通用角色列表
	common_getProducts: 'common/getProducts', //通用产品列表
	common_getAddressList: 'common/getAddressList', // 获取地区接口
	common_getAccounts: 'common/getAccounts',
	common_check_userAccountUserName: 'common/check/userAccountUserName', // 校验管理员用户名重复
	//common_getCustomers: 'common/getCustomers', // 获取大客户列表
	common_getOwnProductModel: 'common/getOwnProductModel', // 产品自定义品类数据
	// 管理员接口
	account_login: 'account/login', // 管理员登录
	manage_userAccount_create: 'manage/userAccount/create', // 创建管理员
	manage_userAccount_list: 'manage/userAccount/list', // 管理员列表
	manage_userAccount_forbidden: 'manage/userAccount/forbidden', // 禁用/启用管理员
	manage_userAccount_detail: 'manage/userAccount/detail', // 获取管理员详情
	manage_userAccount_update: 'manage/userAccount/update', // 修改账户信息
	manage_userAccount_delete: 'manage/userAccount/delete', // 删除管理员
	manage_userAccount_update_info: 'manage/userAccount/update/info', // 修改管理员个人信息
	// 角色管理
	manage_role_list: 'manage/role/list', //角色列表
	manage_role_create: 'manage/role/create', //角色列表
	manage_role_update: 'manage/role/update', // 角色编辑
	manage_role_detail: 'manage/role/detail', // 角色详情
	manage_role_delete: 'manage/role/delete', // 角色删除
	manage_role_forbidden: 'manage/role/forbidden', // 禁用/启用角色
	// 日志
	manage_log_list: 'manage/log/list',
	// 产品
	manage_product_update: 'manage/product/update', // 产品编辑
	manage_product_list: 'manage/product/list', // 产品列表
	manage_product_getProduct: 'manage/product/getProduct', // 从IOT拉取产品
	manage_product_detail: 'manage/product/detail', // 产品详情
	manage_product_getChartsData: 'manage/product/getChartsData', // 产品型号统计
	manage_product_property_list: 'manage/product/property/list', // 获取产品类型
	manage_product_update_property: 'manage/product/update/property', //修改产品属性分类
	// 用户
	manage_user_list: 'manage/user/list', //用户列表
	manage_user_detail: 'manage/user/detail', // 用户详情
	manage_user_delete: 'manage/user/delete', //用户删除
	manage_user_getUserDeviceList: 'manage/user/getUserDeviceList', // 用户设备列表
	manage_user_removeUserDevice: 'manage/user/removeUserDevice', //解绑设备
	// 固件
	manage_firmware_list: 'manage/firmware/list', // 固件列表
	manage_firmware_delete: 'manage/firmware/delete', // 固件删除
	manage_firmware_add: 'manage/firmware/add', //新增固件
	// 设备列表
	manage_device_list: 'manage/device/list', // 固件列表
	manage_device_detail: 'manage/device/detail', // 设备详情
	manage_device_getDeviceProperty: 'manage/device/getDeviceProperty', //设备属性获取
	common_setDeviceProperty: 'common/setDeviceProperty', //设置属性
	manage_device_detail_getUserList: 'manage/device/detail/getUserList', //获取设备关联用户列表
	// 故障
	manage_fault_list: 'manage/fault/list',
	// 统计
	manage_fault_deviceFault_data: 'manage/fault/deviceFault/data', // 故障数按照故障名称统计
	manage_fault_data_count: 'manage/fault/data/count', //各类故障统计
	manage_device_getDeviceData_online: 'manage/device/getDeviceData/online', //获取设备在线统计
	manage_device_getDeviceData: 'manage/device/getDeviceData', //获取七天新增设备
	// 数据中心
	manage_dataCenter_deviceData: 'manage/dataCenter/deviceData', // 设备统计数据
	manage_dataCenter_deviceCountData: 'manage/dataCenter/deviceCountData', // 设备地图数据
	manage_dataCenter_userCountData: "manage/dataCenter/userCountData", // 用户地图数据
	manage_dataCenter_tdsData: 'manage/dataCenter/tdsData', // 水质地图

	// 产测平台
	manage_qc_product_list: 'manage/qc/product/list', // 产测管理/产品列表
	manage_qc_product_aliProperty: 'manage/qc/product/aliProperty', // 产测管理/产品列表/同步阿里属性
	manage_qc_product_importJson: 'manage/qc/product/importJson', // 产测管理/产品列表/导入属性
	manage_qc_product_property: 'manage/qc/product/property', // 产测管理/产品列表/查询产品属性
	manage_qc_product_enable: 'manage/qc/product/enable', // 产测管理/产品列表/启用
	manage_qc_record_list: 'manage/qc/record/list', // 产测管理/产测列表
	manage_qc_record_detail: 'manage/qc/record/detail', // 产测管理/产测列表/产测详情

	// 开能
	manage_customer_create: 'manage/customer/create', // 新增客户接口

	//委托商管理

	//上传微信文件招商信用卡不在身边怎么查有效期
	manage_upload_wechatFile: 'common/upload/wechatFile',		
	//获取故障描述列表
	manage_faultDescription_list: 'common/faultDescription/list', 
	//获取委托商权限模块数据
	manage_getModuleList: 'common/getModuleList', 	
	//获取委托商logo图片
	manage_getLogoImage: 'common/getLogoImage', 
	//查询委托商
	manage_businessPartner_searchPartner: 'manage/businessPartner/search/partner',
	//同步委托商
	manage_businessPartner_partner: 'manage/businessPartner/sync/partner',
	//委托商列表
	manage_businessPartner_list: 'manage/businessPartner/list',
	//委托商详情
	manage_businessPartner_detail: 'manage/businessPartner/detail',
	//设置平台期限
	manage_businessPartner_updateExpireTime: 'manage/businessPartner/update/expireTime',
	//修改用户名
	manage_businessPartner_updateAccountName: 'manage/businessPartner/update/accountName',
	//重置密码
	manage_businessPartner_resetPassword: 'manage/businessPartner/resetPassword',
	//设置自主域名
	manage_businessPartner_setOwnUrl: 'manage/businessPartner/setOwnUrl',
	//更新logo图片
	manage_businessPartner_updateLogo: 'manage/businessPartner/update/logo',
	//委托商绑定产品PK
	manage_businessPartner_bindProduct: 'manage/businessPartner/bindProduct',
	//委托商产品解绑
	manage_businessPartner_unbindProduct: 'manage/businessPartner/unbindProduct',
	//委托商设置推送开关（全开/关）
	manage_businessPartner_setting: 'manage/businessPartner/push/setting',
	//委托商设置推送开关（单产品）
	manage_businessPartner_enable: 'manage/businessPartner/push/enable',
	//新增委托商微信账户
	manage_businessPartner_createWechatAccount: 'manage/businessPartner/createWechatAccount',
	//获取委托商微信账户
	manage_businessPartner_getWechatAccount: 'manage/businessPartner/getWechatAccount',
	//获取委托商推送设置
	manage_businessPartner_getPushDetailSetting: 'manage/businessPartner/getPushDetailSetting',
	//委托商产品推送设置
	manage_businessPartner_pushSetting: 'manage/businessPartner/push/detail/setting',
	//委托商绑定设备
	manage_businessPartner_bindDevice: 'manage/businessPartner/bindDevice',
	//解绑委托商设备
	manage_businessPartner_unbindDevice: 'manage/businessPartner/unbindDevice',
	//设置委托商模块权限
	manage_businessPartner_setModules: 'manage/businessPartner/setModules',
	//委托商未绑定产品列表
	manage_businessPartner_bindProductList: 'common/partner/bindProductList',
	//设置委托商微信H5地址
	manage_businessPartner_setH5url: 'manage/businessPartner/set/h5url',
	//设置委个人税收2020清算托商微信推送模板
	manage_businessPartner_setTemplete: 'manage/businessPartner/set/templete',
	//设置别名
	manage_businessPartner_setAlias:'manage/businessPartner/set/alias',
	//根据别名获取委托商编号
	manage_businessPartner_getPartnerId:'common/getPartnerId',
	//设置微信二维码图片
	manage_businessPartner_setQrImage:'manage/businessPartner/set/qrImage',	
	//设置服务热线及品牌名
	manage_businessPartner_setServicePhone:'manage/businessPartner/set/servicePhone',	
}

export default api
