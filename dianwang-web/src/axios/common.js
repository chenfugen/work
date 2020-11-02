import axios from 'axios'
import qs from 'qs'
import  Process from "./env"
import { message } from 'antd';


// axios创建配置实例
const Ax = axios.create({
    baseURL:Process.webAPI,
    timeout: 10000,
    transformRequest: [
        (data, headers) => qs.stringify(data) // 序列化请求的数据
    ]
});

//添加请求拦截器
Ax.interceptors.request.use(function(config) {
    return config
}, function(error) {
    message.error("服务器或网络异常");
    return Promise.reject(error);
});

// 响应拦截器
Ax.interceptors.response.use(function(response) {
    if(response.status === 200) {
        if (response.data.code === 102) {
            window.location.href = Process.baseURL;
        }
    }
        if(response.status === 500) {
            message.error("接口异常");
        }
        return response.data;
    }, function(error) {
        message.error("服务器或网络异常");
        return Promise.reject(error);
    })
export default Ax;
