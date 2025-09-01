<script setup lang="ts">
import { ref } from 'vue'
import VIcon from '@/components/Icon/index.vue'
import VCode from '@/components/Code/index.vue'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { CodePreviewProps } from './types'

defineOptions({
  name: 'VCodePreview',
})

const props = withDefaults(defineProps<CodePreviewProps>(), {
  lang: 'vue',
  lineNumbers: true,
  dots: true,
  path: '',
  extra: true,
  show: false,
})

const isExpanded = ref(props.show)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="VCodePreview">
    <div class="demo">
      <slot name="demo" />
    </div>
    <div class="tools">
      <div class="spread" @click="toggleExpanded">
        <VIcon :icon="faCode" />
      </div>
    </div>
    <div class="code" v-if="isExpanded">
      <VCode v-bind="props">
        <slot name="code" />
      </VCode>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
