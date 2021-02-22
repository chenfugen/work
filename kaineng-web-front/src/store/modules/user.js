const state = {
	userName: JSON.parse(sessionStorage.getItem('userName')) || '--',
	token: sessionStorage.getItem('token') || '',
	permission: JSON.parse(sessionStorage.getItem('permission')) || [],
	menu: JSON.parse(sessionStorage.getItem('menu')) || [],
	model: JSON.parse(sessionStorage.getItem('model')) || '/',
	active_menu: JSON.parse(sessionStorage.getItem('active_menu')) || {},
	showSwitch: JSON.parse(sessionStorage.getItem('showSwitch')) || {},
	customerId: sessionStorage.getItem('customerId') || '',
}

const getters = {}

const mutations = {
	UPDATA_USERNAME: (state, data) => {
		state.userName = data
	},
	UPDATA_MENU: (state, data) => {
		state.menu = data
	},
	UPDATA_PERMISSION: (state, data) => {
		state.permission = data
	},
	UPDATA_TOKEN: (state, data) => {
		state.token = data
	},
	UPDATA_MODEL: (state, data) => {
		state.model = data
	},
	UPDATA_ACTIVE_MENU: (state, data) => {
		state.active_menu = data
	},
	UPDATA_SWITCH: (state, data) => {
		state.showSwitch = data
	},
	UPDATA_CUSTOMERID: (state, data) => {
		state.customerId = data
	}
}

const actions = {
	// 清空用户数据
	handleClearUserInfo: () => {
		sessionStorage.clear()
	},
	// 修改当前模块
	handleChangeModel: ({
		commit
	}, para) => {
		sessionStorage.removeItem('model')
		sessionStorage.setItem('model', JSON.stringify(para));
		let list = JSON.parse(sessionStorage.getItem('permission'))
		//let childPath = '';
		for (let i in list) {
			if (list[i].name == para) {
				sessionStorage.removeItem('menu')
				sessionStorage.setItem('menu', JSON.stringify(list[i].child == undefined ? [] : list[i].child));
				commit('UPDATA_MENU', list[i].child == undefined ? [] : list[i].child)
				//childPath = para == 'dataSystem' ? '/' : para == 'manageSystem' ? list[i].child[0].child[0].path : '/qcSystem'
			}
		}
		commit('UPDATA_MODEL', para)
	},
	// 修改当前展开菜单
	handleChangeActiveMenu: ({
		commit
	}, para) => {
		let obj = {
			active_name: para.name,
			active_module: para.module,
		}
		commit('UPDATA_ACTIVE_MENU', obj)
		sessionStorage.setItem('active_menu', JSON.stringify(obj));
	},
	handleUpdateSwitch: ({
		commit
	}, para) => {
		commit('UPDATA_SWITCH', para)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}