<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCode from './components/Code/index.vue'
import { VCard, VIcon } from './components'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCode
      :line-numbers="true"
      :extra="{ copy: true, download: false, showLang: true }"
      lang="js"
      style="width: 600px"
      path="main.ts"
    >
      {{
        "import type { App } from 'vue'\nimport { version } from './version'\n\n// 组件导入\nimport VCard from './components/Card/index.vue'\nimport VCode from './components/Code/index.vue'\nimport VIcon from './components/Icon/index.vue'\nimport VThemeToggle from './components/ThemeToggle/index.vue'\n\n// 样式导入\nimport './styles/main.scss'\n\n// 组件列表\nconst components = [VCard, VCode, VIcon, VThemeToggle] as const\n\n// 安装函数\nconst install = (app: App): void => {\n  components.forEach((component) => {\n    if (component.name) {\n      app.component(component.name, component)\n    }\n  })\n}\n\n// 默认导出\nconst VoidDesignVue = { install, version }\n\n// 组件导出\nexport { VCard, VCode, VIcon, VThemeToggle }\n\n// 类型导出\nexport * from './components'\n\n// 插件导出\nexport { install, version }\nexport default VoidDesignVue"
      }}
    </VCode>

    <VCard title="Card Title">
      <template #extra>
        <VIcon :icon="faDownload" color="var(--v-blue-6)" />
      </template>
      labore, ipsum architecto dignissimos debitis accusantium eveniet.
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
