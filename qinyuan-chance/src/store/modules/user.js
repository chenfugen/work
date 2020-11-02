import Ax from '@/config/axios'
import api from '@/config/api'
import store from '@/store'
// import document.cookie from 'js-cookie'

const state = {
	userName: sessionStorage.getItem('userName') ? sessionStorage.getItem('userName') : '', // 用户名
}

const getters = {
	getUserName: state => state.userName
}

const mutations = {
	// 更新加载状态
	USERNAME: (state, data) => {
		// state.userName = data
		sessionStorage.setItem('userName', data)
	}
}

const actions = {
	// 登陆
	login: ({
		commit
	}, para) => {
		Ax.post(api.account_login, para).then(res => {
			if (res.data.success) {
				sessionStorage.setItem('token', res.data.data.token)
				sessionStorage.setItem('userName', para.userName)
				if (res.data.data.rolePermission == 'root') {
					store.dispatch('handleMenu', menuList)
				} else {
					store.dispatch('handleMenu', res.data.data.rolePermission)
				}
			}
		}).catch(err => {
			console.log(err);
		})
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}