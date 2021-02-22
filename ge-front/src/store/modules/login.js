// import api from '@/config/api'
import Ax from '@/apiConfig/axios'
import store from '@/store'
import router from '@/router'
import sorting from '@/utils/sorting.js'
import url from '@/apiConfig/api'
import {
	Message,
} from 'iview'

const state = {
	login: false,
	codeId: '',
	code: '',
}

const getters = {
	doneTodos: state => {
		return state.login
	}
}

const mutations = {
	UPDATA_CODE: (state, data) => {
		state.codeId = data.codeId
		state.code = data.code
	},
	UPDATA_LOGIN: (state, data) => {
		state.login = data
	},
}

const actions = {
	// 获取验证码
	getValidateCode: ({
		commit
	}) => {
		let api = url.common_getCheckCode
		Ax.get(api).then(res => {
			commit('UPDATA_CODE', {
				code: res.data.code,
				codeId: res.data.codeId,
			})
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
	// 登录
	handleLogin: ({
		commit
	}, para) => {
		let api = url.account_login
		Ax.post(api, para).then(res => {
			if (res.success) {
				Message.success('登录成功')
				res.data.permissions = sorting(res.data.permissions)
				commit('UPDATA_LOGIN', true)
				sessionStorage.setItem('customerId', res.data.customerId)
				sessionStorage.setItem('token', res.data.token)
				sessionStorage.setItem('userName', JSON.stringify(para.userName))
				sessionStorage.setItem('permission', JSON.stringify(res.data.permissions))
				sessionStorage.setItem('model', JSON.stringify(res.data.permissions[0].name))
				sessionStorage.setItem('menu', JSON.stringify(res.data.permissions[0].child == undefined ? [] : res.data.permissions[0].child));
				commit('UPDATA_MENU', res.data.permissions[0].child == undefined ? [] : res.data.permissions[0].child)
				commit('UPDATA_PERMISSION', res.data.permissions)
				commit('UPDATA_USERNAME', para.userName)
				commit('UPDATA_CUSTOMERID', res.data.customerId)
				commit('UPDATA_TOKEN', res.data.token)
				commit('UPDATA_MODEL', res.data.permissions[0].name)
				if (res.data.permissions[0].name == 'dataSystem') {
					router.push({
						path: '/'
					})
				} else if (res.data.permissions[0].name == 'manageSystem') {
					router.push({
						path: store.state.user.menu[0].child[0].path
					})
				} else {
					router.push({
						path: '/qcHome'
					})
				}
				store.dispatch('getPermissionTree')
				store.dispatch('getRegion')
				store.dispatch('getAccountsList')
				store.dispatch('getProductList', res.data.customerId)
				store.dispatch('getCustomer')
			} else {
				store.dispatch('getValidateCode')
			}
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
	// 登出
	handleLogout: ({
		commit
	}, para) => {
		if (state.login) {
			commit('UPDATA_LOGIN', false)
			if (para == '101' || para == '102') {
				Message.error('登录超时，请重新登录')
			}
		}
		store.dispatch('handleClearUserInfo')
		router.push({
			path: 'login'
		})
	},
}

export default {
	state,
	getters,
	mutations,
	actions
}