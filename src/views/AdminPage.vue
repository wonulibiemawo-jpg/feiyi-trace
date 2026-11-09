<script setup>
import { computed, ref } from 'vue'
import { courses, postStatuses, questions, works } from '../data/pankou'
import { adminMode, demo, eventStatus, eventTime, newId, notify, registrationCount, updateDemo } from '../data/demoStore'

const tabs = ['帖子审核', '活动管理', '内容预览']
const active = ref(tabs[0])
const pending = computed(() => demo.value.posts.filter(item => item.status === 'pending'))
const queue = computed(() => [...pending.value, ...demo.value.posts.filter(item => item.status !== 'pending')])
const reasons = ref({})
const error = ref('')
const editing = ref(null)
const rosterId = ref('')
const roster = computed(() => demo.value.registrations.filter(item => item.eventId === rosterId.value && item.status === 'active')
  .map(item => demo.value.profiles.find(profile => profile.id === item.owner)?.name || '未知档案'))

function review(post, status) {
  if (!adminMode.value) return
  const reason = reasons.value[post.id]?.trim() || ''
  if (status === 'rejected' && !reason) {
    notify('退回帖子前请填写审核原因。')
    return
  }
  if (updateDemo(state => {
    const item = state.posts.find(entry => entry.id === post.id)
    item.status = status
    item.reason = status === 'rejected' ? reason : ''
  })) {
    delete reasons.value[post.id]
    notify(status === 'approved' ? '帖子已通过审核' : '帖子已退回')
  }
}

function deleteComment(id) {
  if (!adminMode.value || !window.confirm('删除这条评论？')) return
  if (updateDemo(state => { state.comments = state.comments.filter(item => item.id !== id) })) notify('评论已删除')
}

function editEvent(event) {
  error.value = ''
  editing.value = event ? { ...event } : { id: '', title: '', mode: '线下体验', location: '', description: '', time: '', deadline: '', capacity: 12, status: 'open' }
}

function saveEvent() {
  if (!adminMode.value || !editing.value) return
  const event = { ...editing.value }
  if (!event.title || !event.location || !event.description || !event.time || !event.deadline
    || !Number.isInteger(event.capacity) || event.capacity < 1) {
    error.value = '请填写所有必填信息并设置有效名额。'
    return
  }
  if (new Date(event.deadline) > new Date(event.time)) {
    error.value = '报名截止时间需早于或等于活动时间。'
    return
  }
  if (event.capacity < registrationCount(event.id)) {
    error.value = '名额不能少于当前有效报名人数。'
    return
  }
  if (updateDemo(state => {
    if (event.id) state.events = state.events.map(item => item.id === event.id ? event : item)
    else state.events.unshift({ ...event, id: newId() })
  })) {
    editing.value = null
    notify('测试活动已保存')
  }
}

function cancelEvent(event) {
  if (!adminMode.value || event.status !== 'open' || !window.confirm('取消该活动并更新有效报名状态？')) return
  if (updateDemo(state => {
    state.events.find(item => item.id === event.id).status = 'cancelled'
    for (const item of state.registrations) {
      if (item.eventId === event.id && item.status === 'active') item.status = 'event-cancelled'
    }
  })) {
    if (editing.value?.id === event.id) editing.value = null
    notify('测试活动已取消')
  }
}
</script>

