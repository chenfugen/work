// axios配置文件 配置新的axios类
import axios from 'axios'
import qs from 'qs'
import apiConfig from '@/apiConfig'
import store from '../store'
import {
	Message
} from 'iview'

const {
	crmURL,
	timeout,
	commonKey
} = apiConfig


// axios创建配置实例
const Crm = axios.create({
	baseURL: crmURL,
	timeout: timeout,
	transformRequest: [
		(data) => qs.stringify(data) // 序列化请求的数据
	]
});

// 添加请求拦截器
Crm.interceptors.request.use(function(config) {
	if (config.url.indexOf("common") != -1) {
		config.params = {
			...config.params,
			commonKey: commonKey
		}
	}
	// 请求头中添加sessionStorage存储的token
	config.headers['token'] = sessionStorage.getItem('token')
	return config
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
Crm.interceptors.response.use(function(response) {
	// token失效自动登出
	if (response.data.code == '101' || response.data.code == '102') {
			Message.error('token失效')
	}
	// 请求操作失败统一提示配置
	else if (response.data.code != '101' && response.data.code != '102' && !response.data.success) {
		Message.error({
			content: response.data.message
		})
	}
	// 响应数据统一配置
	return response.data
}, function(error) {
	console.log('服务器异常');
	// 对响应错误执行
	Message.error('服务器异常，请稍后再试。')
	return Promise.reject(error);
});

export default Crm //抛出实例