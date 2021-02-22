import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
//
// // iView 完整引入
import iView from 'iview'
import {
	message
} from 'iview'
import 'iview/dist/styles/iview.css'
Vue.prototype.$Message = message

// 引入全局表格组件
import components from '@/components/components.js';
Vue.use(components);

// 基础样式导入
import './style/base.css'

// 引入全局api文档
import api from './apiConfig/api'
Vue.prototype.$api = api  

// 引入axios实例
import Ax from './apiConfig/axios'
Vue.prototype.$Ax = Ax

import Crm from './apiConfig/crm'
Vue.prototype.$Crm = Crm

// 全局引入echarts
// var echarts = require('echarts');
// Vue.prototype.$Echarts = echarts

// 引入全局数据处理方法
import utils from './utils/dealNullData.js'
Vue.prototype.$Utils = utils

// 引入md5

// 引入mock
// require('@/mock/index.js')
//
Vue.use(iView)
//
// Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')