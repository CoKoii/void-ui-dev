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
    <VCode>
      <pre>
        {{ 'import { escapeHtml, wrapLines } from \'./index\'\n\nfunction highlightSimpleJs(htmlEscaped: string): string {\n  let result = htmlEscaped\n\n  result = result.replace(/([\'\"`])(?:\\\\.|(?!\\1).)*?\\1/g, \'<span style=\"color: #9ECBFF;\">$\&</span>\')\n\n  result = result.replace(\n    /\\b(import|from|function|export|const|return)\\b/g,\n    \'<span style=\"color: #ff6b6b; font-weight: 600;\">$1</span>\',\n  )\n\n  result = result.replace(\n    /\\b([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(/g,\n    \'<span style=\"color: #B392F0;\">$1</span>(\',\n  )\n\n  result = result.replace(/\\(([^()]*)\\)/g, \'(<span style=\"color: #9ECBFF;\">$1</span>)\')\n\n  return result\n}\n\nexport function transformJs(code: string): string {\n  const trimmedCode = code.trim()\n  const escaped = escapeHtml(trimmedCode)\n  const highlighted = highlightSimpleJs(escaped)\n  return wrapLines(highlighted)\n}\n' }}

      </pre>
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
