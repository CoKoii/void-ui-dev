<script setup lang="ts">
import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
defineOptions({
  name: 'VIcon',
  inheritAttrs: false,
})
const props = defineProps<FontAwesomeIconProps>()
</script>

<template>
  <i class="v-icon">
    <FontAwesomeIcon v-bind="props" />
  </i>
</template>

<style scoped lang="scss"></style>
