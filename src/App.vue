<script setup lang="ts">
import VButton from './components/Button/Button.vue'
defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="App">
    <v-button type="primary" plain disabled>Click Me</v-button>
  </div>
</template>

<style scoped></style>
