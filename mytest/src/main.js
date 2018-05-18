import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routers from './router.js'
import App from './App.vue'



Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(VueResource);

Vue.http.options.emulateHTTP = true;
Vue.http.options.emulateJSON = true;

var router = new VueRouter({
	routes: routers
})
new Vue({
	el: '#app',
	router,
	render: h => h(App)
})