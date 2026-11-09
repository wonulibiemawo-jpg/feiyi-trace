<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { courses, questions } from '../data/pankou'
import { demo, newId, updateDemo, viewer } from '../data/demoStore'

const route = useRoute()
const router = useRouter()
const answers = ref({})
const index = ref(0)
const error = ref('')
const submitting = ref(false)
const isResult = computed(() => route.name === 'result')
const ownAttempts = computed(() => demo.value.attempts.filter(item => item.owner === viewer.value?.id))
const attempt = computed(() => ownAttempts.value.find(item => item.id === route.params.id))
const previous = computed(() => ownAttempts.value.find(item => item.id === route.query.retry))
const course = computed(() => courses.find(item => item.id === route.query.course))
const selectedQuestions = computed(() => {
  if (route.query.retry) return questions.filter(question => previous.value?.wrong.includes(question.id))
  return course.value ? questions.filter(question => question.course === course.value.id) : questions
})
const current = computed(() => selectedQuestions.value[index.value])
const wrongQuestions = computed(() => questions.filter(question => attempt.value?.wrong.includes(question.id)))

watch(() => route.fullPath, () => {
  answers.value = {}
  index.value = 0
  error.value = ''
}, { immediate: true })

async function submit() {
  if (!viewer.value || submitting.value) return
  const missing = selectedQuestions.value.findIndex(question => answers.value[question.id] === undefined)
  if (missing >= 0) {
    index.value = missing
    error.value = '请完成所有题目后再提交。'
    return
  }
  submitting.value = true
  const id = newId()
  const wrong = selectedQuestions.value.filter(question => answers.value[question.id] !== question.answer).map(question => question.id)
  try {
    if (updateDemo(state => {
      state.attempts.unshift({
        id, owner: viewer.value.id, title: previous.value ? '错题重答' : course.value?.name || '盘扣综合练习',
        date: new Date().toISOString(), total: selectedQuestions.value.length, wrong, answers: { ...answers.value },
      })
    })) await router.push({ name: 'result', params: { id } })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="shell page narrow">
    <RouterLink v-if="isResult" class="back" :to="{ name: 'quiz' }">← 知识答题</RouterLink>
    <header class="page-heading">
      <h1>{{ isResult ? '答题结果与错题回顾' : course?.name || (route.query.retry ? '错题重答' : '知识答题') }}</h1>
      <p>{{ isResult ? '查看得分、错题解析和对应学习资料。' : '用几道题检查对盘扣样式、材料与操作顺序的理解。' }}</p>
    </header>
    <div v-if="!viewer" class="empty">
      <h2>登录体验账户后继续</h2><p>答题与错题记录会保存在当前浏览器。</p>
      <RouterLink class="btn" :to="{ name: 'account', query: { next: route.fullPath } }">前往个人中心</RouterLink>
    </div>
    <template v-else-if="isResult">
      <template v-if="attempt">
        <div class="panel score">
          <div><p class="eyebrow">{{ attempt.title }}</p><strong>{{ Math.round((attempt.total - attempt.wrong.length) / attempt.total * 100) }}</strong> 分</div>
          <div><p>答对 {{ attempt.total - attempt.wrong.length }} / {{ attempt.total }} 题</p>
            <RouterLink v-if="wrongQuestions.length" class="btn" :to="{ name: 'quiz', query: { retry: attempt.id } }">重答本次错题</RouterLink>
            <p v-else>本次练习全部答对。</p>
          </div>
        </div>
        <article v-for="question in wrongQuestions" :key="question.id" class="panel result-item">
          <h2>{{ question.prompt }}</h2>
          <p>你的选择：{{ question.options[attempt.answers[question.id]] }}</p>
          <p><strong>正确答案：{{ question.options[question.answer] }}</strong></p>
          <p>{{ question.explanation }}</p>
          <RouterLink class="text-link" :to="{ name: 'courses', params: { id: question.course } }">回到关联步骤 ↗</RouterLink>
        </article>
      </template>
      <div v-else class="empty"><h2>没有找到这次答题记录</h2><RouterLink class="text-link" :to="{ name: 'account' }">查看自己的答题记录</RouterLink></div>
    </template>
    <template v-else-if="current">
      <div v-if="!route.query.retry" class="filters quiz-filters" aria-label="答题范围">
        <RouterLink class="chip" :class="{ selected: !course }" :to="{ name: 'quiz' }">综合练习</RouterLink>
        <RouterLink v-for="item in courses" :key="item.id" class="chip" :class="{ selected: course?.id === item.id }" :to="{ name: 'quiz', query: { course: item.id } }">{{ item.name }}</RouterLink>
      </div>
      <form class="panel quiz-form" @submit.prevent="submit">
        <div class="toolbar"><p class="eyebrow">第 {{ index + 1 }} / {{ selectedQuestions.length }} 题</p><p>已答 {{ Object.keys(answers).length }} 题</p></div>
        <progress :value="Object.keys(answers).length" :max="selectedQuestions.length" aria-label="已答题数"></progress>
        <fieldset :key="current.id">
          <legend>{{ current.prompt }}</legend>
          <label v-for="(option, choice) in current.options" :key="option" class="option">
            <input v-model="answers[current.id]" type="radio" :name="'question-' + current.id" :value="choice" @change="error = ''">{{ option }}
          </label>
        </fieldset>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <div class="actions">
          <button type="button" class="btn secondary" :disabled="index === 0" @click="index--">上一题</button>
          <button v-if="index < selectedQuestions.length - 1" type="button" class="btn" @click="index++">下一题</button>
          <button v-else class="btn" :disabled="submitting">提交答卷</button>
        </div>
      </form>
    </template>
    <div v-else class="empty"><h2>没有可重答的错题</h2><RouterLink class="text-link" :to="{ name: 'quiz' }">返回综合练习</RouterLink></div>
  </section>
</template>
