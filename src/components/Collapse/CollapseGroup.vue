<script setup lang="ts">
import type { CollapseGroupProps } from './types'

const props = withDefaults(defineProps<CollapseGroupProps>(), {
  border: true,
})
defineOptions({
  name: 'VCollapseGroup',
})
</script>

<template>
  <div
    class="v-collapse-group"
    :style="{ border: props.border ? '1px solid var(--border-color-1)' : 'none' }"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
