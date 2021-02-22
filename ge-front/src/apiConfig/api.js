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
    common_getCustomers: 'common/getCustomers', // 获取大客户列表
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

    // GE
    manage_customer_create: 'manage/customer/create', // 新增客户接口
    manage_open_deviceInfo: 'third/open/api/v1/deviceInfo', // rep获取设备详情的接口
}

export default api