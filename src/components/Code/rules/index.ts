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
      return hljs.highlight(trimmed, { language: actualLang }).value
    }
    return hljs.highlightAuto(trimmed).value
  } catch {
    return escapeHtml(trimmed)
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
