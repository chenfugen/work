import axios from 'axios'
import qs from 'qs'
import VueCookies from 'vue-cookies'
import { Notify  } from 'vant';
import vue from 'vue'

// axios创建配置实例
const Ax = axios.create({
	baseURL:process.env.API_ROOT,
	timeout: 10000,
	transformRequest: [
		(data, headers) => qs.stringify(data) // 序列化请求的数据
	]
});

//添加请求拦截器
Ax.interceptors.request.use(function(config) {
	return config
}, function(error) {
	Notify({ type: 'warning', message:"系统异常" });
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 响应拦截器
Ax.interceptors.response.use(function(response) {
	if(response.status == 200) {
		if(response.data.code === 102) {
			location.href = '/';
		}	
	}
	return response;
}, function(error) {
	Notify({ type: 'warning', message: "系统异常"});
	return Promise.reject(error);
})

export default Ax