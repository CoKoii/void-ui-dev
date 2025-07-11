<script setup lang="ts">
import VButton from './components/Button/Button.vue'
import { onMounted, ref } from 'vue'
import type { ButtonInstance } from './components/Button/types'
const buttonElement = ref<ButtonInstance | null>(null)
onMounted(() => {
  console.log('Button Element:', buttonElement?.value?.ref)
})
defineOptions({
  name: 'App',
})
</script>

<template>
  <div class="App">
    <v-button type="danger" plain ref="buttonElement">Primary Button</v-button>
  </div>
</template>

<style scoped lang="scss">
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}
</style>
