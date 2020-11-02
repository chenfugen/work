import Vue from 'vue'
import iView from 'iview'
import Router from 'vue-router'
import store from '../store'
import routes from '@/router/routes'
// import document.cookie from 'js-cookie'

Vue.use(Router)

// 路由配置
const RouterConfig = {
	// mode: 'history',
	routes
}

const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
	iView.LoadingBar.start();
	if (to.path === '/login') {
		sessionStorage.clear()
	}
	// 面包屑
	store.commit('BREAD', {
		parent: to.meta.parent,
		children: to.meta.children
	})
	if (!sessionStorage.getItem('token') && to.path !== '/login') {
		// console.log(to);
		// iView.Message.info('登录失效，请重新登陆！')
		next({path: '/login'})
	} else {
		next()
	}
})

router.afterEach((to) => {
	iView.LoadingBar.finish();
});

export default router
