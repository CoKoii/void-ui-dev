<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatByLang } from './rules'
import type { CodeProps } from './types'
import VIcon from '../Icon/index.vue'
import { faCopy, faDownload } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas'

defineOptions({ name: 'VCode', inheritAttrs: true })

const props = withDefaults(defineProps<CodeProps>(), {
  lang: 'js',
  lineNumbers: false,
})

const slotEl = ref<HTMLElement | null>(null)
const html = ref('')
const codeEl = ref<HTMLElement | null>(null)

function runPipeline() {
  const raw = slotEl.value?.textContent ?? ''
  html.value = formatByLang(props.lang, raw)
}

async function copyCode() {
  try {
    const raw = slotEl.value?.textContent ?? ''
    await navigator.clipboard.writeText(raw)
    alert('复制成功！')
  } catch (err) {
    console.error('复制失败', err)
  }
}

async function downloadImage() {
  if (!codeEl.value) return
  try {
    const canvas = await html2canvas(codeEl.value, {
      backgroundColor: 'transparent',
      scale: 2,
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
  <div class="VCode" :class="{ 'with-lines': props.lineNumbers }" v-bind="$attrs" ref="codeEl">
    <div ref="slotEl" style="display: none"><slot /></div>
    <code v-html="html"></code>
    <div class="lang">{{ props.lang }}</div>
    <div class="tools">
      <div class="copy" @click="copyCode">
        <VIcon :icon="faCopy" />
      </div>
      <div class="download" @click="downloadImage">
        <VIcon :icon="faDownload" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
