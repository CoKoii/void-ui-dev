<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCard from './components/Card/index.vue'
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCard style="width: 50vw">
      <template #title>基本使用</template>
      Vben Admin 是一个基于 Vue3.0、Vite、 TypeScript
      的后台解决方案，目标是为开发中大型项目提供开箱即用的解决方案。包括二次封装组件、utils、hooks、动态菜单、权限校验、多主题配置、按钮级别权限控制等功能。项目会使用前端较新的技术栈，可以作为项目的启动模版，以帮助你快速搭建企业级中后台产品原型。也可以作为一个示例，用于学习
    </VCard>
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
