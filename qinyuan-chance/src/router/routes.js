// 组件导入
// 登录
const Login = () =>
	import ('@/views/Login')
//
const SysLayout = () =>
	import ('@/views/common/layouts/Layout')
// 产测页面
const Chance = () =>
	import ('@/views/chance/chance')
// 开始产测
const ChanceStart = () =>
	import ('@/views/chance/chanceStart')
// 秘钥烧录列表
const KeyEnterList = () =>
	import ('@/views/keyEnter/keyEnterList')
// 秘钥烧录列表
const KeyEnterHis = () =>
	import ('@/views/keyEnter/keyEnterHis')
// 秘钥烧录
const KeyEnter = () =>
	import ('@/views/keyEnter/keyEnter')
// 工厂管理
const FactoryList = () =>
	import ('@/views/factory/factoryList')
// 产测管理
const ProductionLine = () =>
	import ('@/views/factory/productionLine')
// 产品列表
const ProductList = () =>
	import ('@/views/product/productList')
// 产品详情
const ProductInfo = () =>
	import ('@/views/product/productInfo')
// 在线设备
const DeviceOnline = () =>
	import ('@/views/device/deviceOnline')
// 设备详情
const DeviceInfo = () =>
	import ('@/views/device/deviceInfo')
// 完成设备
const CompleteList = () =>
	import ('@/views/device/completeList')
// 固件列表
const FirmwareList = () =>
	import ('@/views/firmware/firmwareList')
// 秘钥列表
const keyList = () =>
	import ('@/views/key/keyList')
// 秘钥详情
const keyInfo = () =>
	import ('@/views/key/keyInfo')
// 秘钥导入
const keyInput = () =>
	import ('@/views/key/keyInput')
// 用户管理
const UserList = () =>
	import ('@/views/system/userList')
// 角色管理
const RoleList = () =>
	import ('@/views/system/roleList')
// 角色详细
const RoleInfo = () =>
	import ('@/views/system/roleInfo')

// 路由配置
export default [{
	path: '/login',
	name: 'Login',
	component: Login
}, {
	path: '/',
	redirect: '/',
	name: 'SysLayout',
	component: SysLayout,
	children: [{
		path: '/',
		name: 'chance',
		meta: {
			parent: '产品产测'
		},
		component: Chance
	}, {
		path: '/chanceStart',
		name: 'chanceStart',
		meta: {
			parent: '产品产测',
			children: '开始产测'
		},
		component: ChanceStart
	}, {
		path: '/keyEnterList',
		name: 'keyEnterList',
		meta: {
			parent: '秘钥烧录'
		},
		component: KeyEnterList
	}, {
		path: '/keyEnterList/keyEnter',
		name: 'keyEnter',
		meta: {
			parent: '秘钥烧录',
			children: '烧录页面'
		},
		component: KeyEnter
	}, {
		path: '/factory/factoryList',
		name: 'factoryList',
		meta: {
			parent: '工厂管理',
			children: '工厂列表'
		},
		component: FactoryList
	}, {
		path: '/factory/productionLine',
		name: 'productionLine',
		meta: {
			parent: '工厂管理',
			children: '产线列表'
		},
		component: ProductionLine
	}, {
		path: '/product/productList',
		name: 'productList',
		meta: {
			parent: '产品管理',
			children: '产品列表'
		},
		component: ProductList
	}, {
		path: '/product/productInfo',
		name: 'productInfo',
		meta: {
			parent: '产品管理',
			children: '产品详情'
		},
		component: ProductInfo
	}, {
		path: '/device/deviceOnline',
		name: 'deviceOnline',
		meta: {
			parent: '设备管理',
			children: '在线设备'
		},
		component: DeviceOnline
	}, {
		path: '/device/deviceInfo',
		name: 'deviceInfo',
		meta: {
			parent: '设备管理',
			children: '设备详情'
		},
		component: DeviceInfo
	}, {
		path: '/device/completeList',
		name: 'completeList',
		meta: {
			parent: '设备管理',
			children: '完成设备'
		},
		component: CompleteList
	}, {
		path: '/firmware/firmwareList',
		name: 'firmwareList',
		meta: {
			parent: '固件管理',
			children: '固件列表'
		},
		component: FirmwareList
	}, {
		path: '/key/keyList',
		name: 'keyList',
		meta: {
			parent: '秘钥管理',
			children: '秘钥列表'
		},
		component: keyList
	}, {
		path: '/key/keyInfo',
		name: 'keyInfo',
		meta: {
			parent: '秘钥管理',
			children: '秘钥详情'
		},
		component: keyInfo
	}, {
		path: '/key/keyInput',
		name: 'keyInput',
		meta: {
			parent: '秘钥管理',
			children: '秘钥导入'
		},
		component: keyInput
	}, {
		path: '/system/userList',
		name: 'userList',
		meta: {
			parent: '系统管理',
			children: '用户列表'
		},
		component: UserList
	}, {
		path: '/system/roleList',
		name: 'roleList',
		meta: {
			parent: '系统管理',
			children: '角色管理'
		},
		component: RoleList
	}, {
		path: '/system/roleInfo',
		name: 'roleInfo',
		meta: {
			parent: '系统管理',
			children: '角色详细'
		},
		component: RoleInfo
	}]
}, {
	path: '*',
	name: 'NotFound',
	component: resolve => {
		require(['@/views/common/pages/NotFound'], resolve)
	}
}]