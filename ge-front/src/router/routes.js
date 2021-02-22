// 主模板
const SysLayout = () =>
	import ('@/views/index/sysLayout')
//产测首页
const QcSystem = () =>
	import ('@/views/qcSystem/qcHome')
//登录页
const Login = () =>
	import ('@/views/login')
//首页
const Home = () =>
	import ('@/views/index/home')
// 产品管理
const ProductList = () =>
	import ('@/views/product/productList')
// 设备管理
const DeviceList = () =>
	import ('@/views/device/deviceList')

//设备详情页（单开）
const DeviceInfo = () =>
	import('@/views/deviceInfo')
	
// 设备详情
const DeviceSetUp = () =>
	import ('@/views/device/deviceSetUp')
// 用户列表
const UserList = () =>
	import ('@/views/user/userList')
// 账户列表
const AccountList = () =>
	import ('@/views/system/accountList')
// 角色列表
const RoleList = () =>
	import ('@/views/system/roleList')
// 服务列表
const ServerList = () =>
	import ('@/views/serve/serverList')
// 日志列表
const LogList = () =>
	import ('@/views/system/logList')
// 故障列表
const FaultList = () =>
	import ('@/views/fault/faultList')
// 固件列表
const FirmwareList = () =>
	import ('@/views/firmware/firmwareList')

// 产测平台/产测管理/产测记录
const productTestRecord = () =>
	import('@/views/qcSystem/productTest/productTestRecord')
// 产测平台/产测管理/产测详情
const productTestDetail = () =>
	import('@/views/qcSystem/productTest/productTestDetail')

// 产测平台/产品管理/产品列表
const productManageList = () =>
	import('@/views/qcSystem/productManage/productManageList')
// 产测平台/产品管理/产品详情
const productManageDetail = () =>
	import('@/views/qcSystem/productManage/productManageDetail')

// 大客户
const Customers = () =>
	import('@/views/customers/customersList')


// 路由配置
export default [{
	path: '/', //默认路径
	redirect: '/', // 重定向配置
	name: 'sysLayout', // 组件名称（重要，生命周期相关）
	component: SysLayout, // 对应组件
	children: [{
			path: '/',
			name: 'home',
			component: Home,
			meta: {
				breadcrumb: '数据中心',
				module: 'dataSystem',
				name: 'dataMenu',
			}
		}, {
			path: '/productList',
			name: 'productList',
			component: ProductList,
			meta: {
				breadcrumb: '产品列表',
				parentName: '产品管理',
				module: 'productModule',
				name: 'productMenu',
			}
		}, {
			path: '/deviceList',
			name: 'deviceList',
			component: DeviceList,
			meta: {
				breadcrumb: '设备列表',
				parentName: '设备管理',
				module: 'deviceModule',
				name: 'deviceMenu',
			}
		},
		// {
		// 	path: '/deviceInfo',
		// 	name: 'deviceInfo',
		// 	component: DeviceInfo,
		// 	meta: {
		// 		breadcrumb: '设备详情',
		// 		parentName: '设备管理',
		// 		module: 'deviceModule',
		// 		name: 'deviceMenu',
		// 	}
		// },
		{
			path: '/deviceSetUp',
			name: 'deviceSetUp',
			component: DeviceSetUp,
			meta: {
				breadcrumb: '设备设置',
				parentName: '设备管理',
				module: 'deviceModule',
				name: 'deviceMenu',
			}
		}, {
			path: '/userList',
			name: 'userList',
			component: UserList,
			meta: {
				breadcrumb: '用户列表',
				parentName: '用户管理',
				module: 'userModule',
				name: 'userMenu',
			}
		}, {
			path: '/accountList',
			name: 'accountList',
			component: AccountList,
			meta: {
				breadcrumb: '账号列表',
				parentName: '系统管理',
				module: 'systemModule',
				name: 'accountMenu',
			}
		}, {
			path: '/roleList',
			name: 'roleList',
			component: RoleList,
			meta: {
				breadcrumb: '角色列表',
				parentName: '系统管理',
				module: 'systemModule',
				name: 'roleMenu',
			}
		}, {
			path: '/serverList',
			name: 'serverList',
			component: ServerList,
			meta: {
				breadcrumb: '服务列表',
				parentName: '服务管理',
				module: 'serviceModule',
				name: 'serviceMenu',
			}
		}, {
			path: '/logList',
			name: 'logList',
			component: LogList,
			meta: {
				breadcrumb: '日志列表',
				parentName: '系统管理',
				module: 'systemModule',
				name: 'logMenu',
			}
		}, {
			path: '/firmwareList',
			name: 'firmwareList',
			component: FirmwareList,
			meta: {
				breadcrumb: '固件列表',
				parentName: '固件管理',
				module: 'firmwareModule',
				name: 'firmwareMenu',
			}
		}, {
			path: '/faultList',
			name: 'faultList',
			component: FaultList,
			meta: {
				breadcrumb: '故障列表',
				parentName: '故障管理',
				module: 'faultModule',
				name: 'faultMenu',
			}
		}, {
			path: '/qcHome',
			name: 'qcSystem',
			redirect: '/qcHome/productTestRecord',
			component: QcSystem,
			children: [{
					path: "productTestRecord",
					name: 'qcRecordModule',
					component: productTestRecord,
					meta: {
						breadcrumb: '产测记录',
						parentName: '产测管理',
						module: "qcSystem",
						name: 'qcRecordMenu',
					}
				},
				{
					path: 'productTestRecord/detail',
					name: 'productTestDetail',
					component: productTestDetail,
					meta: {
						breadcrumb: '产测详情',
						parentName: '产测管理',
						module: "qcSystem",
						name: 'productTestDetail',
					}
				},
				{
					path: "productManageList",
					name: 'qcProductModule',
					component: productManageList,
					meta: {
						breadcrumb: '产品列表',
						parentName: '产品管理',
						module: "qcSystem",
						name: 'qcProductMenu',
					}
				},
				{
					path: "productManageList/detail",
					name: 'productManageDetail',
					component: productManageDetail,
					meta: {
						breadcrumb: '产品详情',
						parentName: '产品管理',
						module: "qcSystem",
						name: 'productManageDetail',
					}
				},
				{
					path: "/customers",
					name: 'customers',
					component: Customers,
					meta: {
						breadcrumb: '大客户管理',
						parentName: '大客户管理',
						module: "customers",
						name: 'customersList',
					}
				},
			],
			meta: {
				breadcrumb: '产测首页',
				module: "qcSystem",
				name: 'qcHome',
			}
		}
	]
}, {
	path: '/login', //默认路径
	name: 'login', // 组件名称（重要，生命周期相关）
	component: Login, // 对应组件
},{
	path: '/deviceInfo', //默认路径
	name: 'deviceInfo', // 组件名称（重要，生命周期相关）
	component: DeviceInfo, // 对应组件	
}]