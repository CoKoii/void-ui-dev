<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonProps } from './types'
import { useColorHook } from './hooks/useColor'
import { useClick } from './hooks/useClick'

const props = withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button',
})

const { ripples, ButtonClick } = useClick()

const computedColor = useColorHook(props)

const _ref = ref<HTMLButtonElement>()

defineOptions({
  name: 'VButton',
})

defineExpose({
  ref: _ref,
})
</script>

<template>
  <div class="v-button-container">
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
        backgroundColor: type ? `color-mix(in srgb, ${computedColor} 95%, black)` : 'var(--gray-1)',
        boxShadow: type
          ? `color-mix(in srgb, ${computedColor} 10%, transparent) 0px 2px 0px 0px`
          : `color-mix(in srgb, currentColor 3%, transparent) 0px 2px 0px 0px`,
        color: type
          ? 'var(--text-color-light)'
          : `color-mix(in srgb, ${computedColor} 70%, transparent)`,
        borderColor: type
          ? `color-mix(in srgb, ${computedColor} 50%, transparent)`
          : 'currentColor',
      }"
    >
      <slot></slot>
    </button>
    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="v-button-bg"
      :style="{
        backgroundColor: type
          ? `color-mix(in srgb, ${computedColor} 40%, transparent)`
          : `color-mix(in srgb, ${computedColor || 'var(--gray-6)'} 20%, transparent)`,
      }"
    ></span>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
