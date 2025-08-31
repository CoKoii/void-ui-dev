<script setup lang="ts">
import VIcon from '@/components/Icon/index.vue'
import { faCode } from '@fortawesome/free-solid-svg-icons'
defineOptions({
  name: 'VCodePreview',
})
</script>

<template>
  <div class="VCodePreview">
    <div class="demo">
      <slot name="demo" />
    </div>
    <div class="tools">
      <div class="spread">
        <VIcon :icon="faCode"></VIcon>
      </div>
    </div>
    <div class="code">
      <slot name="code" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>
