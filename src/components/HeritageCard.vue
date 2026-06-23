<template>
  <router-link
    :to="`/detail/${item.id}`"
    ref="cardRef"
    class="heritage-card"
    :style="tiltStyle"
    @mousemove="onTilt"
    @mouseleave="onTiltReset"
  >
    <!-- 卡片图片 -->
    <div class="card-image-wrapper">
      <!-- 骨架屏：图片加载中显示闪烁占位 -->
      <div v-if="!imageLoaded" class="card-skeleton">
        <div class="skeleton-shimmer"></div>
      </div>
      <img
        ref="imgRef"
        :src="imageSrc"
        :alt="item.name"
        class="card-image"
        @load="onImageLoad"
        @error="onImageError"
      />
      <!-- 图片加载失败时显示的占位层 -->
      <div v-if="imageFailed" class="card-placeholder">
        <span class="placeholder-icon">{{ placeholderIcon }}</span>
        <span class="placeholder-name">{{ item.name }}</span>
      </div>
      <!-- 分类标签浮在图片上方 -->
      <span class="card-category">{{ item.category }}</span>
    </div>

    <!-- 卡片信息 -->
    <div class="card-info">
      <h3 class="card-title" v-html="highlightText(item.name)"></h3>
      <p class="card-desc" v-html="highlightText(item.description)"></p>
      <div class="card-meta">
        <span class="meta-item">📍 {{ item.region }}</span>
        <span class="meta-item">📅 {{ item.year }}年入选非遗</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
// HeritageCard 组件：展示单个非遗项目的卡片
// 接收 item 对象作为 props，包含 name、image、description 等字段
// 整个卡片是可点击的链接，跳转到详情页
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getPlaceholderUrl } from '../utils/placeholder.js'

const props = defineProps({
  item: {
    type: Object,     // item 是一个对象
    required: true
  },
  highlight: {
    type: String,
    default: ''
  }
})

// 关键词高亮：把匹配文字包上 <mark> 标签
function highlightText(text) {
  if (!props.highlight || !text) return text
  const escaped = props.highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${escaped})`, 'gi')
  return text.replace(re, '<mark>$1</mark>')
}

// --- 3D 倾斜效果 ---
const cardRef = ref(null)
const tiltX = ref(0)
const tiltY = ref(0)

const tiltStyle = computed(() => ({
  transform: `perspective(600px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) translateY(${Math.abs(tiltX.value) > 0 ? -4 : 0}px)`,
  boxShadow: Math.abs(tiltX.value) > 0 || Math.abs(tiltY.value) > 0
    ? 'var(--shadow-lg)'
    : 'var(--shadow-sm)'
}))

function onTilt(e) {
  const rect = cardRef.value?.$el?.getBoundingClientRect?.()
    || cardRef.value?.getBoundingClientRect?.()
  if (!rect) return
  const x = e.clientX - rect.left     // 鼠标在卡片内的 X
  const y = e.clientY - rect.top       // 鼠标在卡片内的 Y
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  // 偏离中心越远，倾斜越大，最大 ±8 度
  tiltY.value = ((x - centerX) / centerX) * 8
  tiltX.value = -((y - centerY) / centerY) * 8
}

function onTiltReset() {
  tiltX.value = 0
  tiltY.value = 0
}

// 图片加载状态管理
const imageSrc = ref(props.item.image)    // 当前显示的图片地址
const imageFailed = ref(false)            // 图片是否加载失败
const imageLoaded = ref(false)            // 图片是否加载成功（用于隐藏骨架屏）
const imgRef = ref(null)                  // 图片DOM引用

// 不同分类对应的占位符图标
const placeholderIcon = {
  '传统戏剧': '🎭',
  '传统技艺': '🏺',
  '传统美术': '✂️',
  '传统体育': '☯️',
}[props.item.category] || '🏮'

// 图片加载成功回调
function onImageLoad() {
  imageLoaded.value = true
}

let pollTimer = null  // 轮询定时器引用

// 组件挂载后检查：缓存图片直接显示；未缓存用轮询兜底
onMounted(() => {
  if (imgRef.value?.complete) {
    imageLoaded.value = true
    return
  }
  // 兜底：每 200ms 检查一次，最多等 5 秒
  let attempts = 0
  pollTimer = setInterval(() => {
    attempts++
    if (imgRef.value?.complete) {
      imageLoaded.value = true
      clearInterval(pollTimer)
      pollTimer = null
    }
    if (attempts >= 25) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }, 200)
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})

// 图片加载失败时的处理：切换到 SVG 占位图
function onImageError() {
  if (!imageFailed.value) {
    imageFailed.value = true
    imageSrc.value = getPlaceholderUrl(props.item.name, props.item.category)
  }
}
</script>

<style scoped>
.heritage-card {
  display: block;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;           /* 图片圆角裁剪 */
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  color: var(--color-text);
  transform-style: preserve-3d;  /* 子元素支持 3D */
}

/* 图片区域 */
.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;          /* 图片裁剪适配，不变形 */
  transition: transform 0.4s;
}

/* --- 骨架屏：图片加载前的闪烁占位 --- */
.card-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #e8e3da, #dfd9ce);
  z-index: 1;
  overflow: hidden;
}

.skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.heritage-card:hover .card-image {
  transform: scale(1.05);     /* hover 时图片微微放大 */
}

/* 图片加载失败时的占位层 */
.card-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #6B3410, #8B4513);
  color: #F8F5F0;
  z-index: 1;
}

.placeholder-icon {
  font-size: 48px;
  opacity: 0.7;
}

.placeholder-name {
  font-size: 18px;
  font-weight: bold;
  font-family: var(--font-serif);
  opacity: 0.8;
}

/* 分类标签：浮在图片左上角 */
.card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: var(--color-accent);
  color: #fff;
  font-size: var(--font-xs);
  padding: 4px 12px;
  border-radius: 20px;        /* 胶囊形状 */
  font-weight: bold;
  letter-spacing: 1px;
}

/* 文字信息区 */
.card-info {
  padding: var(--space-md) var(--space-lg);
}

.card-title {
  font-size: var(--font-lg);
  margin-bottom: var(--space-sm);
  color: var(--color-primary-dark);
}

/* 搜索高亮标记 */
.card-title :deep(mark),
.card-desc :deep(mark) {
  background: #fde68a;
  color: #92400e;
  padding: 1px 4px;
  border-radius: 2px;
}

.card-desc {
  font-size: var(--font-sm);
  color: var(--color-text-light);
  line-height: 1.6;

  /* 限制显示两行，超出显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
}

.meta-item {
  font-size: var(--font-xs);
  color: var(--color-text-muted);
}
</style>
