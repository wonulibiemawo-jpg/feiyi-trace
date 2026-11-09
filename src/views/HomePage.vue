<script setup>
import KnotArt from '../components/KnotArt.vue'
import HeritageCard from '../components/HeritageCard.vue'
import { sources, works } from '../data/pankou'

const featured = ['straight', 'pipa', 'flower'].map(id => works.find(work => work.id === id))
</script>

<template>
  <div class="shell home">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">上海市级非遗 · 徐汇区</p>
        <h1 id="home-title">上海盘扣文化</h1>
        <p class="hero-text">盘扣常见于旗袍等中式服装。这里整理了常见扣形、用途和制作步骤，可以先看图鉴，再用布条做基础练习。</p>
        <div class="actions">
          <RouterLink class="btn" :to="{ name: 'works' }">浏览盘扣图鉴</RouterLink>
          <RouterLink class="btn secondary" :to="{ name: 'courses' }">查看制作步骤</RouterLink>
        </div>
      </div>
      <figure class="hero-art">
        <KnotArt :design="5" label="蝴蝶形盘扣线描示意图" />
        <figcaption>蝴蝶形盘扣示意</figcaption>
      </figure>
    </section>

    <section class="home-section">
      <div class="section-heading">
        <h2>常见盘扣样式</h2>
        <RouterLink class="text-link" :to="{ name: 'works' }">查看全部 {{ works.length }} 款</RouterLink>
      </div>
      <div class="grid three">
        <HeritageCard v-for="work in featured" :key="work.id" :work="work" />
      </div>
    </section>

    <section class="home-section learning-band">
      <div><h2>基础制作练习</h2><p>第一次做，可以从准备布条和试扣开始。看完步骤后，可以做题复习。</p></div>
      <div class="actions">
        <RouterLink class="btn secondary" :to="{ name: 'courses', params: { id: 'cord' } }">布条准备与试扣</RouterLink>
        <RouterLink class="text-link" :to="{ name: 'quiz' }">做练习题</RouterLink>
      </div>
    </section>

    <section id="sources" class="home-section source-section">
      <h2>资料来源</h2>
      <p>2009 年，徐汇区申报的中式服装盘扣制作技艺列入第二批上海市非物质文化遗产名录。图鉴和练习中的插图为本站绘制的示意图。</p>
      <div class="source-links">
        <a :href="sources.city" target="_blank" rel="noopener">上海市人民政府 · 第二批上海市非遗名录 ↗</a>
        <a :href="sources.culture" target="_blank" rel="noopener">上海市文旅推广网 · 中式服装盘扣制作技艺 ↗</a>
      </div>
    </section>
  </div>
</template>
