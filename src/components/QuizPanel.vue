<template>
  <div class="quiz-wrapper">
    <!-- 触发按钮 -->
    <button class="quiz-toggle-btn" @click="togglePanel" title="非遗知识挑战">
      <span class="quiz-icon">🏆</span>
      <span class="quiz-label">挑战</span>
    </button>

    <!-- 问答面板 -->
    <Transition name="panel">
      <div v-if="isOpen" class="quiz-panel">
        <div class="quiz-panel-header">
          <h4>非遗知识挑战</h4>
          <button class="quiz-close-btn" @click="isOpen = false">✕</button>
        </div>

        <!-- 开始页 -->
        <div v-if="!started && !finished" class="quiz-start">
          <p class="quiz-intro">测测你对中国非遗了解多少？</p>
          <p class="quiz-info">共 {{ questions.length }} 题 · 每题 20 分</p>
          <button class="quiz-action-btn" @click="startQuiz">开始挑战 💪</button>
        </div>

        <!-- 答题中 -->
        <div v-else-if="started && !finished" class="quiz-body">
          <div class="quiz-progress">
            第 {{ currentIndex + 1 }} / {{ questions.length }} 题
          </div>
          <p class="quiz-question">{{ questions[currentIndex].question }}</p>
          <div class="quiz-options">
            <button
              v-for="(opt, i) in questions[currentIndex].options"
              :key="i"
              :class="['quiz-option', {
                'quiz-option--correct': answered && i === questions[currentIndex].answer,
                'quiz-option--wrong': answered && selected === i && i !== questions[currentIndex].answer
              }]"
              :disabled="answered"
              @click="selectAnswer(i)"
            >
              <span class="option-letter">{{ 'ABCD'[i] }}</span>
              {{ opt }}
            </button>
          </div>
          <button v-if="answered" class="quiz-action-btn" @click="nextQuestion">
            {{ currentIndex < questions.length - 1 ? '下一题 →' : '查看成绩 🎉' }}
          </button>
        </div>

        <!-- 结果页 -->
        <div v-else class="quiz-result">
          <div class="result-emoji">{{ score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚' }}</div>
          <p class="result-score">{{ score }} 分</p>
          <p class="result-comment">{{ resultComment }}</p>
          <div class="result-detail">
            答对 {{ correctCount }} / {{ questions.length }} 题
          </div>
          <button class="quiz-action-btn" @click="restartQuiz">再来一次 🔄</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const started = ref(false)
const finished = ref(false)
const currentIndex = ref(0)
const selected = ref(-1)
const answered = ref(false)
const correctCount = ref(0)
const score = ref(0)

// 题库（基于 heritage.js 的数据）
const questions = [
  {
    question: '以下哪个非遗项目被称为"国粹"和"东方歌剧"？',
    options: ['昆曲', '京剧', '黄梅戏', '秦腔'],
    answer: 1
  },
  {
    question: '景德镇瓷器以什么特点闻名于世？',
    options: ['金碧辉煌', '古朴厚重', '白如玉明如镜薄如纸声如磬', '色彩斑斓'],
    answer: 2
  },
  {
    question: '哪个非遗项目在2001年被联合国列为首批"人类口述和非物质遗产代表作"？',
    options: ['京剧', '中国剪纸', '昆曲', '太极拳'],
    answer: 2
  },
  {
    question: '蜀绣的发源地是哪里？',
    options: ['江苏苏州', '湖南长沙', '广东广州', '四川成都'],
    answer: 3
  },
  {
    question: '太极拳的发源地是哪里？',
    options: ['湖北武当山', '河南温县陈家沟', '福建少林寺', '四川峨眉山'],
    answer: 1
  }
]

const resultComment = ref('')

function togglePanel() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) resetState()
}

function resetState() {
  started.value = false
  finished.value = false
  currentIndex.value = 0
  selected.value = -1
  answered.value = false
  correctCount.value = 0
  score.value = 0
}

