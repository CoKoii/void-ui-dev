<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCodePreview from './components/CodePreview/index.vue'
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCodePreview>
      <template #demo>演示</template>
      <template #code>代码</template>
    </VCodePreview>
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
