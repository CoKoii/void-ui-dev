<script setup lang="ts">
defineOptions({
  name: 'App',
})
import VThemeToggle from './components/ThemeToggle/index.vue'
import VCode from './components/Code/index.vue'
import { VCard, VIcon } from './components'
import { faDownload, faMoon } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div class="App">
    <VThemeToggle class="changeTheme" />
    <VCode
      :line-numbers="false"
      :extra="{ copy: true, download: false, showLang: true }"
      :dots="false"
      lang="bash"
    >
      {{ 'pnpm i antd' }}
    </VCode>
    <div class="icon">
      <VIcon :icon="faMoon" color="var(--v-blue-6)" size="3x" />
    </div>
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
.icon {
  padding: 160px;
  border-radius: 50%;
  background-color: red;
}
</style>
