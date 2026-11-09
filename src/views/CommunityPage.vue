<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { postStatuses, postTypes } from '../data/pankou'
import { demo, newId, notify, updateDemo, viewer } from '../data/demoStore'

const route = useRoute()
const activeType = ref('')
const body = ref('')
const replyTo = ref(null)
const filtered = computed(() => demo.value.posts.filter(item => item.status === 'approved' && (!activeType.value || item.type === activeType.value)))
const post = computed(() => demo.value.posts.find(item => item.id === route.params.id && (item.status === 'approved' || item.owner === viewer.value?.id)))
const comments = computed(() => demo.value.comments.filter(item => item.postId === post.value?.id))

watch(() => route.params.id, () => {
  body.value = ''
  replyTo.value = null
})

function comment() {
  const text = body.value.trim()
  if (!viewer.value || post.value?.status !== 'approved' || !text || text.length > 500) return
  if (updateDemo(state => {
    state.comments.push({ id: newId(), postId: post.value.id, owner: viewer.value.id, author: viewer.value.name, body: text, parentId: replyTo.value?.id || '' })
  })) {
    body.value = ''
    replyTo.value = null
    notify('评论已发布')
  }
}
</script>

<template>
  <section class="shell page narrow">
    <RouterLink v-if="route.params.id" class="back" :to="{ name: 'community' }">← 作品交流</RouterLink>
    <header class="page-heading">
      <h1>{{ post?.title || '作品交流' }}</h1>
      <p>{{ post ? post.type + ' · ' + post.author : '分享你的盘扣练习，或带着具体的制作问题来交流。' }}</p>
    </header>
    <template v-if="route.params.id">
      <template v-if="post">
        <article class="panel">
          <p v-if="post.status !== 'approved'" class="callout">{{ postStatuses[post.status] }}<template v-if="post.reason"> · {{ post.reason }}</template></p>
          <p class="post-body">{{ post.body }}</p>
          <div v-if="post.images.length" class="grid two post-images">
            <img v-for="(src, index) in post.images" :key="index" :src="src" :alt="'帖子附件 ' + (index + 1)">
          </div>
          <RouterLink v-if="post.owner === viewer?.id" class="text-link" :to="{ name: 'edit-post', params: { id: post.id } }">编辑帖子 ↗</RouterLink>
        </article>
        <section v-if="post.status === 'approved'" class="panel comments">
          <h2>评论与回复</h2>
          <p v-if="!comments.length" class="muted">还没有评论。</p>
          <article v-for="item in comments" :key="item.id" class="comment">
            <strong>{{ item.author }}</strong>
            <span v-if="item.parentId" class="muted"> 回复 {{ comments.find(other => other.id === item.parentId)?.author || '已删除的评论' }}</span>
            <p class="post-body">{{ item.body }}</p>
            <button v-if="viewer" class="text-link" @click="replyTo = item">回复</button>
          </article>
          <form v-if="viewer" class="form-stack" @submit.prevent="comment">
            <label>{{ replyTo ? '回复 ' + replyTo.author : '发表评论' }}<textarea v-model="body" required maxlength="500" rows="3" placeholder="写下具体的建议或问题"></textarea></label>
            <div class="actions"><button class="btn" :disabled="!body.trim()">发布{{ replyTo ? '回复' : '评论' }}</button><button v-if="replyTo" type="button" class="btn secondary" @click="replyTo = null">取消回复</button></div>
          </form>
          <RouterLink v-else class="btn secondary" :to="{ name: 'account', query: { next: route.fullPath } }">登录后参与评论</RouterLink>
        </section>
      </template>
      <div v-else class="empty"><h2>帖子不存在或暂未公开</h2><RouterLink class="text-link" :to="{ name: 'community' }">查看公开帖子 ↗</RouterLink></div>
    </template>
    <template v-else>
      <p class="demo-note">前端演示 · 列表展示已通过审核的本机帖子和示例帖。</p>
      <div class="toolbar">
        <div class="filters" aria-label="交流类型">
          <button v-for="type in ['', ...postTypes]" :key="type" class="chip" :aria-pressed="activeType === type" @click="activeType = type">{{ type || '全部' }}</button>
        </div>
        <RouterLink class="btn" :to="{ name: 'new-post' }">发布帖子 <span aria-hidden="true">＋</span></RouterLink>
      </div>
      <div v-if="filtered.length" class="grid two">
        <RouterLink v-for="item in filtered" :key="item.id" class="panel listing" :to="{ name: 'post', params: { id: item.id } }">
          <p class="eyebrow">{{ item.type }} · {{ item.author }}</p><h2>{{ item.title }}</h2><p class="excerpt">{{ item.body }}</p><span class="text-link">查看讨论 ↗</span>
        </RouterLink>
      </div>
      <div v-else class="empty"><h2>这一分类还没有公开帖子</h2></div>
    </template>
  </section>
</template>
