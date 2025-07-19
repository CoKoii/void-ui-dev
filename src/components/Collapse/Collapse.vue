<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CollapseProps } from './types'

const props = withDefaults(defineProps<CollapseProps>(), {})
const active = defineModel<boolean>('active', { default: false })
const collapseContentRef = ref<HTMLDivElement | null>(null)
const isAnimating = ref(false)

onMounted(() => {
  const el = collapseContentRef.value
  if (el) {
    el.style.height = active.value ? 'auto' : '0px'
  }
})

const changeView = () => {
  const el = collapseContentRef.value
  if (!el || isAnimating.value || props.disabled) return

  isAnimating.value = true
  active.value = !active.value

  if (active.value) {
    el.style.height = el.scrollHeight + 'px'
    el.addEventListener(
      'transitionend',
      () => {
        if (active.value) {
          el.style.height = 'auto'
        }
        isAnimating.value = false
      },
      { once: true },
    )
  } else {
    if (el.style.height === 'auto') {
      el.style.height = el.scrollHeight + 'px'
    }
    requestAnimationFrame(() => {
      el.style.height = '0px'
      el.addEventListener(
        'transitionend',
        () => {
          isAnimating.value = false
        },
        { once: true },
      )
    })
  }
}
</script>

<template>
  <div class="v-collapse" :id="props.title" :class="{ 'is-disabled': props.disabled }">
    <div
      class="v-collapse__header"
      @click="changeView"
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
    <div
      class="v-collapse__content"
      ref="collapseContentRef"
      :style="{ opacity: active ? '1' : '0' }"
    >
      <div class="container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
