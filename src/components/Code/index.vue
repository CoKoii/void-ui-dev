<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { formatByLang } from './rules'
import type { CodeProps } from './types'
import VIcon from '../Icon/index.vue'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import 'highlight.js/styles/github-dark.css'

defineOptions({ name: 'VCode', inheritAttrs: true })

const props = withDefaults(defineProps<CodeProps>(), {
  lineNumbers: false,
  extra: true,
  dots: true,
})

const emit = defineEmits<{
  (e: 'copy', success: boolean): void
}>()

const extraConfig = computed(() => {
  if (typeof props.extra === 'boolean') {
    return props.extra ? { copy: true, showLang: true } : { copy: false, showLang: false }
  }
  return {
    copy: props.extra?.copy ?? true,
    showLang: props.extra?.showLang ?? true,
  }
})

const slotEl = ref<HTMLElement | null>(null)
const html = ref('')
const codeEl = ref<HTMLElement | null>(null)

const getRawCode = () => slotEl.value?.textContent ?? ''

function wrapHighlightedHtmlToLines(highlighted: string): string {
  const container = document.createElement('div')
  container.innerHTML = highlighted

  const lines: HTMLElement[] = []
  let currentLine = document.createElement('span')
  lines.push(currentLine)

  const origStack: Element[] = []
  let cloneStack: Element[] = []

  const getTarget = () => (cloneStack.length ? cloneStack[cloneStack.length - 1] : currentLine)

  function startNewLine() {
    currentLine = document.createElement('span')
    lines.push(currentLine)
    cloneStack = []
    let parent: Element | HTMLElement = currentLine
    for (const orig of origStack) {
      const clone = orig.cloneNode(false) as Element
      parent.appendChild(clone)
      parent = clone
      cloneStack.push(clone)
    }
  }

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue || ''
      const parts = text.split('\n')
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) getTarget().appendChild(document.createTextNode(parts[i]))
        if (i < parts.length - 1) {
          startNewLine()
        }
      }
      return
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element
      const clone = el.cloneNode(false) as Element
      getTarget().appendChild(clone)
      origStack.push(el)
      cloneStack.push(clone)
      const children = Array.from(el.childNodes)
      for (const child of children) walk(child)
      origStack.pop()
      cloneStack.pop()
      return
    }
  }

  for (const child of Array.from(container.childNodes)) {
    walk(child)
  }

  return lines.map((el) => el.outerHTML).join('')
}

function runPipeline() {
  const raw = getRawCode()
  const highlighted = formatByLang(props.lang, raw)
  html.value = props.lineNumbers ? wrapHighlightedHtmlToLines(highlighted) : highlighted
}

async function copyCode() {
  try {
    const raw = getRawCode()
    await navigator.clipboard.writeText(raw)
    emit('copy', true)
  } catch {
    emit('copy', false)
  }
}

onMounted(runPipeline)
watch(
  () => [props.lang, props.lineNumbers],
  () => runPipeline(),
)
</script>

<template>
  <div
    class="VCode"
    :class="{ 'with-lines': props.lineNumbers, beauty: props.dots || props.path }"
    v-bind="$attrs"
    ref="codeEl"
  >
    <div ref="slotEl" style="display: none"><slot /></div>
    <div class="buttons" v-if="props.dots || props.path">
      <div class="dots" v-if="props.dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="path" v-if="props.path">{{ props.path }}</span>
    </div>
    <div class="code-wrapper">
      <code v-html="html"></code>
    </div>
    <div class="lang" v-if="extraConfig.showLang">{{ props.lang }}</div>
    <div class="tools" v-if="extraConfig.copy">
      <div class="copy" @click="copyCode">
        <VIcon :icon="faCopy" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
