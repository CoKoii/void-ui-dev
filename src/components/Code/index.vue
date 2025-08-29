<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { formatByLang } from './rules'
import type { CodeProps } from './types'
import VIcon from '../Icon/index.vue'
import { faCopy, faDownload } from '@fortawesome/free-solid-svg-icons'
import html2canvas from 'html2canvas'

defineOptions({ name: 'VCode', inheritAttrs: true })

const props = withDefaults(defineProps<CodeProps>(), {
  lineNumbers: false,
  extra: true,
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

function runPipeline() {
  const raw = slotEl.value?.textContent ?? ''
  html.value = formatByLang(props.lang, raw)
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
  <div class="VCode" :class="{ 'with-lines': props.lineNumbers }" v-bind="$attrs" ref="codeEl">
    <div ref="slotEl" style="display: none"><slot /></div>
    <div class="buttons"></div>
    <code v-html="html"></code>
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
