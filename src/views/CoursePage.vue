<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import KnotArt from '../components/KnotArt.vue'
import { courses } from '../data/pankou'
import { markViewed, stepsFor, viewer } from '../data/demoStore'

const route = useRoute()
const course = computed(() => courses.find(item => item.id === route.params.id))
const selected = ref(0)
const viewed = computed(() => stepsFor(viewer.value?.id, course.value?.id))
const step = computed(() => course.value?.steps[selected.value])

watch([course, () => viewer.value?.id], () => {
  const firstUnread = course.value?.steps.findIndex((_, index) => !viewed.value.includes(index))
  selected.value = firstUnread >= 0 ? firstUnread : 0
}, { immediate: true })
</script>

<template>
  <section class="shell page">
    <RouterLink v-if="route.params.id" class="back" :to="{ name: 'courses' }">← 制作学习</RouterLink>
    <header class="page-heading">
      <h1>{{ course?.name || '制作学习' }}</h1>
      <p>{{ course?.intro || '按步骤了解材料、操作顺序和注意事项。' }}</p>
    </header>
    <template v-if="course">
      <p class="demo-note">本站提供入门示意。已查看记录用于下次继续浏览。</p>
      <div class="detail-grid step-layout">
        <aside class="panel">
          <h2>学习步骤</h2>
          <p>已查看 {{ viewed.length }} / {{ course.steps.length }} 步</p>
          <progress :value="viewed.length" :max="course.steps.length" aria-label="已查看步骤"></progress>
          <ol class="step-list">
            <li v-for="(item, index) in course.steps" :key="item.title">
              <button class="step-button" :aria-current="selected === index ? 'step' : undefined" @click="selected = index">
                <span>{{ String(index + 1).padStart(2, '0') }}. {{ item.title }}</span><span v-if="viewed.includes(index)">✓</span>
              </button>
            </li>
          </ol>
          <p class="muted">材料与工具<br>{{ course.supplies }}</p>
        </aside>
        <article class="panel lesson">
          <figure class="art-panel palette-1">
            <KnotArt :design="step.art" :label="step.title + '配套造型示意图'" />
            <figcaption>练习造型示意</figcaption>
          </figure>
          <p class="eyebrow">步骤 {{ selected + 1 }} / {{ course.steps.length }}</p>
          <h2>{{ step.title }}</h2><p>{{ step.body }}</p>
          <p class="callout"><strong>操作要点</strong>　{{ step.tip }}</p>
          <div class="actions">
            <button v-if="selected > 0" class="btn secondary" @click="selected--">上一步</button>
            <button v-if="viewer" class="btn secondary" :disabled="viewed.includes(selected)" @click="markViewed(course.id, selected)">{{ viewed.includes(selected) ? '已查看' : '标记已查看' }}</button>
            <RouterLink v-else class="btn secondary" :to="{ name: 'account', query: { next: route.fullPath } }">登录后保存进度</RouterLink>
            <button v-if="selected < course.steps.length - 1" class="btn" @click="selected++">下一步</button>
            <RouterLink v-else class="btn" :to="{ name: 'quiz', query: { course: course.id } }">做相关题目</RouterLink>
          </div>
        </article>
      </div>
    </template>
    <div v-else-if="route.params.id" class="empty">找不到这组制作步骤。</div>
    <div v-else class="grid three">
      <RouterLink v-for="(item, index) in courses" :key="item.id" class="work-card" :to="{ name: 'courses', params: { id: item.id } }">
        <div class="art-panel" :class="'palette-' + index"><KnotArt :design="item.art" /></div>
        <div class="card-copy"><span class="tag">{{ item.steps.length }} 个步骤</span><h3>{{ item.name }}</h3><p>{{ item.intro }}</p><p v-if="viewer">已查看 {{ stepsFor(viewer.id, item.id).length }} 步</p></div>
      </RouterLink>
    </div>
  </section>
</template>
