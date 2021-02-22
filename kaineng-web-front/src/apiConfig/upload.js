/* 流文件上传配置 */
import axios from 'axios'
import apiConfig from '@/apiConfig'
import {
	Message
} from 'iview'

const {
	baseURL,
	timeout,
	commonKey
} = apiConfig


// axios创建配置实例
const upload = axios.create({
	baseURL: baseURL,
	timeout: 10000,
	headers: {
		'Content-Type':'multipart/form-data'
	}
});

// 添加请求拦截器
upload.interceptors.request.use(function(config) {
	// 请求头中添加sessionStorage存储的token
	config.headers['token'] = sessionStorage.getItem('token')
	return config
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 响应拦截器
upload.interceptors.response.use(function(response) {
	return response;
}, function(error) {
	Message.error(response.data.message)
	return Promise.reject(error);
})

export default upload