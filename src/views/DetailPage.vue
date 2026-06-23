<template>
  <div class="detail-page">
    <!-- 返回按钮 -->
    <router-link to="/" class="back-link">← 返回首页</router-link>

    <!-- 加载中 / 未找到 -->
    <div v-if="!item" class="not-found">
      <p>未找到该非遗项目</p>
      <router-link to="/">返回首页</router-link>
    </div>

    <!-- 详情内容 -->
    <template v-else>
      <!-- 顶部大图 -->
      <div class="detail-hero">
        <img :src="heroSrc" :alt="item.name" class="detail-image" @error="onHeroError" />
        <!-- 图片加载失败时的占位层 -->
        <div v-if="heroFailed" class="detail-hero-placeholder">
          <span class="placeholder-icon">{{ placeholderIcon }}</span>
          <h1>{{ item.name }}</h1>
        </div>
        <div class="detail-hero-overlay">
          <h1>{{ item.name }}</h1>
          <div class="detail-tags">
            <span class="tag tag-category">{{ item.category }}</span>
            <span class="tag tag-region">📍 {{ item.region }}</span>
            <span class="tag tag-year">📅 {{ item.year }}年入选非遗</span>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="detail-body">
        <!-- 项目简介 -->
        <section class="detail-section">
          <h2>项目简介</h2>
          <p>{{ item.description }}</p>
        </section>

        <!-- 历史渊源 -->
        <section class="detail-section">
          <h2>历史渊源</h2>
          <p>{{ item.origin }}</p>
        </section>

        <!-- 时间轴 -->
        <section v-if="item.timeline" class="detail-section">
          <h2>发展历程</h2>
          <div class="timeline">
            <div
              v-for="(event, i) in item.timeline"
              :key="i"
              :class="['timeline-item', i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right']"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-card">
                <span class="timeline-year">{{ event.year }}</span>
                <span class="timeline-text">{{ event.text }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 艺术特色 -->
        <section class="detail-section">
          <h2>艺术特色</h2>
          <div class="feature-tags">
            <span
              v-for="feature in item.features"
              :key="feature"
              class="feature-tag"
            >
              {{ feature }}
            </span>
          </div>
        </section>

        <!-- AI 讲解入口 -->
        <section class="detail-section ai-section">
          <div class="ai-cta">
            <span class="ai-cta-icon">🤖</span>
            <div class="ai-cta-text">
              <h3>还想了解更多？</h3>
              <p>点击右下角的「AI 讲解」按钮，让 AI 助手为你深入讲解{{ item.name }}的故事！</p>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { heritageList } from '../data/heritage.js'
import { getPlaceholderUrl } from '../utils/placeholder.js'

// useRoute() 获取当前路由信息，包括 URL 中的 :id 参数
const route = useRoute()

// 根据路由中的 id 参数，从数据列表中找到对应的非遗项目
const item = computed(() => {
  const id = Number(route.params.id)  // URL参数是字符串，转为数字
  return heritageList.find(h => h.id === id)
})

// 顶部大图加载状态管理
const heroSrc = ref('')     // 当前显示的图片地址
const heroFailed = ref(false)  // 是否加载失败

// 不同分类对应的占位符图标
const placeholderIcon = computed(() => {
  if (!item.value) return '🏮'
  return {
    '传统戏剧': '🎭',
    '传统技艺': '🏺',
    '传统美术': '✂️',
    '传统体育': '☯️',
  }[item.value.category] || '🏮'
})

// 监听 item 变化，重置/更新图片地址
import { watch } from 'vue'
watch(() => item.value?.id, () => {
  if (item.value) {
    heroSrc.value = item.value.image
    heroFailed.value = false
  }
}, { immediate: true })

// 图片加载失败时的处理
function onHeroError() {
  if (!heroFailed.value && item.value) {
    heroFailed.value = true
    heroSrc.value = getPlaceholderUrl(item.value.name, item.value.category)
  }
}
</script>

<style scoped>
.detail-page {
  max-width: 900px;
  margin: 0 auto;
}

/* --- 返回按钮 --- */
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  font-size: var(--font-sm);
  color: var(--color-text-light);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.back-link:hover {
  background: var(--color-primary-light);
}

/* --- 顶部大图 --- */
.detail-hero {
  position: relative;
  border-radius: var(--radius-xl);
  overflow: hidden;
  margin-bottom: 32px;
  height: 350px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 顶部大图加载失败时的占位层 */
.detail-hero-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #6B3410, #8B4513);
  color: #F8F5F0;
  z-index: 1;
}

.detail-hero-placeholder .placeholder-icon {
  font-size: 64px;
  opacity: 0.7;
}

.detail-hero-placeholder h1 {
  font-size: 36px;
  color: #F8F5F0;
  opacity: 0.9;
}

.detail-hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 32px 24px;
  background: linear-gradient(transparent, rgba(0,0,0,0.75));
  color: #fff;
  z-index: 2;
}

