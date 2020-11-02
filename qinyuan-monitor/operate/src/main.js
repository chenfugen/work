import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Api from './axios/api.js'
import Axios from './axios/axios.js'
import Ax from './axios/common.js'
import Download from './axios/download.js'
import VueCookies from 'vue-cookies'

import './plugins/element.js'
import './assets/css/iconfont.css'


let vueFilter = require('./assets/js/filter.js');
for (let key in vueFilter) {
	Vue.filter(key, vueFilter[key])
}
//注入
Vue.prototype.$Axios = Axios
Vue.prototype.$Ax = Ax
Vue.prototype.$Api = Api
Vue.prototype.$Download = Download
Vue.use(VueCookies);

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
