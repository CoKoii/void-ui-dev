<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VIconProps } from './types'
const props = withDefaults(defineProps<VIconProps>(), {})
defineOptions({
  name: 'VIcon',
  inheritAttrs: false,
})
</script>

<template>
  <i class="VIcon" :style="{ '--v-icon-color': props.color }">
    <span class="VIcon-wrapper">
      <FontAwesomeIcon v-bind="props" />
    </span>
  </i>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
