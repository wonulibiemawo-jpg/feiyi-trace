<script setup>
import KnotArt from './KnotArt.vue'

defineProps({ work: { type: Object, required: true } })
</script>

<template>
  <RouterLink class="work-card" :to="{ name: 'detail', params: { id: work.id } }">
    <div class="art-panel" :class="'palette-' + work.art % 3">
      <KnotArt :design="work.art" :label="work.name + '示意图'" />
      <span class="art-index">FIG. {{ String(work.art + 1).padStart(2, '0') }}</span>
    </div>
    <div class="card-copy">
      <span class="tag">{{ work.category }}</span>
      <h3>{{ work.name }} <span aria-hidden="true">↗</span></h3>
      <p>{{ work.feature }}</p>
    </div>
  </RouterLink>
</template>
