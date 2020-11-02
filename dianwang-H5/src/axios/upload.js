import axios from 'axios'
import vue from 'vue'
import { Notify } from 'vant';

// axios创建配置实例
const uploadImg = axios.create({
	baseURL:process.env.API_ROOT,
	timeout: 10000,
	headers: {
		'Content-Type':'multipart/form-data'
	}
});

// 响应拦截器
uploadImg.interceptors.response.use(function(response) {
	return response;
}, function(error) {
	Notify({ type: 'warning', message:"系统异常" });
	return Promise.reject(error);
})

export default uploadImg 