<script setup>
import NavBar from './components/NavBar.vue'
import { notice } from './data/demoStore'
</script>

<template>
  <NavBar />
  <main id="main-content" class="site-main">
    <RouterView />
  </main>
  <footer class="site-footer">
    <div class="shell footer-inner">
      <div><strong>上海盘扣文化</strong><p>上海中侨职业技术大学 · 数字媒体技术毕业设计</p></div>
      <div class="footer-links">
        <RouterLink :to="{ name: 'home', hash: '#sources' }">资料出处</RouterLink>
        <RouterLink :to="{ name: 'admin' }">管理演示</RouterLink>
      </div>
    </div>
  </footer>
  <div v-if="notice" class="toast" role="status">{{ notice }}</div>
</template>
