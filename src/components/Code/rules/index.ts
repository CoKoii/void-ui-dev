export type CodeHandler = (code: string) => string

import { transformJs } from './js'
import { transformBash } from './bash'

const handlers: Record<string, CodeHandler> = {
  js: transformJs,
  ts: transformJs,
  javascript: transformJs,
  typescript: transformJs,
  bash: transformBash,
  sh: transformBash,
  zsh: transformBash,
  shell: transformBash,
}

export function formatByLang(lang: string, code: string): string {
  const key = (lang || '').toLowerCase()
  const handler = handlers[key]
  return handler ? handler(code) : defaultTransform(code)
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function wrapLines(content: string): string {
  return content
    .split('\n')
    .map(
      (line) =>
        `<span style="display: block; min-height: 1.6em; line-height: 1.6em; font-size: 16px;">${line || '&nbsp;'}</span>`,
    )
    .join('')
}

function defaultTransform(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  return wrapLines(escaped)
}
