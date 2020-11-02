import axios from 'axios'
import qs from 'qs'
import vue from 'vue'
import VueCookies from 'vue-cookies'
import {
	Message
} from 'element-ui';
// axios创建配置实例
const download = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
	timeout: 10000,
	responseType: 'blob',
	transformRequest: [
		(data, headers) => qs.stringify(data) // 序列化请求的数据
	]
});

//添加请求拦截器
download.interceptors.request.use(function(config) {
	// 请求头中添加sessionStorage存储的token
	config.headers['token'] = VueCookies.get('token') || ""
	return config
}, function(error) {
	Message.warning('系统或接口异常');
	return Promise.reject(error);
});

// 响应拦截器
download.interceptors.response.use(function(response) {
	if (response.status == 200) {

	}
	if (response.status == 500) {
		Message.warning('接口异常');
	}

	Date.prototype.Format = function(fmt) { // author: meizz
		var o = {
			"M+": this.getMonth() + 1, // 月份
			"d+": this.getDate(), // 日
			"h+": this.getHours(), // 小时
			"m+": this.getMinutes(), // 分
			"s+": this.getSeconds(), // 秒
			"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
			"S": this.getMilliseconds() // 毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]):(("00" +
				o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	const link = document.createElement('a');
	let blob = new Blob([response.data], {
		type: 'application/zip'
	})
	link.style.display = 'none';
	link.href = URL.createObjectURL(blob);

	link.download =VueCookies.get("fileName")+new Date().Format("yyyy-MM-dd hh:mm:ss");
	//link.download =response.headers['content-disposition'].split("filename=")[1];
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}, function(error) {
	Message.warning('系统异常');
	return Promise.reject(error);
})

export default download
