<script setup lang="ts">
import { CardProps } from './types'

const props = withDefaults(defineProps<CardProps>(), {
  bordered: true,
})
const slots = defineSlots()

defineOptions({
  name: 'VCard',
})
</script>

<template>
  <div class="VCard" :class="{ bordered: props.bordered }">
    <div class="title" v-if="slots.title || slots.extra || props.title">
      <div class="left">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div class="right">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
