import axios from 'axios'
import qs from 'querystring'
import * as filters from './filter'
import store from '../store/index'
import {
  showLoading,
  hideLoading
} from './loading';
import {
  Message
} from 'element-ui';
var msg = false,
  accessKey = 'EFCC652BDC75C326E9D5C65D5538112A';
export default {
  get: function(url, params, type) {
    const config = {
      url: url,
      method: type,
      traditional: true,
      transformRequest: [
        function(data) {
          return qs.stringify(data) //在请求前序列化参数
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': '*/*',
        'token': localStorage.getItem('token'),
        'accessKey': accessKey
      }
    };
    return axios(config)
  },
  post: function(url, params, type) {
    var config = {
      url: url,
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'token': localStorage.getItem('token'),
        'accessKey': accessKey
      },
      data: params
    };
    if (type == 'formdata') {
      config = {
        url: url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': localStorage.getItem('token'),
          'accessKey': accessKey
        },
        data: params,
        transformRequest: [function(data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      };
    }
    if (type == 'newFormdata') {
      config = {
        url: url,
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token'),
          'accessKey': accessKey
        },
        data: params,
      };
    }
    if (type == 'putFormdata') {
      config = {
        url: url,
        method: "PUT",
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': localStorage.getItem('token'),
          'accessKey': accessKey
        },
        data: params,
      };
    }
    if (type == 'file') {
      config = {
        url: url,
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': localStorage.getItem('token'),
          'accessKey': accessKey
        },
        contentType: false,
        processData: false,
        data: params,
        onUploadProgress: e => {
          let complete = (e.loaded / e.total * 100 | 0) + '%'
          console.log('上传 ' + complete)
        }
      };
    }
    return axios(config)
  },
  file: function(url, params, upload, type) {
    var config = {
      url: url,
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': localStorage.getItem('token'),
        'accessKey': accessKey
      },
      contentType: false,
      processData: false,
      data: params,
      onUploadProgress: upload
      // onUploadProgress: e => {
      //     let complete = (e.loaded / e.total * 100 | 0) + '%'
      //     console.log('上传 ' + complete)
      // }
    };
    return axios(config)
  },
  delete: function(url, params, type) {
    var config = {
      baseURL: '',
      url: url,
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'token': localStorage.getItem('token'),
        'accessKey': accessKey
      },
      data: params
    };
    if (type == 'formdata') {
      config = {
        url: url,
        method: "DELETE",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': localStorage.getItem('token'),
          'accessKey': accessKey
        },
        data: params,
        transformRequest: [function(data) {
          let ret = ''
          for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }]
      };
    }
    return axios(config)
  }
}

/* 请求拦截器（请求之前的操作） */
axios.interceptors.request.use((req) => {
  if (req.url.indexOf('batchFile') == -1) {
    showLoading();
  }
  return req;
}, err => Promise.reject(err));

/* 请求之后的操作 */
axios.interceptors.response.use((res) => {
  if (res.config.url.indexOf('/lexy/api/web/login/login') != -1 && res.data.success) {
    setTimeout(function() {
      hideLoading();
      Message(filters.succ('登录成功！'));
    }, 460)
  } else {
    hideLoading();
    if (msg) {
      Message(msg);
      msg = false;
    }
    if (res.data.success) {
      if (res.config.method == 'put') {
        msg = filters.succ('创建成功！');
        // Message(filters.succ('创建成功！'));
      } else if (res.config.method == 'delete') {
        if (!(res.config.url.indexOf('/lexy/api/common/batchFile') != -1)) {
          msg = filters.succ('删除成功！');
        }
        // Message(filters.succ('删除成功！'));
      } else if (res.config.method == 'post' && res.config.url.indexOf("webUpdata") != -1) {
        msg = filters.succ('编辑成功！');
        // Message(filters.succ('编辑成功！'));
      } else if (res.config.method == 'post' && res.config.url.indexOf("importDevice") != -1) {
        msg = filters.succ('导入成功！');
        // Message(filters.succ('编辑成功！'));
      }
    } else {
      if (res.data.code == 101 || res.data.code == 500) {
        if (store.state.oldStore.token) {
          store.commit('del_token', 1);
          alert("用户访问超时请重新登录！");
        } else {
          return false;
        }
      }
      if (res.config.method == 'delete') {
        Message(filters.wrong('删除失败', res.data.code, res.data.msg));
      } else if (res.config.method == 'put') {
        Message(filters.wrong('创建失败', res.data.code, res.data.msg));
      } else if (res.config.method == 'post') {
        if (res.config.url.indexOf("importDevice") == -1) {
          Message(filters.wrong('操作失败', res.data.code, res.data.msg));
        } else {
          Message(filters.wrong('编辑失败', res.data.code, res.data.msg));
        }
      }
    }
  }
  return res;
  // return Promise.reject(res);
}, (err) => {
  hideLoading();
  return Promise.reject(err);
});
