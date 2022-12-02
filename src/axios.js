import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/router'
import ViewUIPlus from 'view-ui-plus';

const request = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(config => {
  if (localStorage.getItem("JWT")) {
    // 请求头带上 JWT
    config.headers.Authorization = localStorage.getItem("JWT");
  }

  return config;
});

request.interceptors.response.use(response => {
  return response;
}, error => {
  ViewUIPlus.LoadingBar.error()
  
  if (error.response) {
    switch (error.response.status) {
      case 400: 
        ElMessage({
          message: '请求错误',
          type: 'error'
        })
        break;
      case 401:
        router.push('/login');
        ElMessage({
          message: '登录已过期, 请重新登录',
          type: 'error'
        })
        break;
      case 403:
        ElMessage({
          message: error.response.data.msg,
          type: 'error'
        })
        break;
      case 404:
        ElMessage({
          message: '请求错误,未找到该资源',
          type: 'error'
        })
        break;
      case 500:
        ElMessage({
          message: '服务器出错',
          type: 'error'
        })
        break;
      default:
        ElMessage({
          message: '未知错误',
          type: 'error'
        })
    }
  }

  return Promise.reject(error);
});

export default request
