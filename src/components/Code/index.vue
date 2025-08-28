<script setup lang="ts">
defineOptions({
  name: 'VCode',
})
const $slots = defineSlots()
console.log($slots)
</script>

<template>
  <div class="VCode">
    <code><slot></slot></code>
  </div>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
