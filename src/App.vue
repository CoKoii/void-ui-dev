<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCodePreview from './components/CodePreview/index.vue'
import VCard from './components/Card/index.vue'
import VIcon from './components/Icon/index.vue'
import { faCode } from '@fortawesome/free-solid-svg-icons'

const codeExample = `<template>
  <VCard title="示例卡片" description="这是一个卡片组件的演示">
    <template #icon>
      <VIcon :icon="faCode" />
    </template>
    <p>卡片内容区域</p>
  </VCard>
</template>

<script setup>
import VCard from './components/Card/index.vue'
import VIcon from './components/Icon/index.vue'
import { faCode } from '@fortawesome/free-solid-svg-icons'
<\/script>`
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCodePreview lang="vue" :dots="true">
      <template #demo>
        <VCard title="示例卡片" description="这是一个卡片组件的演示">
          <template #icon>
            <VIcon :icon="faCode" />
          </template>
          <p>卡片内容区域</p>
        </VCard>
      </template>
      <template #code>{{ codeExample }}</template>
    </VCodePreview>
  </div>
</template>

<style scoped lang="scss">
.App {
  width: 100vw;
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
