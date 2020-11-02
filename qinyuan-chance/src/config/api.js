let wsApi = {
	production: 'wss://iot2-dtest.qinyuan.cn:18909/ws',
	release: 'wss://qinyuan-slb.yunext.com:18911/ws',
	development: 'wss://qinyuan-slb.yunext.com:18911/ws',
}
let env = process.env.NODE_ENV
const api = {
	// webSorket 测试地址
	webSorket: wsApi[env],

	// —————————— 通用接口 ——————————
	// 获取图片接口  最后拼接上文件名
	common_getFile: 'common/getFile/',
	// 通过id下载文件  最后拼接上文件名
	common_getFiles_: 'common/getFiles/',
	// 设备列表
	manage_device_list: '/manage/device/list',
	// 设备详情
	manage_device_detail: 'manage/device/detail',
	// 上传固件文件
	common_uploadImg: 'common/uploadImg',
	// 获取文件url 末尾+ fileID
	common_getFile: 'common/getFiles/',
	// 完成设备列表
	manage_device_finishDeviceList: 'manage/device/finishDeviceList',
	// 在线设备列表
	manage_device_onlineDeviceList: 'manage/device/onlineDeviceList',

	// —————————— 产测 ——————————
	// 刷新产品列表(产测开始时调用，用于后台，前端无作用)
	manage_product_refreshProduct: 'manage/product/refreshProduct',
	// 产测历史
	manage_deviceCheckRecord_getDeviceCheckRecordList: 'manage/deviceCheckRecord/getDeviceCheckRecordList',
	// 产测历史详细
	manage_deviceCheckRecord_getDeviceCheckRecordInfo: 'manage/deviceCheckRecord/getDeviceCheckRecordInfo',
	// 检测固件版本
	manage_deviceCheck_checkFirmwareVersion: 'manage/deviceCheck/checkFirmwareVersion',
	// 检测属性
	manage_deviceCheck_checkDeviceProperties: 'manage/deviceCheck/checkDeviceProperties',
	// 秘钥检验
	manage_deviceCheck_checkTriples: 'manage/deviceCheck/checkTriples',
	// 产测完成
	manage_deviceCheck_checkDeviceFinished: 'manage/deviceCheck/checkDeviceFinished',
	// 获取今日产测量
	manage_device_countTodayFinishDevice: 'manage/device/countTodayFinishDevice',
	// 修改产测任务状态
	manage_productionTask_forbidden: 'manage/productionTask/forbidden',

	// —————————— 产测任务 ——————————
	// 删除列表
	manage_productionTask_getProductionTaskList: 'manage/productionTask/getProductionTaskList',
	// 删除任务
	manage_productionTask_deleteProductionTask: 'manage/productionTask/deleteProductionTask',
	// 任务状态修改
	manage_productionTask_forbidden: 'manage/productionTask/forbidden',
	// 任务信息
	manage_productionTask_getProductionTaskInfo: 'manage/productionTask/getProductionTaskInfo',
	// 新建产测任务
	manage_productionTask_saveProductionTask: 'manage/productionTask/saveProductionTask',

	// —————————— 系统接口 ——————————
	// 修改密码
	manage_userAccount_reset_userSelf_password: 'manage/userAccount/reset/userSelf/password',
	// 管理员修改密码
	account_change_password: 'account/change/password',
	// 管理员登陆
	account_login: 'account/login',
	// 管理员登出
	account_logout: 'account/logout',
	// 获取验证码接口
	common_getCheckCode: 'common/getCheckCode',

	// —————————— 固件管理 ——————————
	// 删除固件
	manage_firmwareVersion_deleteFirmwareVersion: '/manage/firmwareVersion/deleteFirmwareVersion',
	// 固件详细
	manage_firmwareVersion_getFirmwareVersionInfo: 'manage/firmwareVersion/getFirmwareVersionInfo',
	// 固件列表
	manage_firmwareVersion_getFirmwareVersionList: 'manage/firmwareVersion/getFirmwareVersionList',
	// 保存固件版本
	manage_firmwareVersion_saveFirmwareVersion: 'manage/firmwareVersion/saveFirmwareVersion',

	// —————————— 系统管理 ——————————
	// 新增管理员
	manage_userAccount_create: 'manage/userAccount/create',
	// 删除管理员
	manage_userAccount_delete: 'manage/userAccount/delete',
	// 管理员个人中心
	manage_userAccount_detail: 'manage/userAccount/detail',
	// 禁用管理员
	manage_userAccount_forbidden: 'manage/userAccount/forbidden',
	// 管理员列表
	manage_userAccount_list: 'manage/userAccount/list',
	// 重置密码
	manage_userAccount_reset_password: 'manage/userAccount/reset/password',
	// 修改管理员
	manage_userAccount_update: 'manage/userAccount/update',
	// 启用管理员
	manage_userAccount_used: 'manage/userAccount/used',
	// 管理员单挑详细
	manage_userAccount_userDetail: 'manage/userAccount/userDetail',

	// —————————— 产品管理 ——————————
	// 产品详情
	manage_product_detail: 'manage/product/detail',
	// 查询产品数量
	manage_product_getCount: 'manage/product/getCount',
	// 产品信息列表
	manage_product_list: 'manage/product/list',
	// 产品禁用
	manage_product_qcForbidden: 'manage/product/qcForbidden',
	// 保存产品属性
	manage_product_configProperties: 'manage/product/configProperties',
	// 修改产品秘钥以及固件检测标准
	manage_product_productCheckConfig: 'manage/product/productCheckConfig',

	// —————————— 角色管理 ——————————
	// 新增角色
	manage_role_create: 'manage/role/create',
	// 删除角色
	manage_role_delete: 'manage/role/delete',
	// 角色详情
	manage_role_detail: 'manage/role/detail',
	// 角色列表
	manage_role_list: 'manage/role/list',
	// 修改角色
	manage_role_update: 'manage/role/update',
	// 禁用/启用角色
	manage_role_forbidden: 'manage/role/forbidden',

	// —————————— 秘钥管理 ——————————
	// 下载秘钥导入模板
	manage_triples_downloadModel: 'manage/triples/downloadModel2',
	// 秘钥预导入
	manage_triples_import: 'manage/triples/import',
	// 预导入列表
	manage_triples_getTriplesPreList: 'manage/triples/getTriplesPreList',
	// 秘钥预导入详细
	manage_triples_getTriplesPreInfo: 'manage/triples/getTriplesPreInfo',
	// 插入正式表
	manage_triples_addFirmwareTriplesBatch: 'manage/triples/addFirmwareTriplesBatch',
	// 删除预导入
	manage_triples_deleteFirmwareTriplesPre: 'manage/triples/deleteFirmwareTriplesPre',


	// 删除秘钥
	manage_triplesConfig_deleteFirmwareTriplesConfig: 'manage/triplesConfig/deleteFirmwareTriplesConfig',
	// 秘钥详情
	manage_triplesConfig_getTriplesConfigInfo: 'manage/triplesConfig/getTriplesConfigInfo',
	// 秘钥列表
	manage_triplesConfig_getTriplesConfigList: 'manage/triplesConfig/getTriplesConfigList',
	// 保存秘钥
	manage_triplesConfig_saveFirmwareTriplesConfig: 'manage/triplesConfig/saveFirmwareTriplesConfig',
	// 删除秘钥
	manage_triples_deleteFirmwareTriples: 'manage/triples/deleteFirmwareTriples',
	// 秘钥详细
	manage_triples_getTriplesInfo: 'manage/triples/getTriplesInfo',
	// 秘钥详细==>列表 // status: 1/0
	manage_triples_getTriplesList: 'manage/triples/getTriplesList',

	// —————————— 公用管理接口 ——————————
	// 验证手机号存在
	common_account_checkPhone: 'common/account/checkPhone',
	// 验证用户名存在
	common_account_checkUserName: 'common/account/checkUserName',
	// 权限列表
	common_account_permission_list: 'common/account/permission/list',
	// 角色列表
	common_account_role_list: 'common/account/role/list',

	// —————————— 工厂管理 ——————————
	// 工厂列表
	manage_factory_getFactoryList: 'manage/factory/getFactoryList',
	// 禁用/启用工厂
	manage_factory_forbidden: 'manage/factory/forbidden',
	// 删除工厂
	manage_factory_deleteFactory: 'manage/factory/deleteFactory',
	// 获取工厂详细
	manage_factory_getFactoryInfo: 'manage/factory/getFactoryInfo',
	// 编辑保存/添加工厂
	manage_factory_saveFactory: '/manage/factory/saveFactory',

	// —————————— 产线管理 ——————————
	// 产线列表
	manage_productLine_getProductLineList: 'manage/productLine/getProductLineList',
	// 禁用
	manage_productLine_forbidden: 'manage/productLine/forbidden',
	// 产线信息
	manage_productLine_getProductLineInfo: 'manage/productLine/getProductLineInfo',
	// 删除产线
	manage_productLine_deleteProductLine: 'manage/productLine/deleteProductLine',
	// 编辑/新增产线
	manage_productLine_saveProductLine: 'manage/productLine/saveProductLine',

	// —————————— 产测检验 ——————————
	// MAC地址校验
	manage_deviceCheck_checkMac: 'manage/deviceCheck/checkMac',
	// SN码校验
	manage_deviceCheck_checksnCode: 'manage/deviceCheck/checksnCode',
	// 校验固件
	manage_deviceCheck_checkFirmwareVersion: 'manage/deviceCheck/checkFirmwareVersion',

	// —————————— 下拉框接口 ——————————
	// 产品列表
	manage_product_productList: 'manage/product/productList',
	// 解绑SN码
	manage_device_removeDeviceSnCodeBind: 'manage/device/removeDeviceSnCodeBind',
}

export default api