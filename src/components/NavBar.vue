<template>
  <nav :class="['navbar', { 'navbar--compact': isCompact }]">
    <div class="navbar-inner">
      <!-- Logo：点击回到首页 -->
      <router-link to="/" class="logo">
        <span class="logo-icon">🏮</span>
        <span class="logo-text">非遗·寻迹</span>
      </router-link>

      <!-- 右侧导航链接 -->
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <span class="nav-divider">|</span>
        <span class="nav-link nav-link--disabled nav-tooltip" data-tip="得之吾幸，失之吾命">
          关于
        </span>
        <span class="nav-divider">|</span>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切到日间模式' : '切到夜间模式'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 滚动时导航栏变紧凑
const isCompact = ref(false)

function onScroll() {
  isCompact.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// --- 暗色模式 ---
const isDark = ref(false)

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '')
  isDark.value = dark
}

function toggleTheme() {
  const next = !isDark.value
  applyTheme(next)
  localStorage.setItem('theme', next ? 'dark' : 'light')
}

onMounted(() => {
  // 优先读 localStorage，其次跟系统偏好
  const saved = localStorage.getItem('theme')
  if (saved) {
    applyTheme(saved === 'dark')
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme(true)
  }
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  padding: 0 20px;
  position: sticky;   /* 页面滚动时导航栏固定在顶部 */
  top: 0;
  z-index: 100;       /* 确保导航栏在所有内容之上 */
  box-shadow: var(--shadow-md);
  transition: height 0.3s ease, box-shadow 0.3s ease;
}

.navbar--compact {
  box-shadow: var(--shadow-lg);  /* 缩小后阴影加深, 更有层次 */
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  transition: height 0.3s ease;
}

.navbar--compact .navbar-inner {
  height: 48px;  /* 滚动后变矮 */
}

/* Logo 区域 */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff !important;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-family: var(--font-serif);
  font-size: var(--font-xl);
  font-weight: bold;
  letter-spacing: 2px;       /* 字间距，增加国风感 */
}

/* 导航链接 */
.nav-links {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-sm);
  transition: color 0.2s;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.nav-link:hover {
  color: #fff;
}

.nav-link.router-link-active {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.nav-divider {
  color: rgba(255, 255, 255, 0.3);
  font-size: var(--font-xs);
}

.nav-link--disabled {
  opacity: 0.5;
  cursor: default;
}

/* 主题切换按钮 */
.theme-toggle {
  background: rgba(255,255,255,0.12);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
}

.theme-toggle:hover {
  background: rgba(255,255,255,0.25);
  transform: rotate(20deg);
}

/* --- 关于按钮的 tooltip --- */
.nav-tooltip {
  position: relative;
}

.nav-tooltip::after {
  content: attr(data-tip);
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  white-space: nowrap;
  background: rgba(0,0,0,0.82);
  color: #fff;
  font-size: var(--font-xs);
  padding: 6px 14px;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  font-family: var(--font-serif);
  letter-spacing: 1px;
}

/* tooltip 小三角 */
.nav-tooltip::before {
  content: '';
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: rgba(0,0,0,0.82);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.nav-tooltip:hover::after,
.nav-tooltip:hover::before {
  opacity: 1;
}

.nav-tooltip:hover::after {
  transform: translateX(-50%) translateY(0);
}
</style>
