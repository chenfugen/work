import axios from 'axios'
import qs from 'qs'
import vue from 'vue'
import VueCookies from 'vue-cookies'
import {
	Message
} from 'element-ui';
// axios创建配置实例
const Axios = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
	timeout: 10000,
	transformRequest: [
		(data, headers) => qs.stringify(data) // 序列化请求的数据
	]
});

//添加请求拦截器
Axios.interceptors.request.use(function(config) {
	// 请求头中添加sessionStorage存储的token
	config.headers['token'] = VueCookies.get('token') || ""
	config.data = JSON.stringify(config.data)
	config.headers = {
		'Content-Type': 'application/json'
	}
	return config
}, function(error) {
	Message.warning('系统或接口异常');
	return Promise.reject(error);
});

// 响应拦截器
Axios.interceptors.response.use(function(response) {
	if (response.status == 200) {
		if (response.data.code === 102) {
			location.href = process.env.VUE_APP_BASE_URL;
		}
		if(response.code === -2) {
			 Message.error(response.msg ||"接口异常");	
		}
	}
	if (response.status == 500) {
		Message.warning('接口异常');
	}
	return response.data;
}, function(error) {
	Message.warning('系统异常');
	return Promise.reject(error);
})

export default Axios
