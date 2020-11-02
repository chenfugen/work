import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store/store'
import store from './store/index'
import http from './service'
import './assets/iconfont/iconfont.css'
import sidebar from '@/components/sidebar.vue'//左侧导航栏
import headComp from '@/components/headComp.vue'//头部
import table from '@/components/table.vue'//表格组件
import tableSearch from '@/components/tableSearch.vue'//表格搜索组件
import ElementUI from 'element-ui'//element-ui
import 'element-ui/lib/theme-chalk/index.css'//element-css
import echarts from 'echarts' //引入echarts
import './assets/css/glob.css' //引入私有覆盖element样式
// import '@/libs/filter' //引入过滤器文件
import * as filters from '@/libs/filter'
import { MessageBox } from 'element-ui';
import { showLoading, hideLoading } from './libs/loading';
import VueCropper from 'vue-cropper'

import staticData from '@/assets/js/staticData';
import VueDND from 'awe-dnd'; // 拖拽
Vue.use(VueDND) // 拖拽
Vue.use(VueCropper)
Vue.use(ElementUI)
Vue.config.productionTip = false;
// 静态数据
Vue.prototype.$staticData = staticData;
Vue.prototype.$echarts = echarts;
Vue.prototype.$http = http;
Vue.prototype.$filters = filters;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$hideLoading = hideLoading;
// 全局组件
Vue.component('sidebar', sidebar);
Vue.component('headComp', headComp);
Vue.component('comTable', table);
Vue.component('TableSearch', tableSearch);

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

// 路由拦截器
router.beforeEach((to, from, next) => {
    if (!store.state.oldStore.token && (to.path != '/login' && to.path.indexOf('/menu/details') == -1 && to.path != '/device/details')) {
        next('/login');
    } else {
        // 针对菜谱页面的表格筛选
        if (!['/menu/addNew', '/menu/update', '/menu/list', '/menu/menuChildAdd', '/menu/menuChildEdit'].includes(to.path)) {
            store.commit('del_menus', true);//清空菜谱筛选信息
        }
        // 针菜谱表单页面跳转拦截
        if ((['/menu/addNew', '/menu/update', '/menu/menuChildEdit', '/menu/menuChildAdd'].includes(from.path)) && store.state.oldStore.riving) {
            // console.log('阻止跳转', store.state.oldStore.riving);
            MessageBox.confirm('此操作将不会保存菜谱信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                confirmButtonClass: 'el-button--danger',
                type: 'warning'
            }).then(() => {
                next()
            }).catch(() => {
            });
        } else {
            next()
        }
    }
})
