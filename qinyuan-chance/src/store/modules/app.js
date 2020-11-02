import qs from 'qs'

const state = {
	loading: false, // 加载状态
	breadParent:'',
	breadChildren:'',
}

const getters = {
	getLoading: state => state.loading,
	breadParent: state => state.breadParent,
	breadChildren: state => state.breadChildren,
}

const mutations = {
	// 更新加载状态
	LOADING: (state, data) => {
		state.loading = data
	},
	// 写入面包屑
	BREAD: (state, data) => {
		state.breadParent = data.parent
		state.breadChildren = data.children
	},
}

export default {state, getters, mutations}
