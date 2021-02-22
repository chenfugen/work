const version = '1.0.0',
	baseAPI = {
		production: document.location.origin + '/web/api/', // 生产环境api
		release: document.location.origin + '/web/api/', // 测试环境api
		development: '/web/api/', //开发模式api（搭配webpack代理）
	},
	domainAPI = {
		production: document.location.origin, // 生产环境
		release: document.location.origin, // 测试环境
		development: 'https://smart-test.canature.com', //开发模式
	},
	baseIP= {
		production:['47.100.120.103','47.100.119.228','101.132.70.103'], // 生产环境
		release: ['47.101.45.233'], // 测试环境
		development: ['47.101.45.233'], //开发模式
	},
	env = process.env.VUE_APP_ENV, // 获取当前webpack打包版本	
	baseURL = baseAPI[env], // 根据webpack版本选择api
	domainURL = domainAPI[env],
	IP=baseIP[env],
	partnerUrl="https://iotmarket.canature.com" //委托商访问地址
	const commonKey = 'KPvJa7VymCFIJYFQlD1zoesA1crMp4jS'

// 系统参数配置
export default {
	timeout: 10000, // 请求超时
	commonKey,
	version, // 系统版本
	baseAPI, // 所有环境接口对象
	env, // 当前环境
	baseURL, // 当前环境接口地址
	domainURL, //当前域名
	IP,
	partnerUrl
}
