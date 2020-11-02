import httpService from '@/libs/http';
const api = process.env.NODE_ENV === 'production' ? window.location.href.split('/#/')[0] : '/api';
const qs = require('qs');

export default {
    // —————————————— 通用 ——————————————

    // 产品类型列表（全部）
    productTypesAll() {
        return httpService.get(api + '/lexy/api2/web/productType/list', 'GET')
    },

    // 产品型号列表（全部）
    productModuleAll(data) {
        return httpService.get(api + '/lexy/api2/web/product/list?' + qs.stringify(data), 'GET')
    },


    //文件下载
    uploadFile(data) {
        return httpService.get(api + '/lexy/api2/common/file', data, 'newFormdata')
    },

    //图片下载
    uploadImage(data) {
        return httpService.get(api + '/lexy/api2/common/image', data, 'newFormdata')
    },

    //批量保存图片
    uploadFiles(data) {
        return httpService.post(api + '/lexy/api2/common/file', data, 'newFormdata')
    },

    //批量删除图片
    deleteFiles(data) {
        return httpService.delete(api + '/lexy/api2/common/file', data, 'DELETE')
    },

    // —————————————— 产品 ——————————————

    // 获取产品归属列表
    productTags(data) {
        return httpService.get(api + '/lexy/api2/web/productTag/list', 'GET')
    },

    // 产品类型列表
    productTypes(data) {
        return httpService.get(api + '/lexy/api2/web/productType/page?' + qs.stringify(data), 'GET')
    },
    // 编辑产品类型
    productTypeEdit(data) {
        return httpService.get(api + '/lexy/api2/web/productType?' + qs.stringify(data), {}, 'PUT')
    },
    // 新增产品类型
    productTypeAdd(data) {
        return httpService.post(api + '/lexy/api2/web/productType', data, 'formdata')
    },
    // 删除产品类型
    productTypeDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/productType?id=' + id, {}, 'DELETE')
    },
    // 产品型号列表
    productModules(data) {
        return httpService.get(api + '/lexy/api2/web/product/page?' + qs.stringify(data), 'GET')
    },
    // 厨电类别
    menuTags(data) {
        return httpService.get(api + '/lexy/api2/web/productType/menuTag/list?' + qs.stringify(data), 'GET')
    },
    // 新增产品型号
    productModelAdd(data) {
        return httpService.post(api + '/lexy/api2/web/product', data, 'newFormdata')
    },
    // 编辑产品型号
    productModelUpdata(data) {
        return httpService.post(api + '/lexy/api2/web/product', data, 'putFormdata')
    },
    // 删除产品型号
    productModuleDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/product?id=' + id, {}, 'DELETE')
    },
    // 产品型号详情
    productModelInfo(data) {
        return httpService.get(api + '/lexy/api2/web/product/detail?' + qs.stringify(data), 'GET')
    },
    // 产品功能属性预设列表
    productModelFuncPresets() {
        return httpService.get(api + '/lexy/api2/web/productProperty/pre/list', 'GET')
    },
    // 产品功能属性列表
    productModelFuncList(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty/page?' + qs.stringify(data), 'GET')
    },
    // 产品功能属性列表
    productModelFuncListALL(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty/list?' + qs.stringify(data), 'GET')
    },
    // 产品功能属性详情
    productModelFuncInfo(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty?' + qs.stringify(data), 'GET')
    },
    // 产品型号新增预设属性
    productModelAddPresets(data) {
        return httpService.post(api + '/lexy/api2/web/productProperty/preProperty/add', data, 'formdata')
    },
    // 产品型号新增属性
    productModelAddProp(data) {
        return httpService.post(api + '/lexy/api2/web/productProperty', data, 'formdata')
    },
    // 产品型号编辑属性
    productModelEditProp(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty?' + qs.stringify(data), {}, 'PUT')
    },
    // 产品型号删除 属性/事件
    productModelPropDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/productProperty?id=' + id, {}, 'DELETE')
    },
    // 产品型号脚本详情
    productModelScriptInfo(data) {
        return httpService.get(api + '/lexy/api2/web/script/detail?' + qs.stringify(data), 'GET')
    },
    // 添加产品型号脚本
    productModelScriptAdd(data) {
        return httpService.post(api + '/lexy/api2/web/script', data, 'newFormdata')
    },
    // 修改产品型号脚本
    productModelScriptEdit(data) {
        return httpService.post(api + '/lexy/api2/web/script', data, 'putFormdata')
    },
    // APP主页模板列表
    appMainModels(data) {
        return httpService.get(api + '/lexy/api2/web/template/tag/list?productId=' + data, 'GET')
    },
    // 产品APP模板-详情页面-详情
    appTempInfoPageDetail(data) {
        return httpService.get(api + '/lexy/api2/web/template/detail/detail?productId=' + data, 'GET')
    },
    // 获取工作模式
    productWorkModels(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty/workModel/property?productId=' + data, 'GET')
    },
    // 获取次级页面列表
    productSecondaryPages(data) {
        return httpService.get(api + '/lexy/api2/web/template/second/list?productId=' + data, 'GET')
    },
    // app模板详情界面添加
    appTempInfoPageAdd(data) {
        return httpService.post(api + '/lexy/api2/web/template/detail/', data, 'POST')
    },
    // app模板详情页面编辑
    appTempInfoPageEdit(data) {
        return httpService.post(api + '/lexy/api2/web/template/detail/', data, 'PUT')
    },
    // 产品绑定模板
    productAddTemplate(data) {
        return httpService.post(api + '/lexy/api2/web/template/tag/product/add', data, 'formdata')
    },
    // 获取次级页面详情
    secondPageInfo(data) {
        return httpService.get(api + '/lexy/api2/web/template/second/detail/type?' + qs.stringify(data), {}, 'GET')
    },
    // 编辑次级页面
    secondPageEdit(data) {
        return httpService.post(api + '/lexy/api2/web/template/second', data, 'PUT')
    },
    // 产品关系列表
    productRelations(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty/relationship/page?' + qs.stringify(data), {}, 'GET')
    },
    // 添加属性关系
    productRelationAdd(data) {
        return httpService.post(api + '/lexy/api2/web/productProperty/relationship', data, 'formdata')
    },
    // 编辑属性关系
    productRelationEdit(data) {
        return httpService.get(api + '/lexy/api2/web/productProperty/relationship?' + qs.stringify(data), {}, 'PUT')
    },







    // —————————————— 菜谱 ——————————————

    // 菜谱模板列表
    menuTemplates() {
        return httpService.get(api + '/lexy/api2/web/menuTemplate/page', 'GET')
    },
    // 菜谱模板列表(不分页)
    menuTemplatesAll() {
        return httpService.get(api + '/lexy/api2/web/menuTemplate/list', 'GET')
    },
    // 新增菜谱模板
    menuTemplateAdd(data) {
        return httpService.get(api + '/lexy/api2/web/menuTemplate?' + qs.stringify(data), {}, 'PUT')
    },
    // 编辑菜谱模板
    menuTemplateEdit(data) {
        return httpService.post(api + '/lexy/api2/web/menuTemplate', data, 'formdata')
    },
    // 删除菜谱模板
    menuTemplateDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/menuTemplate/' + id, {}, 'DELETE')
    },
    // 菜谱类别列表
    menuTypes(data) {
        return httpService.get(api + '/lexy/api2/web/menuTemplateCategory/page?' + qs.stringify(data), 'GET')
    },
    // 新增菜谱类别
    menuTypeAdd(data) {
        return httpService.get(api + '/lexy/api2/web/menuTemplateCategory?' + qs.stringify(data), {}, 'PUT')
    },
    // 编辑菜谱类别
    menuTypeEdit(data) {
        return httpService.post(api + '/lexy/api2/web/menuTemplateCategory', data, 'formdata')
    },
    // 删除菜谱类别
    menuTypeDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/menuTemplateCategory/' + id, {}, 'DELETE')
    },
    // 菜谱子类别列表
    menuTypeChilds(data) {
        return httpService.get(api + '/lexy/api2/web/menuTemplateSubcategory/page?' + qs.stringify(data), 'GET')
    },

    // —————————————— 版本模块 ——————————————
    // 版本类别列表(分页)
    versionClassPage(data) {
        return httpService.get(api + '/lexy/api2/web/ota/version/page?' + qs.stringify(data), 'GET')
    },
    // 版本类别列表
    versionClassList(data) {
        return httpService.get(api + '/lexy/api2/web/ota/version/list?' + qs.stringify(data), 'GET')
    },
    //添加版本类别
    versionClassAdd(data) {
        return httpService.post(api + '/lexy/api2/web/ota/version', data, 'formdata')
    },
    // 编辑版本类别
    versionClassEdit(data) {
        return httpService.get(api + '/lexy/api2/web/ota/version?' + qs.stringify(data), {}, 'PUT')
    },
    // 删除版本类别
    versionClassDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/ota/version?id=' + id, {}, 'DELETE')
    },
    // 关联属性
    versionProperty(data) {
        return httpService.get(api + '/lexy/api2/web/ota/version/property/list?' + qs.stringify(data), 'GET')
    },

    //固件列表
    // 固件列表(分页)
    firmwarePage(data) {
        return httpService.get(api + '/lexy/api2/web/ota/firmware/page?' + qs.stringify(data), 'GET')
    },
    // 固件列表
    firmwareList(data) {
        return httpService.get(api + '/lexy/api2/web/ota/firmware/list?' + qs.stringify(data), 'GET')
    },
    //添加固件
    firmwareAdd(data) {
        return httpService.post(api + '/lexy/api2/web/ota/firmware', data, "formdata")
    },
    // 编辑固件
    firmwareEdit(data) {
        return httpService.get(api + '/lexy/api2/web/ota/firmware?' + qs.stringify(data), {}, 'PUT')
    },
    // 删除固件
    firmwareDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/ota/firmware?id=' + id, {}, 'DELETE')
    },
    //获取目标版本
    firmwareProperty(data) {
        return httpService.get(api + '/lexy/api2/web/ota/firmware/list/property?' + qs.stringify(data), 'GET')
    },

    //升级任务
    // 升级任务列表
    upgrateTaskPage(data) {
        return httpService.get(api + '/lexy/api2/web/ota/task/page?' + qs.stringify(data), 'GET')
    },
    //添加升级任务
    upgrateTaskAdd(data) {
        return httpService.post(api + '/lexy/api2/web/ota/task', data, 'formdata')
    },
    // 编辑升级任务
    upgrateTaskEdit(data) {
        return httpService.put(api + '/lexy/api2/web/ota/task?' + qs.stringify(data), {}, 'PUT')
    },
    // 删除升级任务
    upgrateTaskDelete(id) {
        return httpService.delete(api + '/lexy/api2/web/ota/task?id=' + id, {}, 'DELETE')
    },

    //app版本
    //APP列表
    appList(data) {
        return httpService.get(api + '/lexy/api/web/version/APPVersions?' + qs.stringify(data), {}, 'GET')
    },
    //新增
    addAPP(data) {
        return httpService.post(api + '/lexy/api/web/version/APPVersion?' + qs.stringify(data), {}, 'PUT')
    },
    //编辑APP
    updataAPP(data) {
        return httpService.post(api + '/lexy/api/web/version/APPVersion?webUpdata', data, 'formdata')
    },
    //删除ADPP
    deleteAPP(id) {
        return httpService.delete(api + '/lexy/api/web/version/APPVersion/' + id, {}, 'DELETE')
    },
}
