import axios from 'axios'
import qs from 'qs'
import {
	Message
} from 'iview'
import config from '@/config'
import store from '@/store'

const {
	env,
	baseURL,
	timeout
} = config

// axios创建配置实例
const Ax = axios.create({
	baseURL: baseURL,
	timeout: timeout,
	transformRequest: [
		(data, headers) => qs.stringify(data) // 序列化请求的数据
	]
});

// 添加请求拦截器
Ax.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	config.headers['token'] = sessionStorage.getItem('token') || ''
	return config
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
Ax.interceptors.response.use(function(response) {
	// 对响应数据做点什么
	if (!response.data.success) {
		if (response.data.code == 1002) {
			Message.error({
				content: '您的账号登录超时或在其他设备上登录。'
			})
		} else {
			Message.error({
				content: response.data.message
			})
		}
	}
	return response
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

export default Ax