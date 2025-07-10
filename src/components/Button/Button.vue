<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
const _ref = ref<HTMLButtonElement>()
const ripples = ref<{ id: number }[]>([])
let id = 0
const ButtonClick = () => {
  const rippleId = id++
  ripples.value.push({ id: rippleId })
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== rippleId)
  }, 500)
}

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
    @click="ButtonClick"
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
    <span v-for="ripple in ripples" :key="ripple.id" class="v-button-bg"></span>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
@import './style.css';
</style>
