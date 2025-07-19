<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import type { CollapseProps } from './types'

const props = withDefaults(defineProps<CollapseProps>(), {})
const collapseContentRef = ref<HTMLDivElement | null>(null)
const collapseRef = ref<HTMLDivElement | null>(null)
const show = ref(props.active)

watch(
  () => props.active,
  (newActive) => {
    if (newActive !== show.value) {
      changeView()
    }
  },
)

onMounted(() => {
  const el = collapseContentRef.value
  if (!el) return
  el.style.height = show.value ? 'auto' : '0px'
})

const changeView = async () => {
  const el = collapseContentRef.value
  if (!el) return
  const isExpanding = !show.value
  el.removeEventListener('transitionend', handleTransitionEnd)
  if (isExpanding) {
    show.value = true
    const currentHeight = el.getBoundingClientRect().height
    el.style.height = currentHeight + 'px'
    await nextTick()
    el.style.height = el.scrollHeight + 'px'
    el.addEventListener('transitionend', handleTransitionEnd)
  } else {
    show.value = false
    if (el.style.height === 'auto') {
      el.style.height = el.scrollHeight + 'px'
      await nextTick()
    }
    requestAnimationFrame(() => {
      el.style.height = '0px'
      el.addEventListener('transitionend', handleTransitionEnd)
    })
  }
}

const handleTransitionEnd = () => {
  const el = collapseContentRef.value
  if (!el) return

  if (show.value) {
    el.style.height = 'auto'
  }

  el.removeEventListener('transitionend', handleTransitionEnd)
}
</script>

<template>
  <div
    class="v-collapse"
    ref="collapseRef"
    :id="props.title"
    :class="{ 'is-disabled': props.disabled }"
  >
    <div
      class="v-collapse__header"
      @click="changeView"
      :style="{ borderBottom: show ? '1px solid var(--border-color-1)' : '1px solid transparent' }"
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
      :style="{ opacity: show ? '1' : '0' }"
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
