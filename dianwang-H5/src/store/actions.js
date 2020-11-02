export default {
	updateDeviceInfo:({
		commit
	}, payload) => {
		commit('changeDevice',payload)
	},
	updateUserInfo: ({
		commit
	}, payload) => {
		commit('changeUserInfo',payload)
	},
	updateDeviceList: ({
		commit
	},payload)=>{
		commit('changeDeviceList',payload)
	},
	updateClient: ({
		commit
	},payload)=>{
		commit('changeClient',payload)
	}
}