function startQuiz() {
  resetState()
  started.value = true
}

function selectAnswer(i) {
  if (answered.value) return
  selected.value = i
  answered.value = true
  if (i === questions[currentIndex.value].answer) {
    correctCount.value++
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
    selected.value = -1
    answered.value = false
  } else {
    finishQuiz()
  }
}

function finishQuiz() {
  finished.value = true
  started.value = false
  score.value = Math.round((correctCount.value / questions.length) * 100)

  if (score.value >= 80) {
    resultComment.value = '不愧是文化传承人！你对非遗的了解相当深厚！🏮'
  } else if (score.value >= 60) {
    resultComment.value = '还不错！继续探索非遗的世界吧～📖'
  } else {
    resultComment.value = '多逛逛这个网站，你会有新发现的！🌟'
  }
}

function restartQuiz() {
  resetState()
  startQuiz()
}
</script>

<style scoped>
/* --- 浮动按钮 --- */
.quiz-wrapper {
  position: fixed;
  bottom: 24px;
  right: 160px;  /* AI 按钮右边，留出间距 */
  z-index: 200;
}

.quiz-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: #fff;
  padding: 12px 20px;
  border-radius: 28px;
  font-size: var(--font-base);
  font-weight: bold;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s, box-shadow 0.2s;
}

.quiz-toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.quiz-icon { font-size: 24px; }

/* --- 面板 --- */
.quiz-panel {
  position: absolute;
  bottom: 60px;
  right: -140px;
  width: 360px;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.quiz-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-primary);
  color: #fff;
}

.quiz-panel-header h4 {
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--font-base);
}

.quiz-close-btn {
  background: none;
  color: #fff;
  font-size: 18px;
  padding: 2px 6px;
}

/* --- 开始页 --- */
.quiz-start {
  padding: 32px 24px;
  text-align: center;
}

.quiz-intro {
  font-size: var(--font-lg);
  color: var(--color-primary-dark);
  font-weight: bold;
  margin-bottom: 8px;
}

.quiz-info {
  font-size: var(--font-sm);
  color: var(--color-text-muted);
  margin-bottom: 24px;
}

/* --- 答题区 --- */
.quiz-body {
  padding: 24px;
}

.quiz-progress {
  font-size: var(--font-xs);
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.quiz-question {
  font-size: var(--font-base);
  color: var(--color-text);
  font-weight: bold;
  line-height: 1.6;
  margin-bottom: 20px;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  text-align: left;
  transition: border-color 0.2s, background 0.2s;
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.quiz-option--correct {
  border-color: #22c55e !important;
  background: #f0fdf4 !important;
  color: #166534;
}

.quiz-option--wrong {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
  color: #991b1b;
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: bold;
  font-size: var(--font-xs);
  flex-shrink: 0;
}

.quiz-action-btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--font-base);
  font-weight: bold;
  transition: background 0.2s;
}

.quiz-action-btn:hover {
  background: var(--color-primary-dark);
}

/* --- 结果页 --- */
.quiz-result {
  padding: 32px 24px;
  text-align: center;
}

.result-emoji { font-size: 56px; margin-bottom: 8px; }

.result-score {
  font-family: var(--font-serif);
  font-size: var(--font-3xl);
  font-weight: bold;
  color: var(--color-accent);
}

.result-comment {
  font-size: var(--font-sm);
  color: var(--color-text-light);
  margin: 12px 0;
}

.result-detail {
  font-size: var(--font-xs);
  color: var(--color-text-muted);
  margin-bottom: 8px;
}

/* --- 弹入动画（复用 AI 面板的动画风格） --- */
.panel-enter-active {
  animation: panel-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.panel-leave-active {
  animation: panel-out 0.2s ease-in;
}
@keyframes panel-in {
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes panel-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(10px) scale(0.95); }
}
</style>
