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



// 登入頁與授權 API 白名單，避免在登入流程中造成無限重導
const LOGIN_PATH = '/auth/login'
const AUTH_PAGE_PREFIX = '/auth'
const AUTH_API_WHITELIST = [
  '/api/ums/user/login/username',
  '/api/ums/user/register',
  '/api/ums/user/email-verify-code'
]

function isOnAuthPage () {
  const p = window.location.pathname || ''
  return p === LOGIN_PATH || p.startsWith(AUTH_PAGE_PREFIX)
}

function isAuthApi (url) {
  if (!url) return false
  try {
    const u = new URL(url, window.location.origin)
    const path = u.pathname + u.search
    return AUTH_API_WHITELIST.some(ep => path.startsWith(ep))
  } catch (e) {
    return AUTH_API_WHITELIST.some(ep => String(url).includes(ep))
  }
}

function doLogoutAndRedirect (triggerUrl) {
  const isLoginStore = useIsLoginStore()
  isLoginStore.setIsLoginData(false)
  document.cookie = 'jwtToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  if (!isOnAuthPage()) {
    sessionStorage.setItem('redirect', window.location.pathname + window.location.search)
  }
  if (window.location.pathname !== LOGIN_PATH) {
        // window.location.href = LOGIN_PATH // <--- 暫時註解掉，防止跳轉
        console.error('偵測到認證失效，已阻止自動跳轉以便調適。觸發來源:', triggerUrl); // 可以加一行日誌方便觀察
  }
}

/**
 * 請求攔截
 */
import {useIsLoginStore} from "@/pinia/useIsLoginStore.ts"
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
  // else{
  //   const isLoginStore = useIsLoginStore()
  //   isLoginStore.setIsLoginData(false)
  // }

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

  // 檢查是否是重定向到登入頁面的響應（防止 API 返回 HTML 或內部代碼 401）
  if ((response.status === 302 || (response.data && response.data.code === 401)) && !isOnAuthPage()) {
    console.warn('認證失效，重定向到登入頁面');
    doLogoutAndRedirect(response.config?.url)
  }
  return response;
}, error => {
  console.error('HTTP 請求錯誤:', error);

  // 主流做法：統一在錯誤攔截器處理未授權（401/403），避免依賴 302
  if (error.response) {
    const status = error.response.status;
    if ((status === 401 || status === 403)) {
      // 若是在登入頁或呼叫登入/註冊 API，則不再重導，避免無限循環
      if (isOnAuthPage() || isAuthApi(error.config?.url)) {
        console.warn('在登入流程中收到 ' + status + '，不重導')
      } else {
        console.warn('認證失效（HTTP ' + status + '），執行登出流程')
        doLogoutAndRedirect(error.config?.url)
      }
    } else if (status === 302) {
      // 若後端真的回 302（較少見於 XHR），也做相同處理
      if (isOnAuthPage() || isAuthApi(error.config?.url)) {
        console.warn('在登入流程中收到 302，不重導')
      } else {
        console.warn('收到 302 重定向，可能是認證失效')
        doLogoutAndRedirect(error.config?.url)
      }
    }
  }

  return Promise.reject(error);
})

/**
 * 請求地址處理
 * @param {*} actionName action方法名稱
 */
// http.adornUrl = (actionName) => {
//   // 非生產環境 && 開啟代理, 接口前綴統一使用[/proxyApi/]前綴做代理攔截!
//   // return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
//   return 'http://localhost:88/api' + actionName
// }

http.adornUrl = (actionName) => {
  // 使用 Vite 開發代理，統一走同源 /api，避免瀏覽器 CORS
  return '/api' + actionName
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
