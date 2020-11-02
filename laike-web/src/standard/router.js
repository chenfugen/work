export default {
    standardList: [
        // 产品
        {
            path: '/standardProduct/type',
            name: '产品类型-标准化',
            component: () =>
                import('./views/product/type'),
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
        {
            path: '/standardProduct/module',
            name: '产品型号-标准化',
            component: () =>
                import('./views/product/module'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '产品管理',
                    isActive: false
                }, {
                    name: '产品型号',
                    isActive: true
                },]
            }
        },
        {
            path: '/standardProduct/functionConfig',
            name: '功能配置',
            component: () =>
                import('./views/product/configs/functionConfig'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '产品管理',
                    isActive: false
                }, {
                    name: '产品型号',
                    isActive: false
                }, {
                    name: '功能配置',
                    isActive: true
                },]
            }
        },
        {
            path: '/standardProduct/parse',
            name: '解析配置',
            component: () =>
                import('./views/product/configs/parse'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '产品管理',
                    isActive: false
                }, {
                    name: '产品型号',
                    isActive: false
                }, {
                    name: '解析配置',
                    isActive: true
                },]
            }
        },
        {
            path: '/standardProduct/template',
            name: '模板选择',
            component: () =>
                import('./views/product/configs/template'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '产品管理',
                    isActive: false
                }, {
                    name: '产品型号',
                    isActive: false
                }, {
                    name: '模板选择',
                    isActive: true
                },]
            }
        },
        // 故障
        {
            path: '/standardFault/statistical',
            name: '故障统计-标准化',
            component: () =>
                import('./views/fault/statistical'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '故障管理-标准化',
                    isActive: false
                },
                {
                    name: '故障统计-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardFault/code',
            name: '故障代码-标准化',
            component: () =>
                import('./views/fault/code'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '故障管理-标准化',
                    isActive: false
                },
                {
                    name: '故障代码-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardFault/record',
            name: '故障记录-标准化',
            component: () =>
                import('./views/fault/record'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '故障管理-标准化',
                    isActive: false
                },
                {
                    name: '故障记录-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/list',
            name: '菜谱清单-标准化',
            component: () =>
                import('./views/menu/list'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/addParent',
            name: '新建菜谱-添加菜谱概要',
            component: () =>
                import('./views/menu/addMenu/addParent'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-菜谱概要',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/addChild',
            name: '新建菜谱-添加子菜谱',
            component: () =>
                import('./views/menu/addMenu/addChild'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-添加子菜单',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/addOther',
            name: '新建菜谱-其他类菜谱',
            component: () =>
                import('./views/menu/addMenu/addOther'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-标准化',
                    isActive: false
                },
                {
                    name: '菜谱清单-其他类菜谱',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/childTypeConfig',
            name: '菜谱子分类配置',
            component: () =>
                import('./views/menu/childTypeConfig'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱类别配置-标准化',
                    isActive: false
                },
                {
                    name: '菜谱子分类配置',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/typeConfig',
            name: '菜谱类别配置-标准化',
            component: () =>
                import('./views/menu/typeConfig'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱类别配置-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/menuStandard/templateConfig',
            name: '菜谱模板配置-标准化',
            component: () =>
                import('./views/menu/templateConfig'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '菜谱管理-标准化',
                    isActive: false
                },
                {
                    name: '菜谱模板配置-标准化',
                    isActive: true
                },
                ]
            }
        },
        // 消息
        {
            path: '/standardMessage/record',
            name: '消息记录-标准化',
            component: () =>
                import('./views/message/record'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '消息推送-标准化',
                    isActive: false
                },
                {
                    name: '消息记录-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardMessage/feedback',
            name: '消息反馈-标准化',
            component: () =>
                import('./views/message/feedback'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '消息推送-标准化',
                    isActive: false
                },
                {
                    name: '消息反馈-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardVersion/versionClassSet',
            name: '版本类别配置-标准化',
            component: () =>
                import('./views/versionManage/versionClassSet.vue'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '版本管理-标准化',
                    isActive: false
                },
                {
                    name: '版本类别配置-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardVersion/mcu',
            name: '固件列表-标准化',
            component: () =>
                import('./views/versionManage/MCU.vue'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '版本管理-标准化',
                    isActive: false
                },
                {
                    name: '固件列表-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardVersion/appEdition',
            name: 'APP版本-标准化',
            component: () =>
                import('./views/versionManage/appEdition.vue'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '版本管理-标准化',
                    isActive: false
                },
                {
                    name: 'APP版本-标准化',
                    isActive: true
                },
                ]
            }
        },
        {
            path: '/standardVersion/upgrade',
            name: '升级任务-标准化',
            component: () =>
                import('./views/versionManage/upgrade.vue'),
            meta: {
                keepAlive: true,
                breadcrumbData: [{
                    name: '版本管理-标准化',
                    isActive: false
                },
                {
                    name: '升级任务-标准化',
                    isActive: true
                }
                ]
            }
        },
    ]
}