<template>
  <section class="shell page narrow">
    <header class="page-heading"><p class="eyebrow">ADMIN / LOCAL PREVIEW</p><h1>管理演示</h1><p>查看待审帖子、管理测试活动和浏览现有资料。</p></header>
    <p class="demo-note">前端演示 · 管理身份、审核结果和报名名单仅用于本机流程展示。</p>
    <div v-if="!adminMode" class="empty"><h2>进入管理预览</h2><button class="btn" @click="adminMode = true">进入管理员演示</button></div>
    <template v-else>
      <div class="toolbar">
        <div class="filters" aria-label="管理模块"><button v-for="tab in tabs" :key="tab" class="chip" :aria-pressed="active === tab" @click="active = tab">{{ tab }}<template v-if="tab === tabs[0]"> · {{ pending.length }} 待审</template></button></div>
        <button class="btn secondary small" @click="adminMode = false">退出管理演示</button>
      </div>
      <template v-if="active === tabs[0]">
        <p v-if="!pending.length" class="muted">当前没有待审核帖子。</p>
        <details v-for="item in queue" :key="item.id" class="panel admin-item">
          <summary>{{ item.title }} <span class="tag">{{ postStatuses[item.status] }}</span></summary>
          <p class="muted">{{ item.type }} · {{ item.author }}<template v-if="item.reason"> · 退回原因 {{ item.reason }}</template></p>
          <p class="post-body">{{ item.body }}</p>
          <div v-if="item.images.length" class="grid two post-images"><img v-for="(src, index) in item.images" :key="index" :src="src" :alt="'待审附件 ' + (index + 1)"></div>
          <div class="form-stack">
            <label>退回原因<input v-model="reasons[item.id]" maxlength="120" placeholder="说明需要调整的地方"></label>
            <div class="actions">
              <button v-if="item.status !== 'approved'" class="btn small" @click="review(item, 'approved')">审核通过</button>
              <button class="btn secondary small" @click="review(item, 'rejected')">退回帖子</button>
            </div>
          </div>
          <div v-for="comment in demo.comments.filter(entry => entry.postId === item.id)" :key="comment.id" class="record-row">
            <span>{{ comment.author }} · {{ comment.body }}</span><button class="btn secondary small" @click="deleteComment(comment.id)">删除评论</button>
          </div>
        </details>
      </template>
      <template v-else-if="active === tabs[1]">
        <button class="btn" @click="editEvent(null)">新建测试活动</button>
        <form v-if="editing" class="panel form-stack admin-item" @submit.prevent="saveEvent">
          <h2>{{ editing.id ? '编辑测试活动' : '新建测试活动' }}</h2>
          <label>活动主题<input v-model.trim="editing.title" required maxlength="60"></label>
          <label>活动形式<select v-model="editing.mode"><option>线下体验</option><option>线上分享</option></select></label>
          <label>地点或参与方式<input v-model.trim="editing.location" required maxlength="120"></label>
          <label>活动内容<textarea v-model.trim="editing.description" required maxlength="500" rows="3"></textarea></label>
          <div class="grid two">
            <label>活动时间<input v-model="editing.time" required type="datetime-local"></label>
            <label>报名截止<input v-model="editing.deadline" required type="datetime-local"></label>
          </div>
          <label>人数上限<input v-model.number="editing.capacity" required type="number" min="1" max="10000"></label>
          <p v-if="error" class="form-error" role="alert">{{ error }}</p>
          <div class="actions"><button class="btn">保存活动</button><button type="button" class="btn secondary" @click="editing = null">关闭表单</button></div>
        </form>
        <article v-for="event in demo.events" :key="event.id" class="panel admin-item">
          <h2>{{ event.title }}</h2><p>{{ eventTime(event.time) }} · {{ eventStatus(event) }} · 有效报名 {{ registrationCount(event.id) }} / {{ event.capacity }} 人</p>
          <div class="actions">
            <button v-if="event.status === 'open'" class="btn secondary small" @click="editEvent(event)">编辑活动</button>
            <button class="btn secondary small" @click="rosterId = rosterId === event.id ? '' : event.id">{{ rosterId === event.id ? '收起名单' : '查看有效名单' }}</button>
            <button v-if="event.status === 'open'" class="btn secondary small" @click="cancelEvent(event)">取消活动</button>
          </div>
          <div v-if="rosterId === event.id" class="callout">
            <p v-if="!roster.length">当前没有有效报名。</p><ul v-else><li v-for="name in roster" :key="name">{{ name }}</li></ul>
          </div>
        </article>
      </template>
      <div v-else class="panel record-list">
        <p class="muted">当前内容来自前端样例数据。</p>
        <RouterLink class="record-row" :to="{ name: 'works' }"><strong>盘扣样式</strong><span>{{ works.length }} 款 ↗</span></RouterLink>
        <RouterLink class="record-row" :to="{ name: 'courses' }"><strong>制作步骤</strong><span>{{ courses.length }} 组 ↗</span></RouterLink>
        <RouterLink class="record-row" :to="{ name: 'quiz' }"><strong>知识题</strong><span>{{ questions.length }} 道 ↗</span></RouterLink>
      </div>
    </template>
  </section>
</template>
