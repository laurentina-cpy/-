import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// 生产环境禁用 Vue DevTools
if (import.meta.env.PROD) {
  app.config.devtools = false
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
