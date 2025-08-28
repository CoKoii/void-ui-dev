import { escapeHtml, wrapLines } from './index'

function highlightSimpleJs(htmlEscaped: string): string {
  let result = htmlEscaped

  result = result.replace(/(['"`])(?:\\.|(?!\1).)*?\1/g, '<span style="color: #9ECBFF;">$&</span>')

  result = result.replace(
    /\b(import|from|function|export|const|return)\b/g,
    '<span style="color: #ff6b6b; font-weight: 600;">$1</span>',
  )

  result = result.replace(
    /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    '<span style="color: #B392F0;">$1</span>(',
  )

  result = result.replace(/\(([^()]*)\)/g, '(<span style="color: #9ECBFF;">$1</span>)')

  return result
}

export function transformJs(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  const highlighted = highlightSimpleJs(escaped)
  return wrapLines(highlighted)
}
