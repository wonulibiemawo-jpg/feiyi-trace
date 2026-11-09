<script setup>
import { computed, ref } from 'vue'
import HeritageCard from '../components/HeritageCard.vue'
import { categories, works } from '../data/pankou'

const search = ref('')
const category = ref('')
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return works.filter(work => (!category.value || work.category === category.value)
    && [work.name, work.category, work.feature, work.use].some(text => text.toLowerCase().includes(term)))
})

function reset() {
  search.value = ''
  category.value = ''
}
</script>

<template>
  <section class="shell page">
    <header class="page-heading">
      <p class="eyebrow">01 / PATTERN INDEX</p>
      <h1>盘扣图鉴</h1>
      <p>按扣形查找资料，了解每款样式的特点、用途与对应练习。</p>
    </header>
    <div class="toolbar">
      <div class="filters" aria-label="盘扣分类">
        <button v-for="item in ['', ...categories]" :key="item" class="chip" :aria-pressed="category === item" @click="category = item">{{ item || '全部' }}</button>
      </div>
      <label class="search-field"><span class="sr-only">搜索盘扣</span><input v-model="search" type="search" placeholder="搜索扣形、用途或关键词"></label>
    </div>
    <p class="result-count" aria-live="polite">共 {{ filtered.length }} 款盘扣样式</p>
    <div v-if="filtered.length" class="grid three">
      <HeritageCard v-for="work in filtered" :key="work.id" :work="work" />
    </div>
    <div v-else class="empty"><h2>没有匹配的盘扣</h2><button class="btn secondary" @click="reset">清除筛选</button></div>
  </section>
</template>
