import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Api from './axios/api.js'
import Axios from './axios/axios.js'
import Ax from './axios/common.js'
import './assets/css/iconfont.css'
import vueFilter from './assets/js/filter.js'
import VueCookies from 'vue-cookies'
//ui框架
import Vant from 'vant'
import 'vant/lib/index.css'

for (let key in vueFilter) {
	Vue.filter(key, vueFilter[key])
}

//注入
Vue.prototype.$Axios = Axios
Vue.prototype.$Ax = Ax
Vue.prototype.$Api = Api
Vue.use(Vant);
Vue.config.productionTip = false
Vue.use(VueCookies);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
