<script setup lang="ts">
import type { ButtonProps } from './types'
defineProps<ButtonProps>()
defineOptions({
  name: 'VButton',
})
</script>

<template>
  <button
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
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
