<script setup lang="ts">
import type { ButtonProps } from './types'
import { useClick } from './hooks/useClick'
const { ripples, ButtonClick } = useClick()
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'm',
})
defineOptions({
  name: 'VButton',
})
</script>

<template>
  <div class="ButtonContainer">
    <button
      class="v-button"
      @click="ButtonClick"
      :class="{
        [`v-button-type-${props.type}`]: props.type,
        [`v-button-shape-${props.shape}`]: props.shape,
        [`v-button-status-${props.status}`]: props.status,
        [`v-button-size-${props.size}`]: props.size,
        'v-button-disabled': props.disabled,
        'v-button-long': props.long,
      }"
      :disabled="props.disabled"
    >
      <slot>Button</slot>
    </button>
    <div class="button-bg" v-for="ripple in ripples" :key="ripple.id"></div>
  </div>
</template>

<style scoped lang="scss">
@import './style.css';
</style>
