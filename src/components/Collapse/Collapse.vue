<script setup lang="ts">
import { ref } from 'vue'
import type { CollapseProps } from './types'
import VIcon from '@/components/Icon/Icon.vue'
const props = withDefaults(defineProps<CollapseProps>(), {})
const active = defineModel<boolean>('active', { default: false })
const showBorder = ref(active.value)

const toggle = () => {
  if (!props.disabled) {
    active.value = !active.value
  }
}

const onEnter = (el: Element) => {
  showBorder.value = true
  const element = el as HTMLElement
  element.style.height = '0px'
  element.style.opacity = '0'
  element.style.height = `${el.scrollHeight}px`
  element.style.opacity = '1'
}
const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}
const onBeforeLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = `${el.scrollHeight}px`
}
const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0px'
  element.style.opacity = '0'
}
const onAfterLeave = () => {
  showBorder.value = false
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
        borderBottom: showBorder ? '1px solid var(--border-color-1)' : '1px solid transparent',
      }"
    >
      <div class="v-collapse__header__left">
        <slot name="icon">
          <VIcon
            :icon="props.icon ? props.icon : 'angle-right'"
            :rotation="active ? 90 : undefined"
          />
        </slot>
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
      @after-leave="onAfterLeave"
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
