import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  axiosTime:Date.parse(new Date()),
	  accesskey:"14a5794afbcd4cffb4076508e062b3cf",
	  filterURL:"weixin.qq.com/r/WkMEHEjEoBXfrQx-9xZI"
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
