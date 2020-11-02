import axios from 'axios'
import qs from 'qs'
import  Process from "./env"
import cookie from 'react-cookies';
import { message  } from 'antd';


// axios创建配置实例
const exportFrom = axios.create({
    baseURL:Process.webAPI,
    timeout: 10000,
    responseType: 'blob',
    transformRequest: [
        (data, headers) => qs.stringify(data) // 序列化请求的数据
    ]
});

//添加请求拦截器
exportFrom.interceptors.request.use(function(config) {
    if(cookie.load('user')) {
        config.headers['token'] = cookie.load('user').token;
    }
    return config
}, function(error) {
    message.error(error);
    return Promise.reject(error);
});

// 响应拦截器
exportFrom.interceptors.response.use(function(response) {
    if(response.status === 200) {
        // if(response.data.code ===102) {
        //     window.location.href=Process.baseURL;
        // }
    }
    const link = document.createElement('a');
    let blob= new Blob([response.data], {type:'application/vnd.ms-excel'})
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob)
    // link.download = res.headers['content-disposition'] //下载后文件名
    link.download = cookie.load('fileName');
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}, function(error) {
    message.error(error);
    return Promise.reject(error);
})

export default exportFrom;


