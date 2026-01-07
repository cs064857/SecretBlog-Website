import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import router from './router'

/**
 * 引入 Element Plus 及其樣式
 */
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
//深色模式
import 'element-plus/theme-chalk/dark/css-vars.css'


// import { createPinia } from 'pinia'
import { store } from "@/pinia/index";    // 引入創建好的pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'//自動持久化pinia中的數據,儲存在localStorage 或 sessionStorage中

// 引入 vue-advanced-cropper 及其樣式
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'


const app = createApp(App)
// import httpRequest from '/utils/httpRequest';
// createApp(App).mount('#app')
app.use(ElementPlus, {
    locale: zhTw,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//vue-advanced-cropper
app.component('Cropper', Cropper)

app.config.globalProperties.$message=ElMessage
// app.config.globalProperties.$http=httpRequest

// const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)
// app.use(pinia)
store.use(piniaPluginPersistedstate)

app.use(store)
app.use(router)

// 應用啟動時向後端詢問目前登入狀態，初始化 isLogin
import { isLoginRequest } from '@/requests/userAuthRequest';
isLoginRequest();

app.mount('#app')



