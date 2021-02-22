import Ax from '@/apiConfig/axios'
import sorting from '@/utils/sorting.js'
import dealRegion from './dealRegion'
import url from '@/apiConfig/api'

const state = {
	permissionTree: JSON.parse(sessionStorage.getItem('permissionTree')) || [],
	accounts: JSON.parse(sessionStorage.getItem('accounts')) || [],
	region: JSON.parse(sessionStorage.getItem('region')) || [],
	productList: JSON.parse(sessionStorage.getItem('productList')) || [],
	productType: JSON.parse(sessionStorage.getItem('productType')) || [],
	customers: JSON.parse(sessionStorage.getItem('customers')) || [],
}
const getters = {}

const mutations = {
	UPDATA_ALL_PERMISSIONTREE: (state, data) => {
		state.permissionTree = data
	},
	UPDATA_ACCOUNTSLIST: (state, data) => {
		state.accounts = data
	},
	UPDATA_REGION: (state, data) => {
		state.region = data
	},
	UPDATA_PRODUCTLIST: (state, data) => {
		state.productList = data
	},
	UPDATA_PRODUCTTYPE: (state, data) => {
		state.productType = data
	},
	UPDATA_CUSTOMERS: (state, data) => {
		state.customers = data
	},
}

const actions = {
	// 获取全权限树
	getPermissionTree: ({
		commit
	}) => {
		let api = url.common_getPermissionTree
		Ax.get(api).then(res => {
			sessionStorage.setItem('permissionTree', JSON.stringify(sorting(res.data)))
			commit('UPDATA_ALL_PERMISSIONTREE', sorting(res.data))
		}).catch(err => {
			// eslint-disable-next-line
			console.log(err);
		})
	},
	// 获取账户列表
	getAccountsList: ({
		commit
	}) => {
		let api = url.common_getAccounts
		Ax.get(api).then(res => {
			sessionStorage.setItem('accounts', JSON.stringify(sorting(res.data)))
			commit('UPDATA_ACCOUNTSLIST', res.data)
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
	// 获取地区数据
	getRegion: ({
		commit
	}) => {
		let api = url.common_getAddressList
		Ax.get(api).then(res => {
			sessionStorage.setItem('city', JSON.stringify(res.data.city))
			let region = dealRegion(res.data.province, res.data.city)
			sessionStorage.setItem('region', JSON.stringify(region))
			commit('UPDATA_REGION', region)
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
	// 获取产品列表
	getProductList: ({
		commit
	}, para) => {
		let api = url.common_getProducts
		Ax.get(api, {
			params: {
				customerId: para
			}
		}).then(res => {
			sessionStorage.setItem('productList', JSON.stringify(res.data))
			commit('UPDATA_PRODUCTLIST', res.data)
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
	// 获取产品型号数据
	getProductType: ({
		commit
	}) => {
		let api = url.common_getProducts,
			para = {
				customerId: store.state.user.customerId
			}
		Ax.get(api, {
			params: para
		}).then(res => {
			sessionStorage.setItem('ProductType', JSON.stringify(res.data))
			commit('UPDATA_PRODUCTTYPE', res.data)
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
	// 获取大客户数据
	getCustomer: ({
		commit
	}) => {
		let api = url.common_getCustomers
		Ax.get(api).then(res => {
			sessionStorage.setItem('customers', JSON.stringify(res.data))
			commit('UPDATA_CUSTOMERS', res.data)
		}).catch(err => {
			/* eslint-disable */
			console.log(err);
			/* eslint-enable */
		})
	},
}

export default {
	state,
	getters,
	mutations,
	actions
}