<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCode from './components/Code/index.vue'
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCode>
      <pre>
import { createApp, ref } from 'vue'
createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')</pre
      >
    </VCode>
  </div>
</template>

<style scoped lang="scss">
.App {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: var(--v-page-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.changeTheme {
  position: absolute;
  right: 30px;
  top: 30px;
}
</style>
