import axios, { AxiosResponse, AxiosError } from 'axios'
import { stringify } from 'qs'
import { message } from 'antd'
import responseCode from '../config/responseCode'

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 60000
})

function addTokenToHeader(config: any) {
  if (!('headers' in config)) {
    config.headers = {}
  }
  config.headers = {
    ...config.headers,
    token: localStorage.getItem('login_token')
  }
  return config
}
axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

function processSuccess(res: AxiosResponse) {
  if (res.data.code === responseCode.SUCCESS) {
    return Promise.resolve(res.data)
  } else if (res.data.code === responseCode.NOT_LOGIN) {
    // 需要定向到登录页面
    if (res.data.msg) {
      message.destroy()
      message.error(res.data.msg)
      window.location.replace('/')
    }
    return Promise.reject(res.data)
  } else {
    if (res.data.msg) {
      message.destroy()
      message.error(res.data.msg)
    }
    return Promise.reject(res.data)
  }
}

function processFailure(isIgnoreError: boolean) {
  return function fail(error: AxiosError) {
    if (!isIgnoreError) {
      message.destroy()
      message.error('系统异常, 请稍后再试')
    }
    // 监控接口报错的功能
    // code below here
    return Promise.reject(error)
  }
}

/**
 * @description 普通 GET 请求
 * @param {string} url 请求地址
 * @param {object} [data={}] get请求提交的params同axios中的params
 * @param {object} [config={}] 额外请求配置
 * @param {boolean} [isIgnoreError=false] 是否忽略错误提示
 * @returns axiosInstance
 */
function get(url: string, data = {}, config = {}, isIgnoreError: boolean = false) {
  config = addTokenToHeader(config)
  return axiosInstance
    .request({
      url,
      method: 'GET',
      params: data,
      ...config
    })
    .then(processSuccess, processFailure(isIgnoreError))
}

/**
 * @description 普通 POST 请求
 * @param {string} url 请求地址
 * @param {object} [data={}] post请求提交的data同axios中的data
 * @param {object} [config={}] 额外请求配置
 * @param {boolean} [isIgnoreError=false] 是否忽略错误提示
 * @returns axiosInstance
 */
function post(url: string, data = {}, config = {}, isIgnoreError: boolean = false) {
  config = addTokenToHeader(config)
  return axiosInstance
    .request({
      url,
      method: 'POST',
      data: data,
      transformRequest: [
        function (data, headers) {
          const contentType = headers['Content-Type'] || headers.post['Content-Type']
          switch (contentType) {
            case 'application/json':
              data = JSON.stringify(data)
              break
            case 'application/x-www-form-urlencoded':
              data = stringify(data, { arrayFormat: 'brackets' })
              break
            case 'multipart/form-data':
              break
          }
          return data
        }
      ],
      ...config
    })
    .then(processSuccess, processFailure(isIgnoreError))
}
export default {
  get,
  post
}
