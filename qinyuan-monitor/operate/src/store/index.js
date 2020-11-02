import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  axiosTime:Date.parse(new Date()),
	  accesskey:"d8765ee8827047be86dcd954bb385621"  
  },
  mutations: {
	  updateTime(state){
		state.axiosTime=Date.parse(new Date());
	  }
  },
  actions: {
  },
  modules: {
  }
})
