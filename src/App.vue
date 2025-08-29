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
    <VCode :line-numbers="true" :extra="{ copy: true, download: true, showLang: true }" lang="js">
      {{
        "import type { App } from \'vue\'\nimport { version } from \'./version\'\n\n// 组件导入\nimport VCard from \'./components/Card/index.vue\'\nimport VIcon from \'./components/Icon/index.vue\'\nimport VThemeToggle from \'./components/ThemeToggle/index.vue\'\nimport VCode from \'./components/Code/index.vue\'\n// 样式导入\nimport \'./styles/main.scss\'\n\n// 组件列表\nconst components = [VCard, VIcon, VThemeToggle, VCode] as const\n\n// 安装函数\nconst install = (app: App): void => {\n  components.forEach((component) => {\n    if (component.name) {\n      app.component(component.name, component)\n    }\n  })\n}\n\n// 默认导出\nconst VoidDesignVue = { install, version }\n\n// 组件导出\nexport { VCard, VIcon, VThemeToggle, VCode }\n\n// 类型导出\nexport * from \'./components\'\n\n// 插件导出\nexport { install, version }\nexport default VoidDesignVue\n"
      }}
    </VCode>
  </div>
</template>

<style scoped lang="scss">
.App {
  width: 100vw;
  overflow: auto;
  background-color: var(--v-page-bg-color);
  display: flex;
  flex-direction: column;
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
