<script setup lang="ts">
import type { ButtonProps } from './types'
import { useClick } from './hooks/useClick'
import { computed, ref } from 'vue'

const buttonRef = ref<HTMLButtonElement | null>(null)
const { ripples, ButtonClick } = useClick()

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'm',
})

const buttonClasses = computed(() => ({
  'v-button': true,
  [`v-button-type-${props.type}`]: props.type,
  [`v-button-size-${props.size}`]: props.size,
  [`v-button-shape-${props.shape}`]: props.shape,
  [`v-button-status-${props.status}`]: props.status,
  'v-button-disabled': props.disabled,
  'v-button-long': props.long,
}))

const containerClasses = computed(() => ({
  ButtonContainer: true,
  'ButtonContainer-long': props.long,
}))

const rippleBgClass = computed(() => {
  const status =
    props.status || (props.type === 'secondary' || props.type === 'outline' ? 'default' : 'primary')
  return `button-bg-${status}`
})

const buttonStyle = computed(() =>
  buttonRef.value ? { borderRadius: getComputedStyle(buttonRef.value).borderRadius } : {},
)

defineOptions({
  name: 'VButton',
})
defineExpose({
  ref: buttonRef,
})
</script>

<template>
  <div :class="containerClasses">
    <button
      ref="buttonRef"
      :class="buttonClasses"
      :disabled="props.disabled"
      @click.stop="ButtonClick"
    >
      <slot>Button</slot>
    </button>
    <div
      v-for="ripple in ripples"
      :key="ripple"
      class="button-bg"
      :class="rippleBgClass"
      :style="buttonStyle"
    />
  </div>
</template>

<style scoped lang="scss">
@import './style.css';
</style>
