import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
// createApp(App).mount('#app')
app.use(ElementPlus, {
    locale: zhTw,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.mount('#app')




