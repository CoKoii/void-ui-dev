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
    <v-button type="primary" ref="buttonElement">type primary</v-button>
    <v-button type="success" ref="buttonElement">type success</v-button>
    <v-button type="danger" ref="buttonElement">type danger</v-button>
    <v-button type="warning" ref="buttonElement" disabled>type warning</v-button>
    <v-button ref="buttonElement" border="dashed">没有type</v-button>
    <v-button ref="buttonElement" color="red" border="dotted">没有type</v-button>
    <v-button ref="buttonElement" color="blue" border="link">没有type</v-button>
    <v-button ref="buttonElement" color="purple" border="solid">没有type</v-button>
    <v-button ref="buttonElement" color="blue" border="link" disabled>disabled</v-button>
  </div>
</template>

<style scoped lang="scss">
.App {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  gap: 24px;
}
</style>
