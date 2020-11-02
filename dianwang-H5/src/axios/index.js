import axios from 'axios'
import qs from 'qs'
import VueCookies from 'vue-cookies'
import { Notify } from 'vant';
import vue from 'vue'

// axios创建配置实例
const Axios = axios.create({
	baseURL:process.env.API_ROOT,
	timeout: 10000,
	transformRequest: [
		(data, headers) => qs.stringify(data) // 序列化请求的数据
	]
});

//添加请求拦截器
Axios.interceptors.request.use(function(config) {
	// 请求头中添加sessionStorage存储的token
	if(VueCookies.get('token')) {
		config.headers['token'] = VueCookies.get('token')
	}
	return config
}, function(error) {
	Notify({ type: 'warning', message:"系统异常" });
	return Promise.reject(error);
});

// 响应拦截器
Axios.interceptors.response.use(function(response) {
	if(response.status == 200) {
		if(response.data.code === 102) {
			location.href = process.env.URL;
		}
	}
	if(response.status == 500) {
		Notify({ type: 'warning', message: "接口异常"});
	}
	return response.data;
}, function(error) {
	Notify({ type: 'warning', message:"系统异常" });
	return Promise.reject(error);
})

export default Axios