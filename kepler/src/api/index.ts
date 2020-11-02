export default {
  common: {
    login: '/api/web/account/login', // 登录
    export_list: '/api/web/export/list', // 导出列表
    export_count_add: '/api/web/export/download/add', // 添加下载次数
    export_progress: '/api/web/export/progress', // 导出进度
    export_delete: '/api/web/export/delete', //删除导出列表
    userInfo_update: '/api/web/account/update/info', // 更新用户信息
    userInfo_password_update: '/api/web/account/update/pwd', // 修改密码
    menu_list: '/api/web/role/menu/list', // 右侧菜单
    select_communication: '/api/web/commons/enums/communication/method/select', // 下拉框-通讯方式
    select_dataType: '/api/web/commons/enums/data/type/select', // 下拉框 - 数据类型
    select_online: '/api/web/commons/enums/online/select', // 下拉框 - 在离线状态
    select_deviceState: '/api/web/commons/enums/device/status/select', // 下拉框 - 设备状态
    select_operationCode: '/api/web/commons/enums/menu/operation/code', // 下拉框 - 菜单操作
    select_forbidden: '/api/web/commons/enums/forbidden/select', // 下拉框 - 禁用启用
    select_phase: '/api/web/commons/enums/phase/select', // 下拉框 - 产品阶段
    select_role: '/api/web/commons/role/select', // 下拉框 - 角色菜单类型查询
    select_series_model_tree: '/api/web/model/seriesAndModel', // 下拉框 - 系列 型号 tree
    select_account: '/api/web/commons/related/account/select', // 下拉框 - 相关用户
    select_property: '/api/web/commons/property/select', // 下拉框 - 属性列表
    select_property_exception_repeat: '/api/web/commons/property/no/use/select', // 下拉框 - 异常属性不显示已有属性
    select_property_exception: '/api/web/commons/alarm/property/select', // 下拉框 - 异常属性
    select_device: '/api/web/commons/model/things', // 下拉框 - 设备下拉框
    select_account_use: '/api/web/commons/related/account/use/select' // 下拉框 - 型号关联 -相关人员
  },
  system: {
    model_series_list: '/api/web/series/page',
    model_series_add: '/api/web/series/add',
    model_series_update: '/api/web/series/update',
    model_series_delete: '/api/web/series/delete',
    model_model_list: '/api/web/model/page',
    model_model_add: '/api/web/model/add',
    model_model_copy: '/api/web/model/copy', // 复制型号 型号编码后面加
    model_model_update: '/api/web/model/update',
    model_model_delete: '/api/web/model/delete', // 删除型号
    model_model_detail: '/api/web/model/detail',
    model_detail_params: '/api/web/model/property/page', // 属性列表
    model_detail_params_add: '/api/web/model/property/add', // 添加 属性配置
    model_detail_params_update: '/api/web/model/property/update', // 更新属性
    model_detail_params_delete: '/api/web/model/property/delete', // 删除属性
    model_detail_params_json: '/api/web/model/property/json', // 属性json格式
    model_detail_command: '/api/web/model/command/page', // 指令列表
    model_detail_command_add: '/api/web/model/command/add', // 新增指令
    model_detail_command_delete: '/api/web/model/command/delete', // 删除指令
    model_detail_command_update: '/api/web/model/command/update', // 更新指令
    model_detail_exception: '/api/web/model/abnormal/page',
    model_detail_exception_add: '/api/web/model/abnormal/add', // 添加异常配置
    model_detail_exception_update: '/api/web/model/abnormal/update', // 更新异常配置
    model_detail_exception_delete: '/api/web/model/abnormal/delete', // 删除异常配置
    model_detail_account: '/api/web/model/account/page',
    model_detail_account_add: '/api/web/model/account/add', // 添加 账号
    model_detail_account_delete: '/api/web/model/account/delete', // 删除 账号
    model_detail_script: '/api/web/model/script/page',
    model_detail_script_add: '/api/web/model/script/add',
    // 菜单模块
    menu_list: '/api/web/menu/page',
    menu_add: '/api/web/menu/add',
    menu_update: '/api/web/menu/update',
    menu_delete: '/api/web/menu/delete',
    menu_state: '/api/web/menu/change/state',
    menu_sort: '/api/web/menu/sort', // 菜单位置调整
    // 账号模块
    account_list: '/api/web/account/page', // 后台管理员账号列表
    account_add: '/api/web/account/create', // 创建账号
    account_update: '/api/web/account/update',
    account_delete: '/api/web/account/delete',
    account_changePwd: '/api/web/account/changePwd', // 修改密码
    account_userInfo: '/api/web/account/user/center', //登录用户信息
    // 角色模块
    role_list: '/api/web/role/page',
    role_add: '/api/web/role/add',
    role_update: '/api/web/role/update',
    role_delete: '/api/web/role/del',
    role_delete_pre: '/api/web/role/judgment/del', // 预判断是否可删除
    role_state: '/api/web/role/change/state',
    role_menu_tree: '/api/web/role/menu/edit/list', // 编辑权限的菜单
    // 日志
    log_list: '/api/web/log/api/page'
  },
  device: {
    device_list: '/api/web/things/page', // 设备列表
    device_add: '/api/web/things/add', // 新增设备
    device_delete: '/api/web/things/delete', // 删除设备
    device_update: '/api/web/things/update', // 编辑设备
    device_detail: '/api/web/things/detail', // 详情设备
    device_count: '/api/web/things/count/things', // 统计设备数量
    device_command: '/api/web/things/commands', // 获取指令
    device_import: '/api/web/things/import', // 导入设备
    device_export: '/api/web/things/export', // 导出设备
    device_detail_exception_list: '/api/web/things/alarm/page', // 详情设备-异常记录列表
    device_detail_exception_time: '/api/web/things/alarm/time', // 详情设备-异常记录详情-时序分析
    device_detail_exception_detail: '/api/web/things/alarm/detail', // 详情设备-异常详情
    device_detail_exception_detail_time: '/api/web/things/alarm/time', // 详情设备-异常详情-时序分析
    device_detail_exception_detail_fre: '/api/web/things/alarm/probability', // 详情设备-异常详情-频率分布
    device_detail_exception_detail_dot: '/api/web/things/alarm/correlation', // 详情设备-异常详情-相关性分析
    device_detail_exception_detail_time_export: '/api/web/things/alarm/time/export', // 详情设备-异常详情-时序分析导出
    device_detail_exception_detail_fre_export: '/api/web/things/alarm/probability/export', // 详情设备-异常详情-频率分布导出
    device_detail_exception_detail_dot_export: '/api/web/things/alarm/correlation/export', // 详情设备-异常详情-相关性分析导出
    device_detail_exception_export: '/api/web/things/alarm/page/export', // 详情设备-异常导出
    device_detail_online_list: '/api/web/things/online/record', // 详情设备-上下线记录
    device_detail_online_export: '/api/web/things/online/record/export', // 详情设备-上下线记录导出
    device_detail_raw_list: '/api/web/things/data/page', // 详情设备-原始数据列表
    device_detail_raw_export: '/api/web/things/data/export' // 详情设备-原始数据列表导出
  },

  exception: {
    trend_day: '/api/web/analyse/alarm/trend/day', // 24小时趋势
    trend_month: '/api/web/analyse/alarm/trend/month', // 一月趋势
    pie_day: '/api/web/analyse/alarm/proportion/day', // 24小时占比
    pie_month: '/api/web/analyse/alarm/proportion/month' // 一月占比
  },
  analysis: {
    single_time: '/api/web/analyse/dimension/one/time', // 一维时域
    single_frequency: '/api/web/analyse/dimension/one/probability', // 一维频域
    multiple_time: '/api/web/analyse/dimension/multi/time', // 多维时域
    multiple_correlation: '/api/web/analyse/dimension/multi/correlation', // 相关性分析
    comparison_time: '/api/web/analyse/comparison/time', // 对比时域
    comparison_frequency: '/api/web/analyse/comparison/probability', // 对比频域
    exception_detail: '/api/web/analyse/alarm/distribution', // 异常分布
    single_time_export: '/api/web/analyse/dimension/one/time/export', // 一维时域-导出
    single_frequency_export: '/api/web/analyse/dimension/one/probability/export', // 一维频域-导出
    multiple_time_export: '/api/web/analyse/dimension/multi/time/export', // 多维时域-导出
    multiple_correlation_export: '/api/web/analyse/dimension/multi/correlation/export', // 相关性分析-导出
    comparison_time_export: '/api/web/analyse/comparison/time/export', // 对比时域-导出
    comparison_frequency_export: '/api/web/analyse/comparison/probability/export', // 对比频域-导出
    exception_detail_export: '/api/web/analyse/alarm/distribution/export' // 异常分布-导出
  },
  //缺陷跟踪
  flaw: {
    flaw_add: '/api/web/flaw/add', //新增缺陷
    flaw_list: '/api/web/flaw/page', //缺陷列表
    flaw_handle: '/api/web/flaw/handle', //处理缺陷
    flaw_update: '/api/web/flaw/update', //编辑缺陷
    flaw_process: '/api/web/flaw/process/history', //处理进度历史
    flaw_alarm_list: '/api/web/flaw/alarm/list', //关联异常
    flaw_detail: '/api/web/flaw/detail', //缺陷详情
    flaw_delete: '/api/web/flaw/delete', //缺陷文件删除
    flaw_pie_statistic_status: '/api/web/flaw/statistic/status', //状态统计饼图
    flaw_pie_statistic_assign: '/api/web/flaw/statistic/assign', //状态统计饼图
    flaw_line_statistic_overall_day: '/api/web/flaw/statistic/trend/overall/day', //整体缺陷走势图(按天)
    flaw_line_statistic_overall_month: '/api/web/flaw/statistic/trend/overall/month', //整体缺陷走势图(按月)
    flaw_line_statistic_remain_day: '/api/web/flaw/statistic/trend/remain/day', //残留缺陷走势图(按天)
    flaw_line_statistic_remain_month: '/api/web/flaw/statistic/trend/remain/month' //残留缺陷走势图(按月)
  },

  file: {
    file_read: '/api/file/read', //读取文件
    file_upload: '/api/file/upload', //上传文件
    file_bacth_upload: '/api/file/batch/upload', //批量上传
    file_delete: '/api/file/delete' //删除文件
  }
}
