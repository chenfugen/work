import httpService from '@/libs/http';
// 标准化平台接口列表
import standList from './standard/service';
const api = process.env.NODE_ENV === 'production' ? window.location.href.split('/#/')[0] : '/api';
const qs = require('qs');
export default {
    ...standList,
    login(data) {
        return httpService.post(api + '/lexy/api/web/login/login', data, 'formdata')
    },
    //退出登录
    logout() {
        return httpService.get(api + '/lexy/api/web/login/logout', {}, 'GET')
    },
    //上传文件
    file(data) {
        return httpService.post(api + '/lexy/api/common/file', data, 'file')
    },
    //批量上传文件
    batchFile(data, upload) {
        return httpService.file(api + '/lexy/api/common/batchFile', data, upload, 'file')
    },
    //地图
    deviceMap(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceMap?' + qs.stringify(data), {}, 'GET')
    },
    //设备型号集合
    selectDeviceModel() {
        return httpService.get(api + '/lexy/api/web/device/selectDeviceModel', {}, 'GET')
    },
    //设备类型集合
    selectDeviceType() {
        return httpService.get(api + '/lexy/api/web/device/selectDeviceType', {}, 'GET')
    },
    //设备类型型号集合
    selectType() {
        return httpService.get(api + '/lexy/api/web/device/selectType', {}, 'GET')
    },
    //新增菜谱
    addMenu(data) {
        return httpService.post(api + '/lexy/api/web/menu/menu', data, 'PUT')
    },
    //新增父菜谱
    addParentMenu(data) {
        return httpService.post(api + '/lexy/api/web/menu/parentMenu', data, 'PUT')
    },
    //新增菜谱CF5
    addMenu5(data) {
        return httpService.post(api + '/lexy/api/web/singleMenu/menu', data, 'PUT')
    },
    //员工列表
    admins(data) {
        return httpService.get(api + '/lexy/api/web/account/admins?' + qs.stringify(data), {}, 'GET')
    },
    //部门列表
    departments(data) {
        return httpService.get(api + '/lexy/api/web/account/departments?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱列表
    menus(data) {
        return httpService.get(api + '/lexy/api/web/menu/menus?' + qs.stringify(data), {}, 'GET')
    },
    //父菜谱列表
    parentMenus(data) {
        return httpService.get(api + '/lexy/api/web/menu/parentMenus?' + qs.stringify(data), {}, 'GET')
    },
    //CF5菜谱列表
    menus5(data) {
        return httpService.get(api + '/lexy/api/web/singleMenu/menus?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱详情
    menu(data) {
        return httpService.get(api + '/lexy/api/web/menu/menu?' + qs.stringify(data), {}, 'GET')
    },
    //父菜谱详情
    parentMenu(data) {
        return httpService.get(api + '/lexy/api/web/menu/parentMenu?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱详情
    menu5(data) {
        return httpService.get(api + '/lexy/api/web/singleMenu/menu?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱详情
    menuApp(data) {
        return httpService.get(api + '/lexy/api/web/menu/appDetailMenu?' + qs.stringify(data), {}, 'GET')
    },
    //MCU列表
    MCU(data) {
        return httpService.get(api + '/lexy/api/web/version/MCUVersions?' + qs.stringify(data), {}, 'GET')
    },
    //DTU列表
    DTU(data) {
        return httpService.get(api + '/lexy/api/web/version/DTUVersions?' + qs.stringify(data), {}, 'GET')
    },
    // 更多固件列表
    moreFirmwares(data) {
        return httpService.get(api + '/lexy/api/web/versionManage/versionManages?' + qs.stringify(data), {}, 'GET')
    },
    //APP列表
    APP(data) {
        return httpService.get(api + '/lexy/api/web/version/APPVersions?' + qs.stringify(data), {}, 'GET')
    },
    //addMCU
    addMCU(data) {
        return httpService.get(api + '/lexy/api/web/version/MCUVersion?' + qs.stringify(data), {}, 'PUT')
    },
    //新增更多固件
    addMoreFirmware(data) {
        return httpService.get(api + '/lexy/api/web/versionManage/versionManage?' + qs.stringify(data), {}, 'PUT')
    },
    //addDTU
    addDTU(data) {
        return httpService.get(api + '/lexy/api/web/version/DTUVersion?' + qs.stringify(data), {}, 'PUT')
    },
    //addAPP
    addAPP(data) {
        return httpService.get(api + '/lexy/api/web/version/APPVersion?' + qs.stringify(data), {}, 'PUT')
    },
    //编辑MCU
    updataMCU(data) {
        return httpService.post(api + '/lexy/api/web/version/MCUVersion?webUpdata', data, 'formdata')
    },
    //编辑DTU
    updataDTU(data) {
        return httpService.post(api + '/lexy/api/web/version/DTUVersion?webUpdata', data, 'formdata')
    },
    //编辑更多固件
    updataMoreFirmware(data) {
        return httpService.post(api + '/lexy/api/web/versionManage/versionManage', data, 'formdata')
    },
    //编辑APP
    updataAPP(data) {
        return httpService.post(api + '/lexy/api/web/version/APPVersion?webUpdata', data, 'formdata')
    },
    //冻结员工
    frozenAdmin(data) {
        return httpService.post(api + '/lexy/api/web/account/frozenAdmin?webUpdata', data, 'formdata')
    },
    //设备批量导出日志记录
    deviceBatchExport() {
        return httpService.post(api + '/lexy/api/web/device/deviceBatchExport', {}, 'post')
    },
    //故障记录批量导出
    faultBatchExport() {
        return httpService.post(api + '/lexy/api/web/fault/faultBatchExport', {}, 'post')
    },
    //厂测列表批量导出
    factoryTestBatchExport() {
        return httpService.post(api + '/lexy/api/web/factory/factoryTestBatchExport', {}, 'post')
    },
    //删除更多固件
    deleteMoreFirmware(id) {
        return httpService.delete(api + '/lexy/api/web/versionManage/versionManage/' + id, {}, 'DELETE')
    },
    //删除MCU
    deleteMCU(id) {
        return httpService.delete(api + '/lexy/api/web/version/MCUVersion/' + id, {}, 'DELETE')
    },
    //删除DTU
    deleteDTU(id) {
        return httpService.delete(api + '/lexy/api/web/version/DTUVersion/' + id, {}, 'DELETE')
    },
    //删除D
    deleteDTU(id) {
        return httpService.delete(api + '/lexy/api/web/version/DTUVersion/' + id, {}, 'DELETE')
    },
    //删除ADPP
    deleteAPP(id) {
        return httpService.delete(api + '/lexy/api/web/version/APPVersion/' + id, {}, 'DELETE')
    },
    //故障代码列表
    faultCodes(data) {
        return httpService.get(api + '/lexy/api/web/fault/faultCodes?' + qs.stringify(data), {}, 'GET')
    },
    //消息推送列表
    messagePushs(data) {
        return httpService.get(api + '/lexy/api/web/message/messagePushs?' + qs.stringify(data), {}, 'GET')
    },
    //新增故障代码
    addFaultCode(data) {
        return httpService.get(api + '/lexy/api/web/fault/faultCode?' + qs.stringify(data), {}, 'PUT')
    },
    //广告列表
    advertisements(data) {
        return httpService.get(api + '/lexy/api/web/advertisement/advertisements?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱类型列表
    menuModels(data) {
        return httpService.get(api + '/lexy/api/web/menu/menuModels?' + qs.stringify(data), {}, 'GET')
    },
    //新增广告
    addAdvertisement(data) {
        return httpService.get(api + '/lexy/api/web/advertisement/advertisement?' + qs.stringify(data), {}, 'PUT')
    },
    //新增菜谱类型
    menuModel(data) {
        return httpService.get(api + '/lexy/api/web/menu/menuModel?' + qs.stringify(data), {}, 'PUT')
    },
    //编辑菜谱类型
    updataMenuModel(data) {
        return httpService.post(api + '/lexy/api/web/menu/menuModel?webUpdata', data, 'formdata')
    },
    //启用停用广告
    enableAdvertisement(data) {
        return httpService.post(api + '/lexy/api/web/advertisement/enableAdvertisement?webUpdata', data, 'formdata')
    },
    //删除菜谱类型
    deleteMenuModel(id) {
        return httpService.delete(api + '/lexy/api/web/menu/menuModel/' + id, {}, 'DELETE')
    },
    //选择菜谱类型
    selectMenuModel(data) {
        return httpService.get(api + '/lexy/api/web/menu/selectMenuModel?' + qs.stringify(data), {}, 'GET')
    },
    //删除广告
    deleteDvertisement(id) {
        return httpService.delete(api + '/lexy/api/web/advertisement/advertisement/' + id, {}, 'DELETE')
    },
    //新增消息推送
    addMessagePush(data) {
        return httpService.get(api + '/lexy/api/web/message/messagePush?' + qs.stringify(data), {}, 'PUT')
    },
    //新增部门
    addDepartment(data) {
        return httpService.get(api + '/lexy/api/web/account/department?' + qs.stringify(data), {}, 'PUT')
    },
    //新增角色
    addRole(data) {
        var rs = '';
        for (var x in data) {
            rs += x + '=' + data[x] + '&'
        }
        return httpService.get(api + '/lexy/api/web/account/role?' + rs, {}, 'PUT')
    },
    //新增员工
    addAdmin(data) {
        var rs = '';
        for (var x in data) {
            rs += x + '=' + data[x] + '&'
        }
        return httpService.get(api + '/lexy/api/web/account/admin?' + rs, {}, 'PUT')
    },
    //删除部门
    deleteDepartment(id) {
        return httpService.delete(api + '/lexy/api/web/account/department/' + id, {}, 'DELETE')
    },
    //删除角色
    deleteRole(id) {
        return httpService.delete(api + '/lexy/api/web/account/role/' + id, {}, 'DELETE')
    },
    //删除员工
    deleteAdmin(id) {
        return httpService.delete(api + '/lexy/api/web/account/admin/' + id, {}, 'DELETE')
    },
    //删除故障代码
    deleteFaultCode(id) {
        return httpService.delete(api + '/lexy/api/web/fault/faultCode/' + id, {}, 'DELETE')
    },
    //删除消息推送
    deleteMessagePush(id) {
        return httpService.delete(api + '/lexy/api/web/message/messagePush/' + id, {}, 'DELETE')
    },
    //删除父菜谱
    deleteParentMenu(data) {
        return httpService.delete(api + '/lexy/api/web/menu/parentMenu', {
            id: data
        }, 'formdata')
    },
    //删除菜谱
    deleteMenu(data) {
        return httpService.delete(api + '/lexy/api/web/menu/menu', {
            ids: data
        }, 'formdata')
    },
    //删除菜谱5
    deleteMenu5(data) {
        return httpService.delete(api + '/lexy/api/web/singleMenu/menu', {
            ids: data
        }, 'formdata')
    },
    //编辑父菜谱
    updataParentMenu(data) {
        return httpService.post(api + '/lexy/api/web/menu/parentMenu?webUpdata', data, 'post')
    },
    //编辑菜谱
    updataMenu(data) {
        return httpService.post(api + '/lexy/api/web/menu/menu?webUpdata', data, 'post')
    },
    //编辑菜谱CF5
    updataMenu5(data) {
        return httpService.post(api + '/lexy/api/web/singleMenu/menu?webUpdata', data, 'post')
    },
    //菜谱启用停用
    enableOrNotMenu(data, status) {
        return httpService.post(api + '/lexy/api/web/menu/enableOrNotMenu', {
            ids: data,
            status: status
        }, 'formdata')
    },
    //菜谱启用停用CF5
    enableOrNotMenu5(data, status) {
        return httpService.post(api + '/lexy/api/web/singleMenu/enableOrNotMenu', {
            ids: data,
            status: status
        }, 'formdata')
    },
    //编辑部门
    updataDepartment(data) {
        return httpService.post(api + '/lexy/api/web/account/department?webUpdata', data, 'formdata')
    },
    //编辑角色
    updataRole(data) {
        return httpService.post(api + '/lexy/api/web/account/role?webUpdata', data, 'formdata')
    },
    //编辑员工
    updataAdmin(data) {
        return httpService.post(api + '/lexy/api/web/account/admin?webUpdata', data, 'formdata')
    },
    //编辑故障代码
    updataFaultCode(data) {
        return httpService.post(api + '/lexy/api/web/fault/faultCode?webUpdata', data, 'formdata')
    },
    //角色列表
    roles(data) {
        return httpService.get(api + '/lexy/api/web/account/roles?' + qs.stringify(data), {}, 'GET')
    },
    //部门集合
    selectDepartment() {
        return httpService.get(api + '/lexy/api/web/account/selectDepartment', {}, 'GET')
    },
    //角色
    selectRole() {
        return httpService.get(api + '/lexy/api/web/account/selectRole', {}, 'GET')
    },
    //获取角色权限树
    roleAuthTree(id) {
        return httpService.get(api + '/lexy/api/web/account/roleAuthTree?id=' + id, {}, 'GET')
    },
    //编辑系统设置 12.3
    updataSystemLink(data) {
        return httpService.post(api + '/lexy/api/web/system/systemLink?webUpdata', data, 'formdata')
    },
    //获取系统设置 12.2
    systemLink() {
        return httpService.get(api + '/lexy/api/web/system/systemLink', {}, 'GET')
    },
    //修改密码
    password(data) {
        return httpService.post(api + '/lexy/api/web/login/password', data, 'formdata')
    },
    //重置密码
    resetPassword(data) {
        return httpService.post(api + '/lexy/api/web/account/resetPassword', data, 'formdata')
    },
    //设备列表 3.2
    devices(data) {
        return httpService.get(api + '/lexy/api/web/device/devices?' + qs.stringify(data), {}, 'GET')
    },
    //编辑设备列表 3.3
    updataDevice(data) {
        return httpService.post(api + '/lexy/api/web/device/device?webUpdata', data, 'formdata')
    },
    //删除设备 3.4
    deleteDevice(id) {
        return httpService.delete(api + '/lexy/api/web/device/device/' + id, {}, 'DELETE')
    },
    //设备详情 3.5
    deviceDetails(id) {
        return httpService.get(api + '/lexy/api/web/device/device?mac=' + id, {}, 'GET')
    },
    //设备关联用户列表 3.6
    deviceUsers(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceUsers?' + qs.stringify(data), {}, 'GET')
    },
    //设备导入
    importDevice(data) {
        return httpService.post(api + '/lexy/api/web/device/importDevice', data, 'file')
    },
    //设备登记列表 3.7
    register(data) {
        return httpService.get(api + '/lexy/api/web/device/checkInDevices?' + qs.stringify(data), {}, 'GET')
    },
    //设备日志列表 3.8.
    deviceLogs(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceLogs?' + qs.stringify(data), {}, 'GET')
    },
    //编辑登记设备 3.8
    updataRegister(data) {
        return httpService.post(api + '/lexy/api/web/device/checkInDevice?webUpdata', data, 'formdata')
    },
    //删除登记设备 3.9
    deleteRegister(id) {
        return httpService.delete(api + '/lexy/api/web/device/checkInDevice/' + id, {}, 'DELETE')
    },
    //删除关联用户 3.9
    deleteDeviceUser(id) {
        return httpService.delete(api + '/lexy/api/web/device/deviceUser/' + id, {}, 'DELETE')
    },
    //删除设备日志 3.9
    deleteDeviceLog(id) {
        return httpService.delete(api + '/lexy/api/web/device/deviceLog/' + id, {}, 'DELETE')
    },
    //故障记录列表 4.5
    faultRecords(data) {
        return httpService.get(api + '/lexy/api/web/fault/faultRecords?' + qs.stringify(data), {}, 'GET')
    },
    //故障记录已读处理 4.6
    readFaultRecord(data) {
        return httpService.post(api + '/lexy/api/web/fault/faultRecord', data, 'formdata')
    },
    //消息反馈已读处理 4.6
    feedbackRecord(data) {
        return httpService.post(api + '/lexy/api/web/message/feedback', data, 'formdata')
    },
    //删除故障记录 4.7
    deleteFaultRecord(id) {
        return httpService.delete(api + '/lexy/api/web/fault/faultRecord/' + id, {}, 'DELETE')
    },
    //厂测列表 6.1
    factoryTests(data) {
        return httpService.get(api + '/lexy/api/web/factory/factoryTests?' + qs.stringify(data), {}, 'GET')
    },
    //获取故障记录未读数量
    faultRecordNotReadNumber() {
        return httpService.get(api + '/lexy/api/web/fault/faultRecordNotReadNumber', {}, 'GET')
    },
    //厂测详情 6.2
    factoryTest(data) {
        return httpService.get(api + '/lexy/api/web/factory/factoryTest?' + qs.stringify(data), {}, 'GET')
    },
    //厂测详情列表 6.2(新)
    testRecords(data) {
        return httpService.get(api + '/lexy/api/web/factory/testRecords?' + qs.stringify(data), {}, 'GET')
    },
    //厂测详情mac列表
    macRecords(data) {
        return httpService.get(api + '/lexy/api/web/factory/macRecords?' + qs.stringify(data), {}, 'GET')
    },
    //编辑厂测 6.3
    updataFactoryTest(data) {
        return httpService.post(api + '/lexy/api/web/factory/factoryTest?webUpdata', data, 'formdata')
    },
    //删除厂测 6.4
    deleteFactoryTest(id) {
        return httpService.delete(api + '/lexy/api/web/factory/factoryTest/' + id, {}, 'DELETE')
    },
    //产品列表 8.1
    deviceTypes(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceTypes?' + qs.stringify(data), {}, 'GET')
    },
    //编辑产品类型 8.2
    updataDeviceType(data) {
        return httpService.post(api + '/lexy/api/web/device/deviceType?webUpdata', data, 'post')
    },
    //用户列表
    users(data) {
        return httpService.get(api + '/lexy/api/web/user/users?' + qs.stringify(data), {}, 'GET')
    },
    //删除用户
    deleteUser(id) {
        return httpService.delete(api + '/lexy/api/web/user/user/' + id, {}, 'DELETE')
    },
    //用户关联设备列表
    userDevices(data) {
        return httpService.get(api + '/lexy/api/web/user/userDevices?' + qs.stringify(data), {}, 'GET')
    },
    //消息反馈列表 10.5
    feedbacks(data) {
        return httpService.get(api + '/lexy/api/web/message/feedbacks?' + qs.stringify(data), {}, 'GET')
    },
    //删除厂测 10.7
    deleteFeedback(id) {
        return httpService.delete(api + '/lexy/api/web/message/feedback/' + id, {}, 'DELETE')
    },
    //系统日志列表 12.1
    systemLogs(data) {
        return httpService.get(api + '/lexy/api/web/system/systemLogs?' + qs.stringify(data), {}, 'GET')
    },
    //设备在离线统计
    onlineOfflineStatistics(data) {
        return httpService.get(api + '/lexy/api/web/device/onlineOfflineStatistics', {}, 'GET')
    },
    //设备新增趋势
    deviceNewTendency(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceNewTendency?' + qs.stringify(data), {}, 'GET')
    },
    //产品类型统计
    deviceTypeStatistics(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceTypeStatistics', {}, 'GET')
    },
    //产品型号统计
    deviceModelStatistics(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceModelStatistics?' + qs.stringify(data), {}, 'GET')
    },
    //设备分布统计
    deviceDistribution(data) {
        return httpService.get(api + '/lexy/api/web/device/deviceDistribution', {}, 'GET')
    },
    //产品检验统计
    factoryTestProductStatistics(data) {
        return httpService.get(api + '/lexy/api/web/factory/factoryTestProductStatistics', {}, 'GET')
    },
    //检验趋势统计
    testRecordTendency(data) {
        return httpService.get(api + '/lexy/api/web/factory/testRecordTendency?' + qs.stringify(data), {}, 'GET')
    },
    //检验分布统计
    testRecordDistribution(data) {
        return httpService.get(api + '/lexy/api/web/factory/testRecordDistribution?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱产品型号统计
    deviceModelMenuStatistics() {
        return httpService.get(api + '/lexy/api/web/menu/deviceModelMenuStatistics', {}, 'GET')
    },
    //菜谱新增趋势统计
    menuNewTendency(data) {
        return httpService.get(api + '/lexy/api/web/menu/menuNewTendency?' + qs.stringify(data), {}, 'GET')
    },
    //菜谱新增趋势统计
    menuNewTendency5(data) {
        return httpService.get(api + '/lexy/api/web/singleMenu/menuNewTendency?' + qs.stringify(data), {}, 'GET')
    },
    //用户类型统计
    appTypeStatistics() {
        return httpService.get(api + '/lexy/api/web/user/appTypeStatistics', {}, 'GET')
    },
    //用户新增趋势统计
    userNewTendency(data) {
        return httpService.get(api + '/lexy/api/web/user/userNewTendency?' + qs.stringify(data), {}, 'GET')
    },
    //故障分布饼图统计
    faultPieStatistics(data) {
        return httpService.get(api + '/lexy/api/web/fault/faultPieStatistics?' + qs.stringify(data), {}, 'GET')
    },
    //故障分布直方图统计
    faultLineStatistics(data) {
        return httpService.get(api + '/lexy/api/web/fault/faultLineStatistics?' + qs.stringify(data), {}, 'GET')
    },
    //故障新增趋势统计
    faultNewTendency(data) {
        return httpService.get(api + '/lexy/api/web/fault/faultNewTendency?' + qs.stringify(data), {}, 'GET')
    },
    //编辑APP常见问题
    appProblem(data) {
        return httpService.post(api + '/lexy/api/web/system/appProblem?webUpdata', data, 'post')
    },
    //编辑APP使用帮助
    appUse(data) {
        return httpService.post(api + '/lexy/api/web/system/appUse?webUpdata', data, 'post')
    },
    // 新文件上传接口 MCU DTU 新增返还MD5值，用于固件校验
    newBinFileUp(data, upload) {
        return httpService.file(api + '/lexy/api/common/binFile', data, upload, 'file')
    },
    // 删除线上文件
    deleteFile(data) {
        return httpService.delete(api + '/lexy/api/common/batchFile', {
            fileNames: data
        }, 'formdata')
    },
    // 上传菜谱图片
    menuImgUp(data, upload) {
        return httpService.file(api + '/lexy/api/common/saveMenuImage', data, upload, 'file')
    },

    // 上传菜谱型号图片
    menuTypeImgUp(data, upload) {
        return httpService.file(api + '/lexy/api/common/saveMenuModelImage', data, upload, 'file')
    },

    // 菜谱类型排序
    sortMenuType(data) {
        return httpService.post(api + '/lexy/api/web/menu/sortMenuModel', data, 'post')
    },
}