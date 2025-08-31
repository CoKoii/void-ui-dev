import hljs from 'highlight.js'

const languageMap: Readonly<Record<string, string>> = Object.freeze({
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
  css: 'css',
  scss: 'scss',
  sass: 'scss',
  less: 'less',
  stylus: 'stylus',
})

function resolveLanguage(lang: string | undefined): string | undefined {
  const key = lang?.toLowerCase()
  if (!key) return undefined
  return languageMap[key] || key
}

export function formatByLang(lang: string, code: string): string {
  const normalized = code.replace(/\r\n?/g, '\n')
  const trimmed = normalized.trim()
  if (!trimmed) return '&nbsp;'

  const actualLang = resolveLanguage(lang)

  try {
    if (actualLang && hljs.getLanguage(actualLang)) {
      const result = hljs.highlight(trimmed, { language: actualLang })
      return result.value
    }

    if (lang.toLowerCase() === 'css' && hljs.getLanguage('css')) {
      const result = hljs.highlight(trimmed, { language: 'css' })
      return result.value
    }
    if (
      (lang.toLowerCase() === 'scss' || lang.toLowerCase() === 'sass') &&
      hljs.getLanguage('scss')
    ) {
      const result = hljs.highlight(trimmed, { language: 'scss' })
      return result.value
    }
    if (lang.toLowerCase() === 'less' && hljs.getLanguage('less')) {
      const result = hljs.highlight(trimmed, { language: 'less' })
      return result.value
    }

    const autoResult = hljs.highlightAuto(trimmed)
    return autoResult.value
  } catch (error) {
    console.warn('Highlight.js error:', error, 'for language:', actualLang || lang)
    return escapeHtml(trimmed)
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
