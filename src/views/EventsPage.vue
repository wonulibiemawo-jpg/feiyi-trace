<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { demo, eventStatus, eventTime, notify, registrationCount, updateDemo, viewer } from '../data/demoStore'

const route = useRoute()
const event = computed(() => demo.value.events.find(item => item.id === route.params.id))
const registration = computed(() => demo.value.registrations.find(item => item.eventId === event.value?.id && item.owner === viewer.value?.id))
const registered = computed(() => registration.value?.status === 'active')
const canCancel = computed(() => event.value?.status === 'open' && Date.now() < new Date(event.value.deadline).getTime())

function register() {
  if (!event.value || !viewer.value || registered.value || eventStatus(event.value) !== '开放报名') return
  if (updateDemo(state => {
    const item = state.registrations.find(record => record.eventId === event.value.id && record.owner === viewer.value.id)
    if (item) item.status = 'active'
    else state.registrations.push({ eventId: event.value.id, owner: viewer.value.id, status: 'active' })
  })) notify('已完成模拟报名')
}

function cancel() {
  if (!event.value || !viewer.value || !registered.value || !canCancel.value
    || Date.now() >= new Date(event.value.deadline).getTime()) return
  if (updateDemo(state => {
    state.registrations.find(item => item.eventId === event.value.id && item.owner === viewer.value.id).status = 'cancelled'
  })) notify('已取消报名')
}
</script>

<template>
  <section class="shell page narrow">
    <RouterLink v-if="route.params.id" class="back" :to="{ name: 'events' }">← 体验活动</RouterLink>
    <header class="page-heading"><p class="eyebrow">05 / WORKSHOPS</p><h1>{{ event?.title || '体验活动' }}</h1><p>{{ event?.description || '查看活动形式、时间和报名信息。' }}</p></header>
    <p class="demo-note">测试数据 · 此处活动仅用于演示报名流程。</p>
    <article v-if="event" class="panel">
      <div class="toolbar"><span class="tag">{{ event.mode }}</span><span class="tag status">{{ eventStatus(event) }}</span></div>
      <dl class="definition">
        <div><dt>活动时间</dt><dd>{{ eventTime(event.time) }}</dd></div>
        <div><dt>参与方式</dt><dd>{{ event.location }}</dd></div>
        <div><dt>报名截止</dt><dd>{{ eventTime(event.deadline) }}</dd></div>
        <div><dt>报名人数</dt><dd>{{ registrationCount(event.id) }} / {{ event.capacity }} 人</dd></div>
      </dl>
      <div class="actions">
        <template v-if="registered">
          <strong>已报名</strong>
          <button class="btn secondary" :disabled="!canCancel" @click="cancel">取消报名</button>
          <small v-if="!canCancel">报名截止后无法取消。</small>
        </template>
        <template v-else-if="eventStatus(event) === '开放报名'">
          <button v-if="viewer" class="btn" @click="register">模拟报名</button>
          <RouterLink v-else class="btn" :to="{ name: 'account', query: { next: route.fullPath } }">登录后报名</RouterLink>
        </template>
        <span v-else class="muted">{{ eventStatus(event) }}</span>
      </div>
      <p v-if="registration?.status === 'cancelled'" class="muted">你的上一次报名已取消。</p>
    </article>
    <div v-else-if="route.params.id" class="empty"><h2>未找到此活动</h2></div>
    <div v-else-if="demo.events.length" class="grid two">
      <RouterLink v-for="item in demo.events" :key="item.id" class="panel listing event-card" :to="{ name: 'events', params: { id: item.id } }">
        <p class="eyebrow">{{ item.mode }} / {{ eventStatus(item) }}</p><h2>{{ item.title }}</h2><p>{{ item.description }}</p><p>{{ eventTime(item.time) }}</p><span class="text-link">活动详情 ↗</span>
      </RouterLink>
    </div>
    <div v-else class="empty"><h2>暂时没有体验活动</h2></div>
  </section>
</template>
