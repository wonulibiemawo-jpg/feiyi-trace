import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建 Vue 应用实例，挂载路由，然后挂载到页面上
const app = createApp(App)
app.use(router)           // 启用路由功能
app.mount('#app')         // 挂载到 index.html 中的 <div id="app">
