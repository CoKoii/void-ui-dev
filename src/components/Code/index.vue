<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatByLang } from './rules'

defineOptions({ name: 'VCode', inheritAttrs: true })

const props = withDefaults(defineProps<{ lang?: string }>(), { lang: 'js' })

const slotEl = ref<HTMLElement | null>(null)
const html = ref('')

function runPipeline() {
  const raw = slotEl.value?.textContent ?? ''
  html.value = formatByLang(props.lang, raw)
}

onMounted(() => {
  runPipeline()
})
</script>

<template>
  <div class="VCode" v-bind="$attrs">
    <div ref="slotEl" style="display: none"><slot /></div>
    <code v-html="html"></code>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
