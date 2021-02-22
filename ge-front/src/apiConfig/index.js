const version = '1.0.0',
	baseAPI = {
		production: document.location.origin + '/web/api/', // 生产环境api
		release: document.location.origin + '/web/api/', // 测试环境api
		development: '/web/api/', //开发模式api（搭配webpack代理）
	},
	crmAPI = {
		production: document.location.origin + '/web/', // 生产环境api
		release: document.location.origin + '/web/', // 测试环境api
		development: '/web/', //开发模式api（搭配webpack代理）
	},
	env = process.env.VUE_APP_ENV, // 获取当前webpack打包版本
	baseURL = baseAPI[env], // 根据webpack版本选择api
	crmURL= crmAPI[env]//crm访问
const commonKey = 'KPvJa7VymCFIJYFQlD1zoesA1crMp4jS'

// 系统参数配置
export default {
	timeout: 10000, // 请求超时
	commonKey,
	version, // 系统版本
	baseAPI, // 所有环境接口对象
	env, // 当前环境
	baseURL, // 当前环境接口地址
	crmAPI, //crm访问接口地址
	crmURL //crm访问接口地址
}