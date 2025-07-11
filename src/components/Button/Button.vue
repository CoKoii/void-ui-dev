<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ButtonProps } from './types'
const _ref = ref<HTMLButtonElement>()
const ripples = ref<{ id: number }[]>([])
let id = 0
const ButtonClick = () => {
  const rippleId = id++
  ripples.value.push({ id: rippleId })
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== rippleId)
  }, 400)
}
const computedColor = computed(() => {
  if (props.color) return props.color
  switch (props.type) {
    case 'primary':
      return 'var(--blue-6)'
    case 'success':
      return 'var(--green-6)'
    case 'warning':
      return 'var(--orange-6)'
    case 'danger':
      return 'var(--red-6)'
    default:
      return 'var(--blue-6)'
  }
})
const props = withDefaults(defineProps<ButtonProps>(), {
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
    :style="{
      backgroundColor: `color-mix(in srgb, ${computedColor} 95%, black)`,
      boxShadow: `color-mix(in srgb, ${computedColor} 10%, transparent) 0px 2px 0px 0px`,
    }"
  >
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="v-button-bg"
      :style="{
        backgroundColor: `color-mix(in srgb, ${computedColor} 40%, transparent)`,
      }"
    ></span>
    <slot></slot>
  </button>
</template>

<style scoped>
@import './style.css';
</style>
