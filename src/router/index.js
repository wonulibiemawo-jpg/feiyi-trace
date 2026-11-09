import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomePage.vue') },
  { path: '/works', name: 'works', component: () => import('../views/WorksPage.vue') },
  { path: '/detail/:id', name: 'detail', component: () => import('../views/DetailPage.vue') },
  { path: '/learn/:id?', name: 'courses', component: () => import('../views/CoursePage.vue') },
  { path: '/quiz', name: 'quiz', component: () => import('../views/QuizPage.vue') },
  { path: '/quiz/results/:id', name: 'result', component: () => import('../views/QuizPage.vue') },
  { path: '/community', name: 'community', component: () => import('../views/CommunityPage.vue') },
  { path: '/community/new', name: 'new-post', component: () => import('../views/PostEditor.vue') },
  { path: '/community/:id/edit', name: 'edit-post', component: () => import('../views/PostEditor.vue') },
  { path: '/community/:id', name: 'post', component: () => import('../views/CommunityPage.vue') },
  { path: '/events/:id?', name: 'events', component: () => import('../views/EventsPage.vue') },
  { path: '/account', name: 'account', component: () => import('../views/AccountPage.vue') },
  { path: '/admin', name: 'admin', component: () => import('../views/AdminPage.vue') },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFoundPage.vue') },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 90 }
    if (to.path !== from.path) return { top: 0 }
  },
})
