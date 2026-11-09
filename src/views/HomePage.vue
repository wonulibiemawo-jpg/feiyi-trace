<script setup>
import KnotArt from '../components/KnotArt.vue'
import HeritageCard from '../components/HeritageCard.vue'
import { courses, questions, sources, works } from '../data/pankou'

const featured = ['straight', 'pipa', 'flower'].map(id => works.find(work => work.id === id))
</script>

<template>
  <div class="shell home">
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> 上海市非物质文化遗产 · 徐汇区</p>
        <h1 id="home-title">上海<br>盘扣<span class="accent">文化</span></h1>
        <p class="hero-text">一枚扣，连接衣襟，也装点衣襟。<br>从辨认扣形开始，沿着布条的走向了解盘扣。</p>
        <div class="actions">
          <RouterLink class="btn" :to="{ name: 'works' }">浏览盘扣图鉴 <span aria-hidden="true">↗</span></RouterLink>
          <RouterLink class="btn secondary" :to="{ name: 'courses' }">开始制作学习</RouterLink>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-art-meta"><span>SHANGHAI CRAFT ARCHIVE</span><span>2009 / XUHUI</span></div>
        <KnotArt :design="5" label="蝴蝶形盘扣线描示意图" />
        <div class="hero-art-meta"><span>FIG. 01</span><span>蝴蝶形盘扣 · 造型示意</span></div>
      </div>
    </section>

    <section class="stats" aria-label="资料概览">
      <div><strong>{{ works.length }}</strong> 款盘扣样式</div>
      <div><strong>{{ courses.length }}</strong> 组基础练习</div>
      <div><strong>{{ questions.length }}</strong> 道知识题</div>
    </section>

    <section class="home-section">
      <div class="section-heading">
        <div><p class="eyebrow">01 / PATTERN INDEX</p><h2>从三种扣形看起</h2></div>
        <RouterLink class="text-link" :to="{ name: 'works' }">全部盘扣样式 ↗</RouterLink>
      </div>
      <div class="grid three">
        <HeritageCard v-for="work in featured" :key="work.id" :work="work" />
      </div>
    </section>

    <section class="home-section learning-band">
      <div><p class="eyebrow">02 / FIELD NOTES</p><h2>看盘扣，也动手练习</h2><p>从布条、扣环和纸样开始。看完步骤后做几道题，把容易混淆的内容带回图鉴复习。</p></div>
      <div class="actions">
        <RouterLink class="btn" :to="{ name: 'courses' }">查看制作步骤</RouterLink>
        <RouterLink class="btn secondary" :to="{ name: 'quiz' }">做一组练习题</RouterLink>
      </div>
    </section>

    <section id="sources" class="home-section source-section">
      <p class="eyebrow">03 / REFERENCES</p><h2>项目与资料出处</h2>
      <p>中式服装盘扣制作技艺于 2009 年列入第二批上海市非物质文化遗产名录，由徐汇区申报。本站围绕同一技艺介绍不同扣形，图鉴与练习所用插图均为本站绘制的造型示意。</p>
      <div class="source-links">
        <a :href="sources.city" target="_blank" rel="noopener">上海市人民政府 · 第二批上海市非遗名录 ↗</a>
        <a :href="sources.culture" target="_blank" rel="noopener">上海市文旅推广网 · 中式服装盘扣制作技艺 ↗</a>
      </div>
    </section>
  </div>
</template>