.detail-hero-overlay h1 {
  color: #fff;
  font-size: 36px;
  margin-bottom: 12px;
}

.detail-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 14px;
  border-radius: 20px;
  font-size: var(--font-xs);
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
}

/* --- 内容区域 --- */
.detail-body {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-sm);
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h2 {
  font-size: var(--font-xl);
  color: var(--color-primary-dark);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--color-primary-light);
}

.detail-section p {
  font-size: var(--font-base);
  line-height: 1.8;
  color: var(--color-text);
}

/* --- 特色标签 --- */
.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-tag {
  padding: 8px 18px;
  background: var(--color-accent-light);
  color: var(--color-accent);
  border-radius: 24px;
  font-size: var(--font-sm);
  font-weight: bold;
  border: 1px solid rgba(196, 30, 58, 0.2);
}

/* --- AI 讲解入口 --- */
.ai-section {
  margin-top: 40px;
}

.ai-cta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fef3e2, #fff8f0);
  border: 1px dashed var(--color-primary);
  border-radius: var(--radius-lg);
}

.ai-cta-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.ai-cta-text h3 {
  font-size: var(--font-lg);
  color: var(--color-primary-dark);
  margin-bottom: 4px;
}

.ai-cta-text p {
  font-size: var(--font-sm);
  color: var(--color-text-light);
}

/* --- 未找到状态 --- */
.not-found {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-muted);
}

/* --- 时间轴 --- */
.timeline {
  position: relative;
  padding: 16px 0;
}

/* 中间竖线 */
.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-primary-light));
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  animation: timeline-in 0.5s ease-out both;
}

/* 每个节点依次延迟出现 */
.timeline-item:nth-child(1) { animation-delay: 0.1s; }
.timeline-item:nth-child(2) { animation-delay: 0.2s; }
.timeline-item:nth-child(3) { animation-delay: 0.3s; }
.timeline-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes timeline-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* 左侧卡片 */
.timeline-item--left {
  justify-content: flex-start;
  padding-right: calc(50% + 28px);
}

/* 右侧卡片 */
.timeline-item--right {
  justify-content: flex-end;
  padding-left: calc(50% + 28px);
}

/* 时间轴圆点 */
.timeline-dot {
  position: absolute;
  left: 50%;
  top: 16px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 3px solid var(--color-bg-white);
  box-shadow: 0 0 0 3px var(--color-primary-light);
  transform: translateX(-50%);
  z-index: 1;
}

/* 卡片内容 */
.timeline-card {
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s;
}

.timeline-card:hover {
  box-shadow: var(--shadow-md);
}

.timeline-year {
  display: block;
  font-family: var(--font-serif);
  font-size: var(--font-sm);
  font-weight: bold;
  color: var(--color-accent);
  margin-bottom: 6px;
}

.timeline-text {
  font-size: var(--font-sm);
  color: var(--color-text);
  line-height: 1.6;
}

/* --- 手机端 --- */
@media (max-width: 768px) {
  .detail-hero {
    height: 220px;
  }

  .detail-hero-overlay h1 {
    font-size: 24px;
  }

  .detail-body {
    padding: 20px;
  }

  /* 手机端时间轴：竖线靠左，全部左对齐 */
  .timeline::before {
    left: 18px;
  }

  .timeline-item--left,
  .timeline-item--right {
    padding-left: 48px;
    padding-right: 0;
    justify-content: flex-start;
  }

  .timeline-dot {
    left: 18px;
  }
}
</style>
