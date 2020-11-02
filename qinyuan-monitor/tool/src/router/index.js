import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/login.vue'

import sampling from '../views/sampling/sampling.vue'
import log from '../views/sampling/log.vue'
import search from '../views/sampling/search.vue'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'login',
		component: login
	},
	{
		path: '/sampling',
		name: 'sampling',
		component: sampling
	},
	{
		path: '/search',
		name: 'search',
		component: search
	},
	{
		path: '/log',
		name: 'log',
		component:log
	}
]

const router = new VueRouter({
	base: process.env.BASE_URL,
	routes
})

export default router
