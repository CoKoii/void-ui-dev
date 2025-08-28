<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VIcon from './components/Icon/index.vue'
import { faSun } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div class="App">
    <VThemeToggle
      @theme-change="
        (theme: string) => {
          console.log('Theme changed to:', theme)
        }
      "
    >
    </VThemeToggle>
    <span>666</span>
    <VIcon :icon="faSun" :color="'var(--v-gray-9)'" />
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
