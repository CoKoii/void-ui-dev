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
  const trimmedCode = code.trim()
  if (!trimmedCode) return wrapLines('&nbsp;')

  // 获取实际的语言名称
  const actualLang = languageMap[lang?.toLowerCase()] || lang?.toLowerCase()

  try {
    let highlighted: string

    if (actualLang && hljs.getLanguage(actualLang)) {
      // 使用指定语言进行高亮
      highlighted = hljs.highlight(trimmedCode, { language: actualLang }).value
    } else {
      // 自动检测语言
      const result = hljs.highlightAuto(trimmedCode)
      highlighted = result.value
    }

    return wrapLines(highlighted)
  } catch (error) {
    // 如果高亮失败，返回转义后的原始代码
    console.warn('Code highlighting failed:', error)
    return wrapLines(escapeHtml(trimmedCode))
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function wrapLines(content: string): string {
  return content
    .split('\n')
    .map(
      (line) =>
        `<span style="display: block; min-height: 1.6em; line-height: 1.6;font-size:12px">${line || '&nbsp;'}</span>`,
    )
    .join('')
}
