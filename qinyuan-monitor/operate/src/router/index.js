import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/login.vue'
import home from '../views/home/home.vue'
import digitalStatistics from '../views/digital/digital-statistics.vue'
import digitalSend from '../views/digital/digital-send.vue'
import digitalManage from '../views/digital/digital-manage.vue'

import deviceList from '../views/device/deviceList.vue'
import deviceManage from '../views/device/deviceManage.vue'
import deviceDetail from '../views/device/deviceDetail.vue'

import productionSet from '../views/configServer/productionSet.vue'

import userList from '../views/user/userList.vue'

import customerService from '../views/customer/customer-service.vue'
import activateLog from '../views/customer/activateLog.vue'
import devices from '../views/customer/devices.vue'
import resetLog from '../views/customer/resetLog.vue'

import emailManage from '../views/systemManage/emailManage.vue'
import log from '../views/systemManage/log.vue'
import staffManage from '../views/systemManage/staffManage.vue'
import supplierManage from '../views/systemManage/supplierManage.vue'
import roleManage from '../views/systemManage/roleManage.vue'
import deviceLog from '../views/systemManage/deviceLog.vue'
Vue.use(VueRouter)
const routes = [{
		path: '/',
		name: 'login',
		component: login
	},
	{
		path: '/home',
		component: home,
		name: '滤芯产测',
		redirect: digitalStatistics,
		children: [{
				path: '/digitalStatistics',
				name: '数码统计',
				component: digitalStatistics,
			}, {
				path: '/digitalSend',
				name: '生产记录',
				component: digitalSend,
			},
			{
				path: '/digitalManage',
				name: '任务工单详情',
				component: digitalManage,
			}
		]
	},
	{
		path: '/home',
		name: '设备管理',
		component: home,
		redirect: deviceList,
		children: [{
				path: '/deviceManage',
				name: '设备管理',
				component: deviceManage,
			},
			{
				path: '/deviceDetail/:id/:productKey/:source',
				name: '设备详情',
				component: deviceDetail,
			}
		]
	},
	{
		path: '/home',
		name: '配置中心',
		component: home,
		redirect: productionSet,
		children: [{
			path: '/productionSet',
			name: '产品设置',
			component: productionSet,
		}]
	},
	{
		path: '/home',
		name: '用户管理',
		component: home,
		redirect: userList,
		children: [{
			path: '/userList',
			name: '用户列表',
			component: userList,
		}]
	},
	{
		path: '/home',
		name: '客户中心',
		component: home,
		redirect: customerService,
		children: [{
				path: '/customerService',
				name: '客服服务',
				component: customerService,
			}, {
				path: '/resetLog/:id',
				name: '复位记录',
				component: resetLog,
			},
			{
				path: '/activateLog/:sn/:id',
				name: '激活记录',
				component: activateLog,
			},
			{
				path: '/devices',
				name: '设备列表',
				component: devices,
			}
		]
	},
	{
		path: '/home',
		component: home,
		name: '系统管理',
		redirect: emailManage,
		children: [{
				path: '/emailManage',
				name: '邮箱管理',
				component: emailManage,
			},
			{
				path: '/staffManage',
				name: '员工管理',
				component: staffManage,
			},
			{
				path: '/supplierManage',
				name: '供应商管理',
				component: supplierManage,
			},
			{
				path: '/roleManage',
				name: '角色管理',
				component: roleManage,
			}, {
				path: '/log',
				name: '日志记录',
				component: log,
			},
			{
				path: '/deviceLog',
				name: '设备日志',
				component: deviceLog,
			}
		]
	}
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	routes
})

export default router
