<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCode from './components/Code/index.vue'
const vueTemplateCode = `
.App {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-color: var(--v-page-bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  transition: all 0.3s ease-in-out;
}

#main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.changeTheme {
  position: fixed;
  right: 30px;
  top: 30px;
  z-index: 1000;
}

.button:hover {
  background-color: #007bff;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .App {
    gap: 12px;
    padding: 16px;
  }
}

:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --border-radius: 8px;
}
`
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCode :line-numbers="true" :extra="{ copy: true, showLang: true }" :dots="true" lang="css">
      {{ vueTemplateCode }}
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
  align-items: center;
  justify-content: center;
  gap: 24px;
}
.changeTheme {
  position: fixed;
  right: 30px;
  top: 30px;
}
</style>
