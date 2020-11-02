import axios from 'axios'
import qs from 'qs'
import vue from 'vue'
import VueCookies from 'vue-cookies'
import {
	Notify
} from 'vant';
import store from '../store/index.js';
import md5 from 'js-md5';
const CalcuMD5 = (pwd) => {
	pwd = md5(pwd);
	pwd = pwd.toUpperCase();
	return pwd;
}
// axios创建配置实例
const Ax = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
	timeout: 10000,
	transformRequest: [
		(data, headers) => qs.stringify(data) // 序列化请求的数据
	]
});
//添加请求拦截器
Ax.interceptors.request.use(function(config) {
	config.headers['sign'] = CalcuMD5(store.state.axiosTime + "&" + store.state.accesskey);
	return config
}, function(error) {
	Notify({
		type: 'warning',
		message: "系统或接口异常"
	});
	return Promise.reject(error);
});

// 响应拦截器
Ax.interceptors.response.use(function(response) {
	if (response.status == 200) {
		if (response.data.code === 102) {
			location.href = process.env.VUE_APP_BASE_URL;
		}
	}
	if (response.status == 500) {
		Notify({
			type: 'warning',
			message: "接口异常"
		});
	}
	return response.data;
}, function(error) {
	Notify({
		type: 'warning',
		message: "系统异常"
	});
	return Promise.reject(error);
})

export default Ax