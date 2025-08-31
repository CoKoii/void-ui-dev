<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { formatByLang } from './rules'
import type { CodeProps } from './types'
import VIcon from '../Icon/index.vue'
import { faCopy, faDownload } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas'
import 'highlight.js/styles/github-dark.css'

defineOptions({ name: 'VCode', inheritAttrs: true })

const props = withDefaults(defineProps<CodeProps>(), {
  lineNumbers: false,
  extra: true,
  dots: true,
})

const extraConfig = computed(() => {
  if (typeof props.extra === 'boolean') {
    return props.extra
      ? { copy: true, download: true, showLang: true }
      : { copy: false, download: false, showLang: false }
  }
  return {
    copy: props.extra?.copy ?? true,
    download: props.extra?.download ?? true,
    showLang: props.extra?.showLang ?? true,
  }
})

const slotEl = ref<HTMLElement | null>(null)
const html = ref('')
const codeEl = ref<HTMLElement | null>(null)

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
    // 依据当前原始路径重建克隆路径
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
          // 遇到换行，开启新行并保持当前打开的标签链
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
      // 递归其子节点
      const children = Array.from(el.childNodes)
      for (const child of children) walk(child)
      // 退出该元素
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
  const raw = slotEl.value?.textContent ?? ''
  const highlighted = formatByLang(props.lang, raw)
  html.value = props.lineNumbers ? wrapHighlightedHtmlToLines(highlighted) : highlighted
}

async function copyCode() {
  try {
    const raw = slotEl.value?.textContent ?? ''
    await navigator.clipboard.writeText(raw)
    console.log('复制成功！')
  } catch (err) {
    console.error('复制失败', err)
  }
}

async function downloadImage() {
  if (!codeEl.value) return
  try {
    const canvas = await html2canvas(codeEl.value, {
      backgroundColor: 'transparent',
      scale: 3,
    })
    const link = document.createElement('a')
    link.download = `${props.lang}-code.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('下载失败', err)
  }
}

onMounted(() => {
  runPipeline()
})
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
    <div class="tools" v-if="extraConfig.copy || extraConfig.download">
      <div class="copy" @click="copyCode" v-if="extraConfig.copy">
        <VIcon :icon="faCopy" />
      </div>
      <div class="download" @click="downloadImage" v-if="extraConfig.download">
        <VIcon :icon="faDownload" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
