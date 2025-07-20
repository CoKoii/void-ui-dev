<script setup lang="ts">
import type { CollapseProps } from './types'
const props = withDefaults(defineProps<CollapseProps>(), {})
const active = defineModel<boolean>('active', { default: false })
const toggle = () => {
  if (!props.disabled) {
    active.value = !active.value
  }
}
const onEnter = (el: Element) => {
  ;(el as HTMLElement).style.height = `${el.scrollHeight}px`
}
const onAfterEnter = (el: Element) => {
  ;(el as HTMLElement).style.height = 'auto'
}
const onBeforeLeave = (el: Element) => {
  ;(el as HTMLElement).style.height = `${el.scrollHeight}px`
}
const onLeave = (el: Element) => {
  ;(el as HTMLElement).style.height = '0px'
}
</script>

<template>
  <div class="v-collapse" :id="props.title" :class="{ 'is-disabled': props.disabled }">
    <div
      class="v-collapse__header"
      role="button"
      :aria-disabled="props.disabled"
      :aria-expanded="active"
      tabindex="0"
      @click="toggle"
      :style="{
        borderBottom: active ? '1px solid var(--border-color-1)' : '1px solid transparent',
      }"
    >
      <div class="v-collapse__header__left">
        <slot name="icon">→</slot>
        <div>{{ props.title }}</div>
      </div>
      <div class="v-collapse__header__right">
        <slot name="right"></slot>
      </div>
    </div>
    <Transition
      name="collapse"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
    >
      <div v-show="active" class="v-collapse__content" :aria-hidden="!active">
        <div class="container">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
