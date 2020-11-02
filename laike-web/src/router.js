import Vue from 'vue'
import Router from 'vue-router'
import list from './standard/router';


Vue.use(Router)
// 解决elementUI菜单重复点击的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
let routes = [
    ...list.standardList,
    {
        path: '/pdf',
        name: 'pdf',
        component: () =>
            import('@/views/pdf.vue'),
        meta: {
            keepAlive: false
        }
    },
    {
        path: '/',
        name: '首页',
        component: () =>
            import('@/views/index.vue'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/login',
        name: '登录',
        component: () =>
            import('@/views/login.vue'),
        meta: {
            keepAlive: false
        }
    },
    {
        path: '/map',
        name: '地图',
        component: () =>
            import('@/views/pages/map.vue'),
        meta: {
            keepAlive: true
        }
    },
    // 设备管理
    {
        path: '/device/chefMachine',
        name: '智能烹饪机',
        component: () =>
            import('@/views/pages/device/chefMachine.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '设备管理',
                isActive: false
            },
            {
                name: '智能烹饪机',
                isActive: true
            },
            ]
        }
        // children:[]
    },
    {
        path: '/device/details/:id',
        name: '设备详情',
        component: () =>
            import('@/views/pages/device/details.vue'),
        meta: {
            keepAlive: true,
            name: '',
            time: '',
            breadcrumbData: [{
                name: '设备管理',
                isActive: false
            },
            {
                name: '智能烹饪机',
                isActive: false,
                path: '/device/chefMachine'
            },
            {
                name: '详情',
                isActive: true
            },
            ]
        }
    },
    // 故障管理
    {
        path: '/fault/record',
        name: '故障记录',
        component: () =>
            import('@/views/pages/fault/faultRecord.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '故障管理',
                isActive: false
            },
            {
                name: '故障记录',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/fault/code',
        name: '故障代码',
        component: () =>
            import('@/views/pages/fault/faultCode.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '故障管理',
                isActive: false
            },
            {
                name: '故障代码',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/fault/statistics',
        name: '故障统计',
        component: () =>
            import('@/views/pages/fault/fualtStatistics.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '故障管理',
                isActive: false
            },
            {
                name: '故障统计',
                isActive: true
            },
            ]
        }
    },
    //菜谱管理
    {
        path: '/menu/list',
        name: '菜谱清单',
        component: () =>
            import('@/views/pages/menu/menuList.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/statistics',
        name: '菜谱统计',
        component: () =>
            import('@/views/pages/menu/menuStatistics.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱统计',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/menuType',
        name: '菜谱配置',
        component: () =>
            import('@/views/pages/menu/menuType.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱配置',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/add',
        name: '新增菜谱',
        component: () =>
            import('@/views/pages/menu/menuAdd.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '菜谱新增',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/menuChildAdd',
        name: '新增子菜谱',
        component: () =>
            import('@/views/pages/menu/menuChildAdd.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '子菜谱新增',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/menuChildEdit',
        name: '编辑子菜谱',
        component: () =>
            import('@/views/pages/menu/menuChildEdit.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '子菜谱新增',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/addCf5',
        name: '新增菜谱(CF5)',
        component: () =>
            import('@/views/pages/menu/menuAddCf5.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '菜谱新增',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/addCf5s',
        name: '新增菜谱(CF5s)',
        component: () =>
            import('@/views/pages/menu/menuAddCf5s.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '菜谱新增',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/details/:id',
        name: '菜谱详情',
        component: () =>
            import('@/views/pages/menu/menuDetails.vue'),
        meta: {
            keepAlive: false,
            breadcrumbData: []
        }
    },
    {
        path: '/menu/update',
        name: '编辑菜谱',
        component: () =>
            import('@/views/pages/menu/menuEdit.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '菜谱编辑',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/menu/updateCf5',
        name: '编辑菜谱(CF5)',
        component: () =>
            import('@/views/pages/menu/menuAddCf5.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '菜谱管理',
                isActive: false
            },
            {
                name: '菜谱清单',
                isActive: false,
                path: '/menu/list'
            },
            {
                name: '菜谱编辑',
                isActive: true
            },
            ]
        }
    },
    // 厂测管理
    {
        path: '/planSurvey/statistics',
        name: '厂测统计',
        component: () =>
            import('@/views/pages/plantSurvey/plantSurveyStatistics.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '厂测管理',
                isActive: false
            },
            {
                name: '厂测统计',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/planSurvey/list',
        name: '厂测列表',
        component: () =>
            import('@/views/pages/plantSurvey/plantSurveyList.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '厂测管理',
                isActive: false
            },
            {
                name: '厂测列表',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/planSurvey/details/:id',
        name: '厂测详情',
        component: () =>
            import('@/views/pages/plantSurvey/details.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '厂测管理',
                isActive: false
            },
            {
                name: '厂测列表',
                isActive: false,
                path: '/planSurvey/list'
            },
            {
                name: '厂测详情',
                isActive: true
            },
            ]
        }
    },
    // 产品管理
    {
        path: '/product/type',
        name: '产品类型',
        component: () =>
            import('@/views/pages/product/productTypoe.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '产品管理',
                isActive: false
            },
            {
                name: '产品类型',
                isActive: true
            },
            ]
        }
    },
    // 用户管理
    //消息中心
    {
        path: '/message/newPush',
        name: '推送记录',
        component: () =>
            import('@/views/pages/message/messageNewPush.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '消息中心',
                isActive: false
            },
            {
                name: '推送记录',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/message/feedback',
        name: '消息反馈',
        component: () =>
            import('@/views/pages/message/messageFeedback.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '消息中心',
                isActive: false
            },
            {
                name: '消息反馈',
                isActive: true
            },
            ]
        }
    },
    //版本管理
    {
        path: '/edition/mcu',
        name: 'MCU固件',
        component: () =>
            import('@/views/pages/edition/MCU.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '版本管理',
                isActive: false
            },
            {
                name: 'MCU固件',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/edition/moreFirmware',
        name: '更多固件管理',
        component: () =>
            import('@/views/pages/edition/moreFirmware.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '版本管理',
                isActive: false
            },
            {
                name: '更多固件管理',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/edition/wifi',
        name: 'DTU固件',
        component: () =>
            import('@/views/pages/edition/wifiEdition.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '版本管理',
                isActive: false
            },
            {
                name: 'DTU固件',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/edition/app',
        name: 'APP版本',
        component: () =>
            import('@/views/pages/edition/appEdition.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '版本管理',
                isActive: false
            },
            {
                name: 'APP版本',
                isActive: true
            },
            ]
        }
    },
    // 用户管理
    {
        path: '/user/center',
        name: '用户中心',
        component: () =>
            import('@/views/pages/user/user.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '用户管理',
                isActive: false
            },
            {
                name: '用户中心',
                isActive: true
            },
            ]
        }
    },
    // 系统管理
    {
        path: '/system/systemAccount',
        name: '账号管理',
        component: () =>
            import('@/views/pages/system/systemAccount.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '系统管理',
                isActive: false
            },
            {
                name: '账号管理',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/system/systemRole',
        name: '角色管理',
        component: () =>
            import('@/views/pages/system/systemRole.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '系统管理',
                isActive: false
            },
            {
                name: '角色管理',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/system/advert',
        name: '广告管理',
        component: () =>
            import('@/views/pages/system/systemAdvert.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '系统管理',
                isActive: false
            },
            {
                name: '广告管理',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/system/systemRecord',
        name: '系统日志',
        component: () =>
            import('@/views/pages/system/systemRecord.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '系统管理',
                isActive: false
            },
            {
                name: '系统日志',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/system/systemSet',
        name: '通用设置',
        component: () =>
            import('@/views/pages/system/systemSet.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '系统管理',
                isActive: false
            },
            {
                name: '通用设置',
                isActive: true
            },
            ]
        }
    },
    {
        path: '/system/instructions',
        name: '操作手册',
        component: () =>
            import('@/views/pages/system/instructions.vue'),
        meta: {
            keepAlive: true,
            breadcrumbData: [{
                name: '系统管理',
                isActive: false
            },
            {
                name: '操作手册',
                isActive: true
            },
            ]
        }
    },
];
export default new Router({
    // mode: 'history',
    // base: process.env.BASE_URL,
    routes: routes
})