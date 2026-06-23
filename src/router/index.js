import { createRouter, createWebHistory } from 'vue-router'

// 路由配置：路由懒加载 → 生产构建自动代码分割
const routes = [
  {
    path: '/',           // 首页路径
    name: 'home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/detail/:id',  // 详情页路径，:id 是动态参数，比如 /detail/1
    name: 'detail',
    component: () => import('../views/DetailPage.vue')
  }
]

// 创建路由实例，使用 HTML5 History 模式（干净的URL，没有 # 号）
// 第二个参数 base 需要与 vite.config.js 中的 base 保持一致
const router = createRouter({
  history: createWebHistory('/feiyi-trace/'),
  routes
})

export default router
