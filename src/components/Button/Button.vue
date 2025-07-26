<script setup lang="ts">
import type { ButtonProps } from './types'
import { useClick } from './hooks/useClick'
import { computed, ref } from 'vue'
import VIcon from '@/components/Icon/Icon.vue'
const buttonRef = ref<HTMLButtonElement | null>(null)
const { ripples, ButtonClick } = useClick()

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'm',
  iconPosition: 'left',
})

const buttonClasses = computed(() => ({
  'v-button': true,
  [`v-button-type-${props.type}`]: props.type,
  [`v-button-size-${props.size}`]: props.size,
  [`v-button-shape-${props.shape}`]: props.shape,
  [`v-button-status-${props.status}`]: props.status,
  'v-button-disabled': props.disabled || props.loading,
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
  <div
    :class="containerClasses"
    :style="{ cursor: props.disabled || props.loading ? 'not-allowed' : 'auto' }"
  >
    <button ref="buttonRef" :class="buttonClasses" :disabled="props.disabled" @click="ButtonClick">
      <VIcon v-if="props.loading && props.iconPosition === 'left'" icon="spinner" spin />
      <VIcon
        v-if="!props.loading && props.icon && props.iconPosition === 'left'"
        :icon="props.icon"
      />
      <slot>Button</slot>
      <VIcon v-if="props.loading && props.iconPosition === 'right'" icon="spinner" spin />
      <VIcon
        v-if="!props.loading && props.icon && props.iconPosition === 'right'"
        :icon="props.icon"
      />
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
