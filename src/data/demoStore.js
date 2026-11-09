import { computed, ref } from 'vue'
import { seedEvents, seedPosts } from './pankou'

const storageKey = 'pankou.demo.v1'
const initialState = {
  profiles: [{ id: 'visitor-demo', name: '体验学员' }],
  currentId: '', favorites: {}, progress: {}, attempts: [],
  posts: seedPosts, comments: [], events: seedEvents, registrations: [],
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || structuredClone(initialState)
  } catch {
    return structuredClone(initialState)
  }
}

export const demo = ref(loadState())
export const viewer = computed(() => demo.value.profiles.find(profile => profile.id === demo.value.currentId))
export const adminMode = ref(false)
export const notice = ref('')
let noticeTimer

export function notify(message) {
  notice.value = message
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { notice.value = '' }, 4500)
}

export function updateDemo(edit) {
  const draft = JSON.parse(JSON.stringify(demo.value))
  edit(draft)
  try {
    localStorage.setItem(storageKey, JSON.stringify(draft))
    demo.value = draft
    return true
  } catch {
    notify('浏览器无法保存本次操作。请检查存储权限，或减少上传图片。')
    return false
  }
}

export function signIn(name) {
  const cleanName = name.trim()
  if (cleanName.length < 2 || cleanName.length > 16) {
    notify('请输入 2–16 个字符的体验昵称。')
    return false
  }
  adminMode.value = false
  return updateDemo(state => {
    let profile = state.profiles.find(item => item.name === cleanName)
    if (!profile) {
      profile = { id: newId(), name: cleanName }
      state.profiles.push(profile)
    }
    state.currentId = profile.id
  })
}

export function signOut() {
  adminMode.value = false
  updateDemo(state => { state.currentId = '' })
}

export function newId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function favoritesFor(userId) {
  return demo.value.favorites[userId] || []
}

export function stepsFor(userId, courseId) {
  return demo.value.progress[userId]?.[courseId] || []
}

export function toggleFavorite(workId) {
  const userId = viewer.value?.id
  if (!userId) return
  const saved = favoritesFor(userId).includes(workId)
  if (updateDemo(state => {
    const favorites = state.favorites[userId] || []
    state.favorites[userId] = saved ? favorites.filter(id => id !== workId) : [...favorites, workId]
  })) notify(saved ? '已取消收藏' : '已加入收藏')
}

export function markViewed(courseId, index) {
  const userId = viewer.value?.id
  if (!userId || stepsFor(userId, courseId).includes(index)) return
  if (updateDemo(state => {
    const progress = state.progress[userId] ||= {}
    progress[courseId] = [...(progress[courseId] || []), index]
  })) notify('已保存浏览进度')
}

export function registrationCount(eventId) {
  return demo.value.registrations.filter(item => item.eventId === eventId && item.status === 'active').length
}

export function eventStatus(event) {
  if (event.status === 'cancelled') return '活动已取消'
  if (Date.now() >= new Date(event.deadline).getTime()) return '报名已截止'
  if (registrationCount(event.id) >= event.capacity) return '名额已满'
  return '开放报名'
}

export function eventTime(value) {
  return value?.replace('T', ' ') || ''
}
