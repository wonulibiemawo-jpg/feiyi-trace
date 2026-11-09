<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { courses, postStatuses, works } from '../data/pankou'
import { demo, eventTime, favoritesFor, notify, signIn, signOut, stepsFor, updateDemo, viewer } from '../data/demoStore'

const route = useRoute()
const router = useRouter()
const nickname = ref('')
const active = ref('收藏')
const tabs = ['收藏', '学习记录', '答题记录', '报名记录', '我的帖子']
const ownWorks = computed(() => works.filter(work => favoritesFor(viewer.value?.id).includes(work.id)))
const ownCourses = computed(() => courses.filter(course => stepsFor(viewer.value?.id, course.id).length))
const ownAttempts = computed(() => demo.value.attempts.filter(item => item.owner === viewer.value?.id))
const ownPosts = computed(() => demo.value.posts.filter(item => item.owner === viewer.value?.id))
const ownRegistrations = computed(() => demo.value.registrations.filter(item => item.owner === viewer.value?.id)
  .map(item => ({ ...item, event: demo.value.events.find(event => event.id === item.eventId) })).filter(item => item.event))

function login(name) {
  if (!signIn(name)) return
  const next = route.query.next
  if (typeof next === 'string' && /^\/(?![\\/])/.test(next) && router.resolve(next).name !== 'account') router.push(next)
}

function deletePost(post) {
  if (post.owner !== viewer.value?.id || !window.confirm('删除这篇帖子及其评论？')) return
  if (updateDemo(state => {
    state.posts = state.posts.filter(item => item.id !== post.id)
    state.comments = state.comments.filter(item => item.postId !== post.id)
  })) notify('帖子已删除')
}
</script>

<template>
  <section class="shell page narrow">
    <header class="page-heading"><p class="eyebrow">06 / MY ARCHIVE</p><h1>个人中心</h1><p>查看收藏、学习进度、答题结果、活动报名和作品帖子。</p></header>
    <p class="demo-note">前端演示 · 体验昵称、记录和图片保存在当前浏览器。请勿填写个人敏感信息。</p>
    <form v-if="!viewer" class="panel account-form" @submit.prevent="login(nickname)">
      <h2>进入体验账户</h2><p>使用新昵称创建本机档案，使用已有昵称继续体验。</p>
      <label>体验昵称<input v-model.trim="nickname" required minlength="2" maxlength="16" placeholder="输入 2–16 个字符"></label>
      <div class="actions">
        <button class="btn">进入个人中心</button>
        <button type="button" class="btn secondary" @click="login('体验学员')">使用体验学员</button>
      </div>
    </form>
    <template v-else>
      <div class="panel related"><div><p class="eyebrow">当前体验账户</p><h2>{{ viewer.name }}</h2></div><button class="btn secondary" @click="signOut">退出体验账户</button></div>
      <div class="filters account-tabs" aria-label="个人记录类型">
        <button v-for="tab in tabs" :key="tab" class="chip" :aria-pressed="active === tab" @click="active = tab">{{ tab }}</button>
      </div>
      <section v-if="active === '收藏'" class="panel record-list">
        <p v-if="!ownWorks.length">还没有收藏的盘扣资料。<RouterLink class="text-link" :to="{ name: 'works' }">前往图鉴 ↗</RouterLink></p>
        <RouterLink v-for="work in ownWorks" :key="work.id" class="record-row" :to="{ name: 'detail', params: { id: work.id } }"><strong>{{ work.name }}</strong><span>{{ work.category }} ↗</span></RouterLink>
      </section>
      <section v-else-if="active === '学习记录'" class="panel record-list">
        <p v-if="!ownCourses.length">还没有已查看的步骤。<RouterLink class="text-link" :to="{ name: 'courses' }">开始制作学习 ↗</RouterLink></p>
        <RouterLink v-for="course in ownCourses" :key="course.id" class="record-row" :to="{ name: 'courses', params: { id: course.id } }"><strong>{{ course.name }}</strong><span>{{ stepsFor(viewer.id, course.id).length }} / {{ course.steps.length }} 步 ↗</span></RouterLink>
      </section>
      <section v-else-if="active === '答题记录'" class="panel record-list">
        <p v-if="!ownAttempts.length">还没有答题记录。<RouterLink class="text-link" :to="{ name: 'quiz' }">去答题 ↗</RouterLink></p>
        <RouterLink v-for="attempt in ownAttempts" :key="attempt.id" class="record-row" :to="{ name: 'result', params: { id: attempt.id } }"><div><strong>{{ attempt.title }}</strong><small>{{ new Date(attempt.date).toLocaleString('zh-CN') }}</small></div><span>答对 {{ attempt.total - attempt.wrong.length }} / {{ attempt.total }} 题 ↗</span></RouterLink>
      </section>
      <section v-else-if="active === '报名记录'" class="panel record-list">
        <p v-if="!ownRegistrations.length">还没有活动报名。<RouterLink class="text-link" :to="{ name: 'events' }">查看体验活动 ↗</RouterLink></p>
        <RouterLink v-for="item in ownRegistrations" :key="item.eventId" class="record-row" :to="{ name: 'events', params: { id: item.eventId } }"><div><strong>{{ item.event.title }}</strong><small>{{ eventTime(item.event.time) }}</small></div><span>{{ item.status === 'active' ? '已报名' : item.status === 'event-cancelled' ? '活动已取消' : '已取消报名' }} ↗</span></RouterLink>
      </section>
      <section v-else class="panel record-list">
        <p v-if="!ownPosts.length">还没有发布的帖子。</p>
        <RouterLink class="btn" :to="{ name: 'new-post' }">发布帖子</RouterLink>
        <article v-for="post in ownPosts" :key="post.id" class="record-row post-record">
          <div><RouterLink class="text-link" :to="{ name: 'post', params: { id: post.id } }">{{ post.title }}</RouterLink>
            <small>{{ postStatuses[post.status] }}<template v-if="post.reason"> · {{ post.reason }}</template></small></div>
          <div class="actions">
            <RouterLink class="btn secondary small" :to="{ name: 'edit-post', params: { id: post.id } }">编辑</RouterLink>
            <button class="btn secondary small" @click="deletePost(post)">删除</button>
          </div>
        </article>
      </section>
    </template>
  </section>
</template>
