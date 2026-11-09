<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import KnotArt from '../components/KnotArt.vue'
import { courses, sources, works } from '../data/pankou'
import { favoritesFor, toggleFavorite, viewer } from '../data/demoStore'

const route = useRoute()
const work = computed(() => works.find(item => item.id === route.params.id))
const course = computed(() => courses.find(item => item.id === work.value?.course))
const saved = computed(() => viewer.value && favoritesFor(viewer.value.id).includes(work.value?.id))
</script>

<template>
  <section class="shell page">
    <RouterLink class="back" :to="{ name: 'works' }">← 盘扣图鉴</RouterLink>
    <template v-if="work">
      <header class="page-heading">
        <p class="eyebrow">盘扣样式 / {{ work.category }}</p>
        <h1>{{ work.name }}</h1>
        <p>{{ work.feature }}</p>
      </header>
      <div class="detail-grid">
        <figure class="art-panel detail-art" :class="'palette-' + work.art % 3">
          <KnotArt :design="work.art" :label="work.name + '示意图'" />
          <figcaption>本站绘制 · 造型示意</figcaption>
        </figure>
        <div class="panel">
          <h2>样式资料</h2>
          <dl class="definition">
            <div><dt>特点</dt><dd>{{ work.feature }}</dd></div>
            <div><dt>用途</dt><dd>{{ work.use }}</dd></div>
            <div><dt>来源</dt><dd><a :href="sources.culture" target="_blank" rel="noopener">上海市文旅推广网 · 项目介绍 ↗</a><br>样式说明及练习图由本站整理。</dd></div>
          </dl>
          <div class="actions">
            <button v-if="viewer" class="btn secondary" :aria-pressed="Boolean(saved)" @click="toggleFavorite(work.id)">{{ saved ? '取消收藏' : '收藏资料' }}</button>
            <RouterLink v-else class="btn secondary" :to="{ name: 'account', query: { next: route.fullPath } }">登录后收藏</RouterLink>
          </div>
        </div>
      </div>
      <section class="panel related">
        <div><p class="eyebrow">关联学习</p><h2>{{ course.name }}</h2><p>{{ course.intro }}</p></div>
        <div class="actions">
          <RouterLink class="btn" :to="{ name: 'courses', params: { id: course.id } }">查看步骤</RouterLink>
          <RouterLink class="btn secondary" :to="{ name: 'quiz', query: { course: course.id } }">相关知识题</RouterLink>
        </div>
      </section>
    </template>
    <div v-else class="empty"><h1>没有找到这份盘扣资料</h1><p>你可以从图鉴重新选择想看的样式。</p></div>
  </section>
</template>
