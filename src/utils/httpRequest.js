// import Vue from 'vue'
import axios from 'axios'
// import router from 'vue-router'
import qs from 'qs'
import merge from 'lodash/merge'
// import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})


/**
 * 請求攔截
 */
http.interceptors.request.use(config => {
  // 從 Cookie 中獲取 JWT token
  const cookies = document.cookie.split(';');
  let jwtToken = null;

  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwtToken') {
      jwtToken = value;
      break;
    }
  }

  // 如果找到 token，添加到請求頭中（備用方案）
  if (jwtToken) {
    config.headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  console.log('Request config:', config);
  console.log('JWT Token:', jwtToken);
  console.log('Request URL:', config.url);
  console.log('Request headers:', config.headers);

  return config;
}, error => {
  return Promise.reject(error);
})

/**
 * 響應攔截
 */
http.interceptors.response.use(response => {
  console.log('Response received:', response);
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  // 檢查是否是重定向到登入頁面的響應
  if (response.status === 302 || (response.data && response.data.code === 401)) {
    console.warn('認證失效，重定向到登入頁面');
    // 清除 token
    document.cookie = 'jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // 保存當前頁面路徑用於登入後重定向
    sessionStorage.setItem('redirect', window.location.pathname + window.location.search);
    // 跳轉到登入頁面
    window.location.href = '/auth/login';
  }
  return response;
}, error => {
  console.error('HTTP 請求錯誤:', error);

  // 處理 302 重定向錯誤
  if (error.response && error.response.status === 302) {
    console.warn('收到 302 重定向，可能是認證失效');
    // 清除 token
    document.cookie = 'jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // 保存當前頁面路徑
    sessionStorage.setItem('redirect', window.location.pathname + window.location.search);
    // 跳轉到登入頁面
    window.location.href = '/auth/login';
    return Promise.reject(error);
  }

  return Promise.reject(error);
})

/**
 * 請求地址處理
 * @param {*} actionName action方法名稱
 */
http.adornUrl = (actionName) => {
  // 非生產環境 && 開啟代理, 接口前綴統一使用[/proxyApi/]前綴做代理攔截!
  // return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
  return 'http://localhost:88/api' + actionName
}

/**
 * get請求參數處理
 * @param {*} params 參數對象
 * @param {*} openDefaultParams 是否開啟默認參數?
 */
http.adornParams = (params = {}, openDefaultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefaultParams ? merge(defaults, params) : params
}

/**
 * post請求數據處理
 * @param {*} data 數據對象
 * @param {*} openDefaultData 是否開啟默認數據?
 * @param {*} contentType 數據格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefaultData = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefaultData ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
