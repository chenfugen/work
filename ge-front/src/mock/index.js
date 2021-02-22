// 引入mockjs
const Mock = require('mockjs');
// 获取 mock.Random 对象
const Random = Mock.Random;

const postLogin = function() {
	let menu = [{
		model: 'admin',
		path: [{
				label: '产品管理',
				name: 'productList',
				path: '/productList',
				icon: 'ios-briefcase-outline',
			},
			{
				label: '设备管理',
				name: 'deviceList',
				path: '/deviceList',
				icon: 'ios-hammer-outline',
			},
			{
				label: '用户管理',
				name: 'userList',
				path: '/userList',
				icon: 'ios-contact-outline',
			},
			{
				label: '系统管理',
				name: 'systemList',
				path: '/systemList',
				icon: 'ios-cog-outline',
			}
		]
	}]
	let token = 'asdadsadasdasdasdasdasdadasdas',
		userName = 'admin'
	return {
		menu,
		userName,
		token
	}
}

const productList = function() {
	let list = [{
		productModel: '测试数据',
		productModel: '测试数据',
		createdTime: '测试数据',
		productIMG: '测试数据',
		productKey: '测试数据',
		describe: '测试数据'
	}, {
		productModel: '测试数据',
		productModel: '测试数据',
		createdTime: '测试数据',
		productIMG: '测试数据',
		productKey: '测试数据',
		describe: '测试数据'
	}, {
		productModel: '测试数据',
		productModel: '测试数据',
		createdTime: '测试数据',
		productIMG: '测试数据',
		productKey: '测试数据',
		describe: '测试数据'
	}]
	return {
		menu,
		userName,
		token
	}
}

// 登录
Mock.mock('/web/api/login', 'post', postLogin);
// 产品列表
Mock.mock('/web/api/product/list', 'get', productList);