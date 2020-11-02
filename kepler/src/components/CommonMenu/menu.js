export default [
  {
    name: '设备中心',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '/device'
  },
  {
    name: '一维分析',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '/analysis/single'
  },
  {
    name: '多维分析',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '/analysis/multiple'
  },
  {
    name: '对比分析',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '/analysis/contrastive'
  },
  {
    name: '异常分析',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '/analysis/abnormal'
  },
  {
    name: '缺陷跟踪',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '/defects'
  },
  {
    name: '系统管理',
    accessType: 'menu',
    state: 'Y',
    operationType: '',
    url: '#',
    children: [
      {
        name: '产品型号',
        accessType: 'menu',
        state: 'Y',
        operationType: '',
        url: '/system/model'
      },
      {
        name: '角色管理',
        accessType: 'menu',
        state: 'Y',
        operationType: '',
        url: '/system/role'
      },
      {
        name: '菜单管理',
        accessType: 'menu',
        state: 'Y',
        operationType: '',
        url: '/system/menu'
      },
      {
        name: '账号管理',
        accessType: 'menu',
        state: 'Y',
        operationType: '',
        url: '/system/account'
      },
      {
        name: '操作日志',
        accessType: 'menu',
        state: 'Y',
        operationType: '',
        url: '/system/log'
      }
    ]
  }
]
