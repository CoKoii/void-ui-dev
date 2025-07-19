<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { CollapseProps } from './types'

const props = withDefaults(defineProps<CollapseProps>(), {})
const collapseContentRef = ref<HTMLDivElement | null>(null)
const show = ref(false)
const isAnimating = ref(false)

onMounted(() => {
  const el = collapseContentRef.value
  if (!el) return
  el.style.height = show.value ? 'auto' : '0px'
})

const changeView = async () => {
  if (isAnimating.value) return

  const el = collapseContentRef.value
  if (!el) return

  isAnimating.value = true
  const isExpanding = !show.value
  el.removeEventListener('transitionend', handleTransitionEnd)

  if (isExpanding) {
    show.value = true
    el.style.height = el.scrollHeight + 'px'
    el.addEventListener('transitionend', handleTransitionEnd)
  } else {
    if (el.style.height === 'auto') {
      el.style.height = el.scrollHeight + 'px'
      await nextTick()
    }
    requestAnimationFrame(() => {
      el.style.height = '0px'
      el.addEventListener('transitionend', handleTransitionEnd)
    })
    show.value = false
  }
}

const handleTransitionEnd = () => {
  const el = collapseContentRef.value
  if (!el) return

  if (show.value) {
    el.style.height = 'auto'
  }

  el.removeEventListener('transitionend', handleTransitionEnd)
  isAnimating.value = false
}
</script>

<template>
  <div class="v-collapse">
    <div class="v-collapse__header" @click="changeView">
      <div class="v-collapse__header__left">
        <slot name="icon">→</slot>
        <div>{{ props.title }}</div>
      </div>
      <div class="v-collapse__header__right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="v-collapse__content" ref="collapseContentRef">
      <div class="container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './style.css';
</style>
