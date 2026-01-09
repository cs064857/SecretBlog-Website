// import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import merge from 'lodash/merge'
import { ElMessage } from 'element-plus'
import { useIsLoginStore } from '@/pinia/useIsLoginStore'
// import { clearLoginInfo } from '@/utils'

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  // 避免陣列參數被序列化為 tagsId[]=1 的格式，達成目標是 tagsId=1,2
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'comma' })
  }
})

// 登入頁與授權流程頁面（避免在登入/重設密碼流程中造成無限循環或錯誤導頁）
const LOGIN_PATH = '/auth/login'
const AUTH_PAGE_PREFIX = '/auth'

// 路由別名：reset-password 可能以 /reset-password 進入（不一定有 /auth 前綴）
const AUTH_PAGE_ALIASES = ['/reset-password']

// 登入頁與授權 API 白名單：這些請求常發生在登入/重設密碼流程或「登入狀態檢查」，遇到 401 時不應自動重導。
const AUTH_API_WHITELIST = [
  '/api/ums/user/login/username',
  '/api/ums/user/register',
  '/api/ums/user/captcha',
  '/api/ums/user/email-verify-code',
  '/api/ums/user/is-login',
  '/api/ums/user/forgot-password',
  '/api/ums/user/verify-reset-token',
  '/api/ums/user/reset-password',
  // 第三方 OAuth2 登入流程（例如 Google）
  '/oauth2/authorization/',
  '/login/oauth2/code/'
]

function isOnAuthPage() {
  const p = window.location.pathname || ''
  return p === LOGIN_PATH || p.startsWith(AUTH_PAGE_PREFIX) || AUTH_PAGE_ALIASES.includes(p)
}

//判斷是否為授權API，例如登入、註冊、驗證碼、重設密碼等，若是則回傳true ; 否則回傳false
function isAuthApi(url) {
  if (!url) return false
  try {
    const u = new URL(url, window.location.origin)
    const path = u.pathname + u.search
    return AUTH_API_WHITELIST.some(ep => path.startsWith(ep))
  } catch (e) {
    return AUTH_API_WHITELIST.some(ep => String(url).includes(ep))
  }
}

function getCookieValue(key) {
  const cookieArray = String(document.cookie || '').split(';')
  for (const cookieString of cookieArray) {
    const cookie = cookieString.trim()
    if (cookie.startsWith(key + '=')) {
      return cookie.substring(key.length + 1)
    }
  }
  return null
}

function clearAuthClientState() {
  const isLoginStore = useIsLoginStore()
  isLoginStore.setIsLoginData(false)

  // 清除可能被前端讀取的 Cookie（若後端改成 HttpOnly，這裡讀不到但清除也不會報錯）
  document.cookie = 'jwtToken=; path=/; max-age=0'
  document.cookie = 'userId=; path=/; max-age=0'
  document.cookie = 'avatar=; path=/; max-age=0'
}

let lastAuthToastAt = 0
let redirectingToLogin = false

/**
 * 1、type參數用於判斷需要打印哪種類型，例如'warning'或'error類型
 * 2、message參數代表實際消息內容
*/
function showAuthToastOnce(type, message) {
  const now = Date.now()
  if (now - lastAuthToastAt < 800) return
  lastAuthToastAt = now

  if (type === 'warning') ElMessage.warning(message)
  else if (type === 'error') ElMessage.error(message)
  else ElMessage.info(message)
}

function setRedirectIfNeeded() {
  if (isOnAuthPage()) return
  sessionStorage.setItem('redirect', window.location.pathname + window.location.search)
}

/**
 * 統一處理「未登入 / 憑證失效」：
 * - 一律先將前端登入狀態清空（Spring Security 仍會以後端為準）
 * - 依白名單/旗標決定是否提示與導回登入頁
 *
 * 可在 axios config 追加：
 * - skipAuthRedirect: true  → 不自動導回登入頁（例如 /ums/user/is-login）
 * - skipAuthErrorMessage: true → 不顯示全域提示
 */
function handleUnauthorized(triggerUrl, config) {
  clearAuthClientState()

  //跳過重導，例外：
  // 1. 如果是 skipAuthRedirect=true 則不進行重導
  // 2. 如果是登入頁則不進行重導
  // 3. 如果是授權相關的URL則不進行重導
  const skipRedirect = Boolean(config && config.skipAuthRedirect) || isOnAuthPage() || isAuthApi(triggerUrl)
  const skipMessage = Boolean(config && config.skipAuthErrorMessage)

  if (!skipRedirect) {
    //設置重導路徑
    setRedirectIfNeeded()

    if (!skipMessage) {
      showAuthToastOnce('warning', '登入狀態已過期，請重新登入')
    }

    //自動導回登入頁
    if (!redirectingToLogin && window.location.pathname !== LOGIN_PATH) {
      redirectingToLogin = true
      window.location.href = LOGIN_PATH
    }
  }
}

function handleForbidden(triggerUrl, config) {
  const skipMessage = Boolean(config && config.skipAuthErrorMessage)
  if (skipMessage) return

  // 403 表示已登入但權限不足，不應自動登出
  if (!isOnAuthPage() && !isAuthApi(triggerUrl)) {
    showAuthToastOnce('error', '權限不足，無法執行此操作')
  }
}

//判斷code是否為空，並轉換為數字
function normalizeBusinessCode(code) {
  if (code === null || code === undefined) return null
  const n = Number(code)
  return Number.isNaN(n) ? null : n
}

/**
 * 請求攔截
 */
http.interceptors.request.use(
  config => {
    // 從 Cookie 中獲取 JWT token（非 HttpOnly 時可用；若為 HttpOnly 仍會由瀏覽器自動帶上 Cookie）
    const jwtToken = getCookieValue('jwtToken')

    // 如果找到 token，添加到請求頭中（備用方案）
    if (jwtToken) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${jwtToken}`
    }

    if (import.meta?.env?.DEV) {
      console.debug('[HTTP]', (config.method || 'get').toUpperCase(), config.url)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 響應攔截
 */
http.interceptors.response.use(
  response => {
    const businessCode = normalizeBusinessCode(response?.data?.code)

    // 防止後端以 200 回傳「內部 code=401/403」
    if (businessCode === 401) {
      handleUnauthorized(response.config?.url, response.config)
    } else if (businessCode === 403) {
      handleForbidden(response.config?.url, response.config)
    } else if (response.status === 302) {
      handleUnauthorized(response.config?.url, response.config)
    }

    return response
  },
  error => {
    const status = error?.response?.status

    // 統一在錯誤攔截器處理未授權（401/403），避免依賴 302
    if (status === 401) {
      handleUnauthorized(error.config?.url, error.config)
    } else if (status === 403) {
      handleForbidden(error.config?.url, error.config)
    } else if (status === 302) {
      handleUnauthorized(error.config?.url, error.config)
    }

    return Promise.reject(error)
  }
)

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
