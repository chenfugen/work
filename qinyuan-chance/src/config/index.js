let version = '1.0.0' // 系统版本
let baseAPI = {
	production: 'https://iot2-dtest.qinyuan.cn:449/web/api/',
	release: 'https://qinyuan-slb.yunext.com:448/web/api/',
	development: 'https://qinyuan-chance-test.yunext.com/web/api',
}
let env = process.env.NODE_ENV
let baseURL = baseAPI[env]

// 系统参数配置
export default {
	timeout: 10000, // 请求超时
	version, // 系统版本
	baseAPI, // 所有环境接口对象
	env, // 当前环境
	baseURL // 当前环境接口地址
}