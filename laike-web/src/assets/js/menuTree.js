const standard = [
    //     {
    //     name: '设备管理',
    //     index: "/device/", icon: 'icondevice',
    //     child: [{
    //         name: '智能烹饪机',
    //         // path: '/device/chefMachine',
    //     }]
    // },
    {
        name: '故障管理',
        index: "/fault", icon: 'icongantanhao',
        child: [{
            name: '故障统计',
            path: '/standardFault/statistical',
        }, {
            name: '故障记录',
            path: '/standardFault/record',
        }, {
            name: '故障代码',
            path: '/standardFault/code',
        }]
    },
    {
        name: '菜谱管理',
        index: "/menuStandard", icon: 'iconcookbook',
        child: [{
            name: '菜谱清单',
            path: '/menuStandard/list',
        }, {
            name: '菜谱类别配置',
            path: '/menuStandard/typeConfig',
        }, {
            name: '菜谱模板配置',
            path: '/menuStandard/templateConfig',
        }]
    },
    // {
    //     name: '厂测管理',
    //     index: "/planSurvey", icon: 'iconcheck',
    //     child: [{
    //         name: '厂测统计',
    //     }, {
    //         name: '厂测列表',
    //     }]
    // },
    {
        name: '产品管理',
        index: "/standardProduct",
        icon: 'iconproduct',
        child: [{
            name: '产品类型',
            path: '/standardProduct/type',
        }, {
            name: '产品型号',
            path: '/standardProduct/module',
        }]
    },
    {
        name: '消息推送',
        index: "/standardMessage",
        icon: 'iconmessage',
        child: [{
            name: '消息记录',
            path: '/standardMessage/record',
        }, {
            name: '消息反馈',
            path: '/standardMessage/feedback',
        }]
    }, {
        name: '版本管理',
        index: "/standardVersion",
        icon: 'iconbanben',
        child: [{
            name: '版本类别配置',
            path: '/standardVersion/versionClassSet',
        }, {
            name: '固件列表',
            path: '/standardVersion/mcu',
        }, {
            name: 'APP版本',
            path: '/standardVersion/appEdition',
        }, {
            name: '升级任务',
            path: '/standardVersion/upgrade',
        }]
    },
    // {
    //     name: '消息中心',
    //     index: "/message", icon: 'iconmessage',
    //     child: [{
    //         name: '推送记录',
    //     }, {
    //         name: '消息反馈',
    //     }]
    // }, {
    //     name: '用户管理',
    //     index: "/user", icon: 'iconuser',
    //     child: [{
    //         name: '用户中心',
    //     }]
    // }, {
    //     name: '系统管理',
    //     index: "/system", icon: 'iconsystem',
    //     child: [{
    //         name: '账号管理',
    //     }, {
    //         name: '系统日志',
    //     }, {
    //         name: '广告管理',
    //     }, {
    //         name: '通用设置',
    //     }]
    // }
]

const oldMenu = [{
    name: '设备管理',
    index: "/device/",
    icon: 'icondevice',
    child: [{
        name: '智能烹饪机',
        path: '/device/chefMachine',
    }]
}, {
    name: '故障管理',
    index: "/fault",
    icon: 'icongantanhao',
    child: [{
        name: '故障统计',
        path: '/fault/statistics',
    }, {
        name: '故障记录',
        path: '/fault/record',
    }, {
        name: '故障代码',
        path: '/fault/code',
    }]
}, {
    name: '菜谱管理',
    index: "/menu",
    icon: 'iconcookbook',
    child: [{
        name: '菜谱统计',
        path: '/menu/statistics',
    }, {
        name: '菜谱清单',
        path: '/menu/list',
    }, {
        name: '菜谱配置',
        path: '/menu/menuType',
    }]
}, {
    name: '厂测管理',
    index: "/planSurvey",
    icon: 'iconcheck',
    child: [{
        name: '厂测统计',
        path: '/planSurvey/statistics',
    }, {
        name: '厂测列表',
        path: '/planSurvey/list',
    }]
}, {
    name: '产品管理',
    index: "/product",
    icon: 'iconproduct',
    child: [{
        name: '产品类型',
        path: '/product/type',
    }]
}, {
    name: '消息中心',
    index: "/message",
    icon: 'iconmessage',
    child: [{
        name: '推送记录',
        path: '/message/newPush',
    }, {
        name: '消息反馈',
        path: '/message/feedback',
    }]
}, {
    name: '用户管理',
    index: "/user",
    icon: 'iconuser',
    child: [{
        name: '用户中心',
        path: '/user/center',
    }]
}, {
    name: '版本管理',
    index: "/edition",
    icon: 'iconbanben',
    child: [{
        name: 'MCU固件',
        path: '/edition/mcu',
    }, {
        name: 'DTU固件',
        path: '/edition/wifi',
    }, {
        name: 'APP版本',
        path: '/edition/app',
    }, {
        name: '多固件管理',
        path: '/edition/moreFirmware',
    }]
}, {
    name: '系统管理',
    index: "/system",
    icon: 'iconsystem',
    child: [{
        name: '账号管理',
        path: '/system/systemAccount',
    }, {
        name: '系统日志',
        path: '/system/systemRecord',
    }, {
        name: '广告管理',
        path: '/system/advert',
    }, {
        name: '通用设置',
        path: '/system/systemSet',
    }]
}]

module.exports = {
    standard: standard,
    oldMenu: oldMenu,
}
