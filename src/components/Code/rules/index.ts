import hljs from 'highlight.js'

const languageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  jsx: 'javascript',
  sh: 'bash',
  zsh: 'bash',
  shell: 'bash',
  py: 'python',
  rb: 'ruby',
  cs: 'csharp',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  hpp: 'cpp',
  h: 'c',
  yml: 'yaml',
  md: 'markdown',
  vue: 'xml',
  html: 'xml',
  htm: 'xml',
  template: 'xml',
}

export function formatByLang(lang: string, code: string): string {
  // 统一换行符，避免 CRLF 干扰
  const normalized = code.replace(/\r\n?/g, '\n')
  const trimmed = normalized.trim()
  if (!trimmed) return '&nbsp;'

  // 获取实际的语言名称
  const actualLang = languageMap[lang?.toLowerCase()] || lang?.toLowerCase()

  try {
    if (actualLang && hljs.getLanguage(actualLang)) {
      // 整段高亮，保持跨行语法高亮的上下文
      return hljs.highlight(trimmed, { language: actualLang }).value
    }
    return hljs.highlightAuto(trimmed).value
  } catch (error) {
    console.warn('Code highlighting failed:', error)
    return escapeHtml(trimmed)
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// 行包裹在组件层（index.vue）完成，以避免破坏高亮结构
