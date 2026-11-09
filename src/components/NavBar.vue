<script setup>
const links = [
  ['home', '首页'], ['works', '盘扣图鉴'], ['courses', '制作学习'], ['quiz', '知识答题'],
  ['community', '作品交流'], ['events', '体验活动'],
]
</script>

<template>
  <header class="site-header">
    <div class="shell header-inner">
      <RouterLink :to="{ name: 'home' }" class="brand" aria-label="上海盘扣文化 首页">
        <span class="brand-mark" aria-hidden="true">扣</span>
        <span>上海盘扣文化<small>SHANGHAI PANKOU</small></span>
      </RouterLink>
      <nav class="site-nav" aria-label="主导航">
        <RouterLink v-for="[name, label] in links" :key="name" :to="{ name }">{{ label }}</RouterLink>
      </nav>
      <RouterLink :to="{ name: 'account' }" class="account-link">个人中心 <span aria-hidden="true">↗</span></RouterLink>
    </div>
  </header>
</template>
