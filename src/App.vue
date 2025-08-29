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
        {{
          "import { escapeHtml, wrapLines } from \'./index\'\n\nconst COLOR = {\n  colorTokenBg: (hex: string) =>\n    `<span style=\"color: #000000; background-color: ${hex}; padding: 2px 4px; border-radius: 3px;\">${hex}</span>`,\n  string: \'<span style=\"color: #9ECBFF;\">$\&</span>\',\n  comment: \'<span style=\"color: #7DFCF4;\">$\&</span>\',\n  varName: (kw: string, name: string) => `${kw} <span style=\"color: #9ECBFF;\">${name}</span>`,\n  keyword: \'<span style=\"color: #ff6b6b; font-weight: 600;\">$1</span>\',\n  funcName: \'<span style=\"color: #B392F0;\">$1</span>(\',\n}\n\nconst RE = {\n  colorHex: /(#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}))\\b/g,\n  strOrComment: /\"(?:[^\"\\\\]|\\\\.)*\"|\'(?:[^\'\\\\]|\\\\.)*\'|\\/\\/[^\\n\\r]*|\\/\\*[\\s\\S]*?\\*\\//g,\n  stringsOnly: /(\"(?:[^\"\\\\]|\\\\.)*\")|(\'(?:[^\'\\\\]|\\\\.)*\')/g,\n  commentsOnly: /(\\/\\/[^\\n\\r]*|\\/\\*[\\s\\S]*?\\*\\/)/g,\n  varDecl: /\\b(const|let|var)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,\n  keywords: /\\b(import|from|function|export|const|return|let|var|async|await|type|as|default)\\b/g,\n  funcNameCall: /\\b(?!(?:if|for|while|switch|catch|with|return|typeof|delete|new)\\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(/g,\n}\n\nfunction applyPlainHighlight(s: string): string {\n  let out = s\n  out = out.replace(RE.colorHex, (_m, hex: string) => COLOR.colorTokenBg(hex))\n  out = out.replace(RE.varDecl, (_m, kw: string, name: string) => COLOR.varName(kw, name))\n  out = out.replace(RE.keywords, COLOR.keyword)\n  out = out.replace(RE.funcNameCall, COLOR.funcName)\n  return out\n}\n\nfunction highlightSimpleJs(htmlEscaped: string): string {\n  const src = htmlEscaped\n  const segs: string[] = []\n  let last = 0\n  let m: RegExpExecArray | null\n  const re = new RegExp(RE.strOrComment, \'g\')\n  while ((m = re.exec(src)) !== null) {\n    const idx = m.index\n    if (idx > last) segs.push(applyPlainHighlight(src.slice(last, idx)))\n    const token = m[0]\n    if (RE.commentsOnly.test(token)) {\n      segs.push(token.replace(RE.commentsOnly, COLOR.comment))\n    } else {\n      const colored = token.replace(RE.colorHex, (_m, hex: string) => COLOR.colorTokenBg(hex))\n      segs.push(colored.replace(RE.stringsOnly, COLOR.string))\n    }\n    last = re.lastIndex\n  }\n  if (last < src.length) segs.push(applyPlainHighlight(src.slice(last)))\n  return segs.join(\'\')\n}\n\nexport function transformJs(code: string): string {\n  const trimmedCode = code.trim()\n  const escaped = escapeHtml(trimmedCode)\n  const highlighted = highlightSimpleJs(escaped)\n  return wrapLines(highlighted)\n}\n"
        }}

      </pre>
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
  position: absolute;
  right: 30px;
  top: 30px;
}
</style>
