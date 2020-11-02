import Vue from 'vue'
//数据中心
import store from './store'

//路由组件
import VueRouter from 'vue-router'
import routers from './router'
//heades数据请求
import Axios from './axios'
import GetAir from './axios/getAir.js'
//上传文件
import Upload from './axios/upload.js'

//正常数据请求
import Ax from './axios/common.js'
//ui框架
import Vant from 'vant'
import 'vant/lib/index.css'
//图表
import echarts from 'echarts'
//地图
import VueAMap from 'vue-amap'
//cookie
import VueCookies from 'vue-cookies'

//滑动
import VueTouch from 'vue-touch'

//过滤器
import vueFilter from '../static/js/filter.js'
import App from './App'
Vue.config.productionTip = false

//注入
Vue.prototype.$Axios=Axios
Vue.prototype.$Upload=Upload
Vue.prototype.$Ax=Ax
Vue.prototype.$GetAir=GetAir
Vue.prototype.$echarts = echarts
Vue.use(Vant);
Vue.use(VueRouter);
Vue.use(VueCookies)
Vue.use(VueAMap);
Vue.use(VueTouch, {name: 'v-touch'})

var router = new VueRouter({
	routes: routers
})

router.afterEach(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
})


for (let key in vueFilter){ 
   Vue.filter(key,vueFilter[key]) 
}


const FastClick = require('fastclick')
FastClick.attach(document.body);


/* eslint-disable no-new */
VueAMap.initAMapApiLoader({
	key: 'eb0a2b2199fbc67ac5b3c84faf91d519',
	plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor', 'Geolocation', 'Geocoder', 'MarkerClusterer','AMap.CitySearch'],
	uiVersion: '1.0',
	v: '1.4.4'
});

const windowHeight = window.innerHeight
Vue.directive('fixedInput', function (el, binding) {
  el.addEventListener('blur', function () {
    let windowFocusHeight = window.innerHeight
    if (windowHeight == windowFocusHeight) {
      return
    }
    let currentPosition;
    let speed = 1; //页面滚动距离
    currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    currentPosition -= speed;
    window.scrollTo(0, currentPosition); //页面向上滚动
    currentPosition += speed; //speed变量
    window.scrollTo(0, currentPosition); //页面向下滚动
  })
})

//调用原生
var onPlusReady = function (callback, context = this) {
  if (window.plus) {
    callback.call(context)
  } else {
    document.addEventListener('plusready', callback.bind(context))
  }
}
Vue.mixin({
  beforeCreate () {
    onPlusReady(() => {
      this.plusReady = true
    }, this)
  },
  methods: {
    onPlusReady: onPlusReady
  }
})

new Vue({
	el: '#app',
	router,
	store, //使用store
	render: h => h(App)
})