<script setup lang="ts">
import type { VThemeToggleProps } from './types'

const props = withDefaults(defineProps<VThemeToggleProps>(), {})
const toggleTheme = () => {
  if (props.onToggle) {
    props.onToggle()
  }
}
defineOptions({
  name: 'VThemeToggle',
})
</script>

<template>
  <button class="VThemeToggle" @click="toggleTheme">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
