import Vue from 'vue'
import Vuex from 'vuex'

// Vuex 模块引入
import oldStore from '@/store/modules/oldStore'
import standard from '@/standard/store/standard'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        oldStore,
        standard,
    }
})
