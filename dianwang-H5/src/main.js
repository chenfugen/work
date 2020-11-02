import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
import Vue from 'vue'
import App from './App.vue'
// //数据中心
import store from './store'
//ui框架
import Vant from 'vant'
import 'vant/lib/index.css'
//路由组件
import VueRouter from 'vue-router'
import routers from './router'
//调试工具
//import Vconsole from 'vconsole'
//var vConsole = new Vconsole()

//heades数据请求
import Axios from './axios'
//正常数据请求
import Ax from './axios/common.js'
//cookie
import VueCookies from 'vue-cookies'

Vue.use(Vant);
Vue.use(VueRouter);
Vue.use(VueCookies);
//Vue.use(vConsole)

//注入
Vue.prototype.$Axios = Axios
Vue.prototype.$Ax = Ax


var router = new VueRouter({
	routes: routers
})
router.beforeEach((to, from, next) => {
	VueCookies.set('fullPath',from.fullPath);
	next();
});


router.afterEach(() => {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
})
//过滤器
//import vueFilter from '../static/js/filter.js'
var vueFilter = require('../static/js/filter.js');
for (var key in vueFilter) {
	Vue.filter(key, vueFilter[key])
}
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
