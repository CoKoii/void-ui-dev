<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import type { CollapseProps } from './types'

const props = withDefaults(defineProps<CollapseProps>(), {})
const collapseContentRef = ref<HTMLDivElement | null>(null)
const show = ref(false)
onMounted(() => {
  const el = collapseContentRef.value
  if (!el) return
  el.style.height = show.value ? 'auto' : '0px'
})

const changeView = async () => {
  const el = collapseContentRef.value
  if (!el) return

  const isExpanding = !show.value

  if (isExpanding) {
    el.style.height = el.scrollHeight + 'px'

    const onTransitionEnd = () => {
      el.style.height = 'auto'
      el.removeEventListener('transitionend', onTransitionEnd)
    }

    el.addEventListener('transitionend', onTransitionEnd)
  } else {
    if (el.style.height === 'auto') {
      el.style.height = el.scrollHeight + 'px'
      await nextTick()
    }
    requestAnimationFrame(() => {
      el.style.height = '0px'
    })
  }
  show.value = isExpanding
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
