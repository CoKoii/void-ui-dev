<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { IconProps } from './types'
defineOptions({
  name: 'VIcon',
  inheritAttrs: false,
})
const props = defineProps<IconProps>()
</script>

<template>
  <i class="v-icon">
    <FontAwesomeIcon v-bind="props" :style="{ color: props.color }" />
  </i>
</template>

<style scoped>
@import './style.css';
</style>
