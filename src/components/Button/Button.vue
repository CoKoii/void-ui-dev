<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
const _ref = ref<HTMLButtonElement>()
const active = ref(false)
const ButtonClick = () => {
  active.value = true
  setTimeout(() => {
    active.value = false
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
    <span
      class="v-button-bg"
      :style="{
        transform: active ? 'scale(1.15,1.35)' : 'scale(1)',
        opacity: active ? 0 : 1,
        visibility: active ? 'visible' : 'hidden',
      }"
    ></span>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
@import './style.css';
</style>
