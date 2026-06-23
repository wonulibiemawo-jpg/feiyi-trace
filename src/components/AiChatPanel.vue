<template>
  <!-- AI 问答浮动按钮（右下角） -->
  <div class="ai-chat-wrapper">
    <!-- 触发按钮：点击打开/关闭面板 -->
    <button class="ai-toggle-btn" @click="togglePanel" :title="isOpen ? '关闭AI问答' : '打开AI问答'">
      <span class="ai-icon">🤖</span>
      <span class="ai-label">AI 讲解</span>
    </button>

    <!-- 对话面板：展开时显示，带弹性动画 -->
    <Transition name="panel">
      <div v-if="isOpen" class="ai-panel">
        <!-- 面板头部 -->
        <div class="ai-panel-header">
          <h4>AI 非遗讲解助手</h4>
          <button class="ai-close-btn" @click="isOpen = false">✕</button>
        </div>

        <!-- 对话内容区 -->
        <div class="ai-messages" ref="messageContainer">
          <!-- AI 欢迎语 -->
          <div class="ai-message ai-message--bot">
            你好！我是非遗文化讲解助手。你可以问我任何关于中国非物质文化遗产的问题，比如"京剧有什么特点？"、"景泰蓝是怎么制作的？"
          </div>

          <!-- 用户消息和AI回复列表 -->
          <TransitionGroup name="msg">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['ai-message', msg.role === 'user' ? 'ai-message--user' : 'ai-message--bot']"
            >
              {{ msg.content }}
            </div>
          </TransitionGroup>

          <!-- 加载中状态 -->
          <div v-if="isLoading" class="ai-message ai-message--bot ai-loading">
            正在思考中<span class="dots">...</span>
          </div>
        </div>

        <!-- 输入区 -->
        <div class="ai-input-area">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="输入你想了解的非遗知识..."
            class="ai-input"
            :disabled="isLoading"
          />
          <button
            @click="sendMessage"
            class="ai-send-btn"
            :disabled="isLoading || !userInput.trim()"
          >
            发送
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'

// --- 状态管理 ---
const isOpen = ref(false)         // 面板是否打开
const userInput = ref('')         // 用户输入内容
const messages = ref([])          // 对话历史
const isLoading = ref(false)      // 是否正在等待回复
const messageContainer = ref(null) // 对话区域DOM引用

// --- API 配置 ---
// 使用火山引擎豆包 API（OpenAI 兼容接口）
// 通过 Vite 环境变量配置，避免 Key 出现在源码仓库中
// ⚠️ 注意：前端静态部署时 Key 仍会打包进 JS 文件，浏览器可见
//    正式项目请使用后端代理调用 AI API
const API_KEY = import.meta.env.VITE_API_KEY || ''  // 从 .env 文件读取
const API_URL = import.meta.env.VITE_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'

// --- 方法 ---

// 切换面板开/关
function togglePanel() {
  isOpen.value = !isOpen.value
}

// 发送消息
async function sendMessage() {
  const text = userInput.value.trim()
  if (!text || isLoading.value) return

  // 1. 添加用户消息到对话列表
  messages.value.push({ role: 'user', content: text })
  userInput.value = ''          // 清空输入框
  isLoading.value = true        // 显示加载状态

  // 2. 自动滚动到底部
  await nextTick()
  scrollToBottom()

  try {
    // 3. 调用 AI API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-seed-2-0-pro-260215',   // 豆包对话模型
        messages: [
          {
            role: 'system',
            content: '你是一个中国非物质文化遗产专家。请用通俗易懂、生动有趣的方式回答用户关于中国非遗的问题。每次回答控制在200字以内，适合普通大众理解。如果用户问的内容和非遗无关，请礼貌地把话题引导回非遗领域。'
          },
          ...messages.value.map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7,      // 控制回答的创造性（0=保守，1=天马行空）
        max_tokens: 500        // 限制回答长度
      })
    })

    // 4. 处理 API 返回数据
    const data = await response.json()

    if (data.choices && data.choices.length > 0) {
      messages.value.push({
        role: 'assistant',
        content: data.choices[0].message.content
      })
    } else {
      messages.value.push({
        role: 'assistant',
        content: '抱歉，我暂时无法回答这个问题，请稍后再试。'
      })
    }
  } catch (error) {
    // 网络错误处理
    messages.value.push({
      role: 'assistant',
      content: '网络请求失败，请检查网络连接后重试。如果这是你的第一个项目，别担心——这说明你还没配置真实的API Key。先去 deepseek.com 注册获取免费 Key，替换代码中的 sk-your-api-key-here 即可。'
    })
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}

// 滚动对话区域到底部
function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}
</script>

<style scoped>
/* --- 浮动按钮 --- */
.ai-chat-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
}

.ai-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-accent);
  color: #fff;
  padding: 12px 20px;
  border-radius: 28px;
  font-size: var(--font-base);
  font-weight: bold;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s, box-shadow 0.2s;
}

.ai-toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.ai-icon {
  font-size: 24px;
}

/* --- 对话面板 --- */
.ai-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 380px;
  height: 500px;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-primary);
  color: #fff;
}

.ai-panel-header h4 {
  color: #fff;
  font-family: var(--font-sans);
  font-size: var(--font-base);
}

.ai-close-btn {
  background: none;
  color: #fff;
  font-size: 18px;
  padding: 2px 6px;
}

/* --- 对话消息区 --- */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  line-height: 1.6;
  word-break: break-word;
}

.ai-message--bot {
  background: var(--color-bg);
  align-self: flex-start;
  border-bottom-left-radius: 2px;
}

.ai-message--user {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  align-self: flex-end;
  border-bottom-right-radius: 2px;
}

.ai-loading {
  opacity: 0.7;
}

.dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
}

/* --- 输入区 --- */
.ai-input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
}

.ai-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: var(--font-sm);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.2s;
}

.ai-input:focus {
  border-color: var(--color-primary);
}

.ai-send-btn {
  padding: 10px 20px;
  background: var(--color-accent);
  color: #fff;
  border-radius: 20px;
  font-size: var(--font-sm);
  font-weight: bold;
  transition: background 0.2s;
}

.ai-send-btn:hover:not(:disabled) {
  background: #a01830;
}

.ai-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* --- 面板弹入 / 弹出动画 --- */
.panel-enter-active {
  animation: panel-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);  /* 弹性缓动 */
}

.panel-leave-active {
  animation: panel-out 0.2s ease-in;
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes panel-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
}

/* --- 消息气泡入场动画 --- */
.msg-enter-active {
  animation: msg-in 0.35s ease-out;
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
