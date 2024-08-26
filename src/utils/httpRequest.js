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

// http.interceptors.request.use(config => {
//   config.headers['token'] = Vue.cookie.get('token') // 請求頭帶上token
//   return config
// }, error => {
//   return Promise.reject(error)
// })

/**
 * 響應攔截
 */
// http.interceptors.response.use(response => {
//   if (response.data && response.data.code === 401) { // 401, token失效
//     clearLoginInfo()
//     router.push({ name: 'login' })
//   }
//   return response
// }, error => {
//   return Promise.reject(error)
// })

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
