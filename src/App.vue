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
}
.changeTheme {
  position: fixed;
  right: 30px;
  top: 30px;
}
`
console.log(vueTemplateCode)
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
