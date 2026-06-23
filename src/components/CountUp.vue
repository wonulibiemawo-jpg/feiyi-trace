<template>
  <span ref="el" class="count-up">{{ displayValue }}{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  target: { type: Number, required: true },     // 目标数字
  suffix: { type: String, default: '' },         // 后缀（如 "+"、" 项"）
  duration: { type: Number, default: 1500 },     // 动画时长（ms）
})

const el = ref(null)
const displayValue = ref(0)
let observer = null

onMounted(() => {
  // 视口交叉检测：滚动到可见区域才触发动画
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate()
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.3 })

  if (el.value) observer.observe(el.value)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function animate() {
  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / props.duration, 1)
    // easeOutCubic：先快后慢
    const eased = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(eased * props.target)

    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }

  requestAnimationFrame(tick)
}
</script>

<style scoped>
.count-up {
  font-family: var(--font-serif);
  font-size: var(--font-2xl);
  font-weight: bold;
  color: var(--color-accent);
  display: inline-block;
}
</style>
