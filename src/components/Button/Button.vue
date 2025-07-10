<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
const _ref = ref<HTMLButtonElement>()
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})
defineOptions({
  name: 'VButton',
})
defineExpose({
  ref: _ref,
})
</script>

<template>
  <button
    ref="_ref"
    class="v-button"
    :class="{
      [`v-button--${type}`]: type,
      [`v-button--${size}`]: size,
      'is-plain': plain,
      'is-circle': circle,
      'is-round': round,
      'is-disabled': disabled,
    }"
    :disabled="disabled"
    :type="nativeType"
    :autofocus="autofocus"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
@import './style.css';
</style>
