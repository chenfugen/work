import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/login.vue'
import home from '../views/home/home.vue'

import taskOrder from '../views/filter/taskOrder.vue'
import taskLog from '../views/filter/taskLog.vue'
import taskLogDetail from '../views/filter/taskLogDetail.vue'
import orderDetail from '../views/filter/orderDetail.vue'
import recheck from '../views/filter/recheck.vue'


import sampling from '../views/sampling/sampling.vue'

import configuration from '../views/systemManage/configuration.vue'
import log from '../views/systemManage/log.vue'
import factoryManage from '../views/systemManage/factoryManage.vue'
import productManage from '../views/systemManage/productManage.vue'
import staffManage from '../views/systemManage/staffManage.vue'
import roleManage from '../views/systemManage/roleManage.vue'
import productionLine from '../views/systemManage/productionLine.vue'
 

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'login',
		component:login
	},
	{
		path: '/home',
		component: home,
		name: '滤芯产测',
		redirect: taskOrder,
		children: [{
				path: '/taskOrder',
				name: '任务工单',
				component: taskOrder,
			}, {
				path: '/taskLog',
				name: '生产记录',
				component: taskLog,
			},{
				path: '/taskLogDetail/:id/:taskId',
				name: '生产记录详情',
				component: taskLogDetail,
			},
			{
				path: '/orderDetail/:id',
				name: '任务工单详情',
				component: orderDetail,
			},
			{
				path: '/recheck/:id',
				name: '复检',
				component: recheck,
			}		
		]
	},
	{
		path: '/home',
		component: home,
		name: '成品抽检',
		redirect: sampling,
		children: [{
				path: '/sampling',
				name: '开始抽检',
				component: sampling,
			}
		]
	},
	{
		path: '/home',
		component: home,
		name: '系统管理',
		redirect: factoryManage,
		children: [{
				path: '/factoryManage',
				name: '工厂管理',
				component: factoryManage,
			},
			{
				path: '/productionLine/:id/:status/:name',
				name: '产线管理',
				component: productionLine,
			},
			{
				path: '/staffManage',
				name: '员工管理',
				component: staffManage,
			},
			{
				path: '/roleManage',
				name: '角色管理',
				component: roleManage,
			},
			{
				path: '/productManage',
				name: '产品管理',
				component: productManage,
			},{
				path: '/log',
				name: '日志记录',
				component: log,
			},
			{
				path: '/configuration',
				name: '工装机配置',
				component: configuration,
			}
		]
	}
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	routes
})

export default router
