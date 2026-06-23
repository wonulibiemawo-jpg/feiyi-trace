<template>
  <div id="app-layout">
    <!-- 顶部导航栏 -->
    <NavBar />

    <!-- 主内容区域：根据当前路由显示不同页面 -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <!-- AI 问答面板（浮动在右下角） -->
    <AiChatPanel />
    <!-- 非遗知识问答面板 -->
    <QuizPanel />
  </div>
</template>

<script setup>
// App.vue 是根组件，负责整体布局
// 三块结构：顶部导航 + 中间内容（路由切换） + 右下AI问答
import NavBar from './components/NavBar.vue'
import AiChatPanel from './components/AiChatPanel.vue'
import QuizPanel from './components/QuizPanel.vue'
</script>

<style scoped>
#app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.main-content {
  flex: 1;                     /* 撑满剩余空间 */
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

/* --- 页面切换过渡动画 --- */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* 进入前：透明 + 下移 20px */
.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* 离开后：透明 + 上移 20px */
.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
