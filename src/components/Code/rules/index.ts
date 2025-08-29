export type CodeHandler = (code: string) => string

import { transformJs } from './js'

const handlers: Record<string, CodeHandler> = {
  js: transformJs,
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
        `<span style="display: block; min-height: 1.6em; line-height: 1.6em;">${line || '&nbsp;'}</span>`,
    )
    .join('')
}

function defaultTransform(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  return wrapLines(escaped)
}
