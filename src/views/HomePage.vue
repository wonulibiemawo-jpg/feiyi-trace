<template>
  <div class="home-page">
    <!-- 英雄横幅 -->
    <section class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">非遗·寻迹</h1>
        <p class="hero-subtitle">
          走进中国非物质文化遗产，感受千年匠心之美
        </p>
        <p class="hero-desc">
          从京剧昆曲到剪纸刺绣，从陶瓷技艺到太极武术——每一门手艺背后，
          <br/>都是代代相传的智慧与热爱。
        </p>
      </div>
    </section>

    <!-- 数据统计栏 -->
    <section class="stats-bar">
      <div class="stat-item">
        <CountUp :target="stats.total" suffix=" 项" />
        <span class="stat-label">收录非遗</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <CountUp :target="stats.categories" suffix=" 类" />
        <span class="stat-label">涵盖分类</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <CountUp :target="stats.regions" suffix=" 地" />
        <span class="stat-label">覆盖地区</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <CountUp :target="stats.oldestYear" suffix=" 年" />
        <span class="stat-label">最早入选</span>
      </div>
    </section>

    <!-- 搜索框 -->
    <section class="search-section">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索非遗项目名称、地区..."
          class="search-input"
        />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
      </div>
    </section>

    <!-- 分类筛选标签 -->
    <section class="filter-section">
      <button
        v-for="cat in ['全部', ...categories]"
        :key="cat"
        @click="activeCategory = cat"
        :class="['filter-tag', { 'filter-tag--active': activeCategory === cat }]"
      >
        {{ cat === '全部' ? '🏷️ 全部' : cat }}
      </button>
    </section>

    <!-- 非遗卡片列表 -->
    <TransitionGroup name="card-list" tag="section" class="card-grid">
      <HeritageCard
        v-for="item in filteredList"
        :key="item.id"
        :item="item"
        :highlight="highlightWord"
      />
    </TransitionGroup>

    <!-- 空状态提示 -->
    <div v-if="filteredList.length === 0" class="empty-state">
      <template v-if="searchQuery">
        <p>🔍 没有找到与"<strong>{{ searchQuery }}</strong>"相关的非遗项目</p>
        <p class="empty-hint">试试其他关键词，或清空搜索查看全部</p>
      </template>
      <template v-else>
        <p>该分类下暂无内容</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { heritageList, categories } from '../data/heritage.js'
import HeritageCard from '../components/HeritageCard.vue'
import CountUp from '../components/CountUp.vue'

// 统计数据
const stats = computed(() => ({
  total: heritageList.length,
  categories: categories.length,
  regions: new Set(heritageList.map(h => h.region)).size,
  oldestYear: Math.min(...heritageList.map(h => h.year))
}))

// 搜索和分类筛选
const searchQuery = ref('')
const activeCategory = ref('全部')

// 根据搜索词 + 分类 双重过滤
const filteredList = computed(() => {
  let list = heritageList

  // 分类筛选
  if (activeCategory.value !== '全部') {
    list = list.filter(item => item.category === activeCategory.value)
  }

  // 搜索过滤（名称、地区、描述）
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    )
  }

  return list
})

// 当前高亮关键词（传给卡片子组件）
const highlightWord = computed(() => searchQuery.value.trim())
</script>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

/* --- 英雄横幅 --- */
.hero-banner {
  background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary));
  border-radius: var(--radius-xl);
  padding: 60px 40px;
  text-align: center;
  margin-bottom: 32px;
  color: #fff;
}

.hero-title {
  font-size: 48px;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: 6px;
}

.hero-subtitle {
  font-size: var(--font-xl);
  margin-bottom: 12px;
  opacity: 0.95;
}

.hero-desc {
  font-size: var(--font-base);
  opacity: 0.8;
  line-height: 1.8;
}

/* --- 数据统计栏 --- */
.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0;
  margin-bottom: 32px;
  padding: 24px 0;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-label {
  font-size: var(--font-xs);
  color: var(--color-text-muted);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* --- 搜索框 --- */
.search-section {
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 6px 18px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}

.search-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 10px 0;
  border: none;
  outline: none;
  font-size: var(--font-base);
  font-family: var(--font-sans);
  background: transparent;
  color: var(--color-text);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-clear {
  background: var(--color-border);
  color: var(--color-text-light);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

.search-clear:hover {
  background: var(--color-text-muted);
  color: #fff;
}

/* --- 分类标签 --- */
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;
}

.filter-tag {
  padding: 8px 20px;
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  font-size: var(--font-sm);
  color: var(--color-text-light);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹性缓动 */
}

.filter-tag:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.filter-tag:active {
  transform: scale(0.95);  /* 按下时微微缩小 */
}

.filter-tag--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.filter-tag--active:hover {
  transform: scale(1.05);  /* 已选中不再上浮 */
}

/* --- 卡片列表 --- */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  position: relative;
}

/* 卡片过滤切换过渡动画 */
.card-list-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.card-list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

/* 进入前：淡入 + 从下方飘入 */
.card-list-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

/* 离开后：淡出 + 原地缩小 */
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 卡片位置变动时平滑过渡（FLIP） */
.card-list-move {
  transition: transform 0.35s ease;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--color-text-muted);
}

.empty-hint {
  font-size: var(--font-sm);
  margin-top: 8px;
  color: var(--color-text-muted);
}

/* --- 手机端适配 --- */
@media (max-width: 768px) {
  .hero-banner {
    padding: 40px 20px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: var(--font-lg);
  }

  .card-grid {
    grid-template-columns: 1fr;   /* 手机端一列 */
  }
}
</style>
