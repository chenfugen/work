import router from '@/router'

const state = {
	menu: JSON.parse(sessionStorage.getItem('menu')) || [], // 主菜单
	menuActive: sessionStorage.getItem('menuActive') || '/', // 激活主菜单
	menuOpened: sessionStorage.getItem('menuOpened') || '', // 展开子菜单
}

const getters = {
	getMenu: state => state.menu,
	getMenuActive: state => state.menuActive,
	getMenuOpened: state => state.menuOpened,
	getToken: token => state.token
}

const mutations = {
	// 获取菜单
	MENU: (state, data) => {
		sessionStorage.setItem('menu', JSON.stringify(data))
	},
	// 选择菜单
	MENU_SELECT: (state, data) => {
		router.push(data) // 路由跳转
		sessionStorage.setItem('menuActive', data)
		sessionStorage.setItem('menuOpened', state.menuOpened)
	},
	// 重置菜单
	MENU_RESET: (state) => {
		router.push('/login') // 路由跳转
		sessionStorage.clear()
		location.reload()
	}
}

const actions = {
	// 获取菜单
	handleMenu: ({
		commit
	}, data) => {
		commit('MENU', data)
		let path = '/'
		if (data[0].name == '设备产测') {
			path = '/'
		} else if (data[0].children.length > 0) {
			path = data[0].children[0].path
		}
		commit('MENU_SELECT', path)
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}