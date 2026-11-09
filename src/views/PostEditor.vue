<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postTypes } from '../data/pankou'
import { demo, newId, notify, updateDemo, viewer } from '../data/demoStore'

const route = useRoute()
const router = useRouter()
const existing = computed(() => demo.value.posts.find(item => item.id === route.params.id && item.owner === viewer.value?.id))
const type = ref(postTypes[0])
const title = ref('')
const body = ref('')
const images = ref([])
const error = ref('')
const reading = ref(false)
const submitting = ref(false)

watch([() => route.params.id, () => viewer.value?.id], () => {
  type.value = existing.value?.type || postTypes[0]
  title.value = existing.value?.title || ''
  body.value = existing.value?.body || ''
  images.value = [...(existing.value?.images || [])]
  error.value = ''
}, { immediate: true })

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function pickImages(event) {
  const files = [...event.target.files]
  event.target.value = ''
  if (!files.length) return
  error.value = ''
  if (images.value.length + files.length > 2) {
    error.value = '每篇帖子最多添加 2 张图片。'
    return
  }
  if (files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 350 * 1024)) {
    error.value = '请选择 JPG、PNG 或 WebP 图片，每张不超过 350 KB。'
    return
  }
  reading.value = true
  try {
    images.value.push(...await Promise.all(files.map(readImage)))
  } catch {
    error.value = '图片读取失败，请重新选择。'
  } finally {
    reading.value = false
  }
}

async function save() {
  if (!viewer.value || (route.params.id && !existing.value) || reading.value || submitting.value) return
  if (title.value.length < 4 || body.value.length < 10) {
    error.value = '标题至少 4 字，正文至少 10 字。'
    return
  }
  submitting.value = true
  const post = {
    id: existing.value?.id || newId(), owner: viewer.value.id, author: viewer.value.name, type: type.value,
    title: title.value, body: body.value, images: [...images.value], status: 'pending', reason: '',
    date: new Date().toLocaleDateString('zh-CN'),
  }
  try {
    if (updateDemo(state => {
      const index = state.posts.findIndex(item => item.id === post.id)
      if (index < 0) state.posts.unshift(post)
      else state.posts[index] = post
    })) {
      notify('帖子已提交，审核通过后将公开展示')
      await router.push({ name: 'post', params: { id: post.id } })
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="shell page narrow">
    <RouterLink class="back" :to="{ name: 'community' }">← 作品交流</RouterLink>
    <header class="page-heading"><h1>{{ route.params.id ? '编辑帖子' : '发布帖子' }}</h1><p>帖子审核通过后会出现在交流列表。</p></header>
    <div v-if="!viewer" class="empty"><h2>登录体验账户后发帖</h2><RouterLink class="btn" :to="{ name: 'account', query: { next: route.fullPath } }">前往个人中心</RouterLink></div>
    <div v-else-if="route.params.id && !existing" class="empty"><h2>找不到可编辑的帖子</h2><RouterLink class="text-link" :to="{ name: 'account' }">查看个人中心 ↗</RouterLink></div>
    <form v-else class="panel form-stack" @submit.prevent="save">
      <label>帖子类型<select v-model="type"><option v-for="item in postTypes" :key="item">{{ item }}</option></select></label>
      <label>标题<input v-model.trim="title" required minlength="4" maxlength="60" placeholder="给作品或问题起个标题"></label>
      <label>正文<textarea v-model.trim="body" required minlength="10" maxlength="1500" rows="6" placeholder="写下制作过程、用到的材料或遇到的问题"></textarea></label>
      <label>添加图片（可选）<input type="file" accept="image/jpeg,image/png,image/webp" multiple :disabled="reading || images.length >= 2" @change="pickImages"></label>
      <p class="muted">最多 2 张 JPG、PNG 或 WebP 图片，每张不超过 350 KB。图片只保存在本机浏览器。</p>
      <div v-if="images.length" class="grid two post-images">
        <figure v-for="(src, index) in images" :key="index"><img :src="src" :alt="'待提交图片 ' + (index + 1)"><button type="button" class="text-link" @click="images.splice(index, 1)">移除图片 {{ index + 1 }}</button></figure>
      </div>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <div><button class="btn" :disabled="reading || submitting">{{ reading ? '正在读取图片…' : '提交审核' }}</button></div>
    </form>
  </section>
</template>
