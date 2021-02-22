import Vue from 'vue'
import iView from 'iview'
import Router from 'vue-router'
import store from '@/store'
import routes from '@/router/routes'

Vue.use(Router)

const RouterConfig = {
	// mode: 'history',
	routes
}
const router = new Router(RouterConfig)

// 路由跳转前
router.beforeEach((to, from, next) => {
	if (to.meta.module == "dataSystem") {
		store.dispatch('handleChangeModel', 'dataSystem')
	} else if (to.meta.module == "qcSystem") {
		store.dispatch('handleChangeModel', 'qcSystem')
	} else {
		store.dispatch('handleChangeModel', 'manageSystem')
	}
	store.dispatch('handleUpdateSwitch', to.meta.name == 'serviceMenu' ? 1 : 0)
	iView.LoadingBar.start();
	let token = !sessionStorage.getItem('token'),
		path = to.path
	if (token && path == '/login' ||   path == '/deviceInfo') {
		next()
	} else if (token && path != '/login') {
		next({
			path: '/login'
		})
	} else {
		next()
	}
	store.dispatch('handleChangeActiveMenu', to.meta)
})

// 路由跳转后
router.afterEach(() => {
	iView.LoadingBar.finish();
})

export default router