<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
</script>

<template>
  <div class="App">
    <VThemeToggle
      lightTheme="light"
      darkTheme="dark"
      :persistent="true"
      :followSystem="true"
      :duration="480"
      @theme-change="
        (theme: string) => {
          console.log('Theme changed to:', theme)
        }
      "
    >
      <button>切换日夜间</button>
    </VThemeToggle>
    <VThemeToggle> </VThemeToggle>
  </div>
</template>

<style scoped lang="scss">
.App {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: var(--v-gray-1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}
</style>
