import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// iView 完整引入
import iView from 'iview'
import {
	message
} from 'iview'
import 'iview/dist/styles/iview.css'
Vue.prototype.$Message = message

// 引入全局表格组件
import components from './views/components/components.js';
Vue.use(components);

// 工具函数引入
import Utils from './utils'
Vue.prototype.$Utils = Utils

// 引入cookie
// import document.cookie from 'js-cookie'
// Vue.prototype.$JsCookie = document.cookie


// 基础样式导入
import '@/style/base.css'

// 引入全局api文档
import api from './config/api'
Vue.prototype.$api = api

import axConfig from '@/config/index'
Vue.prototype.$AxConfig = axConfig

// 引入axios实例
import Ax from '@/config/axios'
Vue.prototype.$Ax = Ax


Vue.use(iView)

Vue.config.productionTip = false

new Vue({
	// el: '#app',
	router,
	store,
	render: h => h(App)
	// template: '<App/>',
	// components: {
	//   App
	// }
}).$mount('#app')