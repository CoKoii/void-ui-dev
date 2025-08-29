import { escapeHtml, wrapLines } from './index'

function highlightSimpleJs(htmlEscaped: string): string {
  let result = htmlEscaped

  // Color values: #RRGGBB or #RGB format
  result = result.replace(
    /(#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}))\b/g,
    (_match, colorValue: string) =>
      `<span style="color: #000000 ; background-color: ${colorValue}; padding: 2px 4px; border-radius: 3px;">${colorValue}</span>`,
  )

  // Strings
  result = result.replace(
    /("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g,
    '<span style="color: #9ECBFF;">$&</span>',
  )

  // Comments
  result = result.replace(/(\/\/.+)|(\/\*[\s\S]*?\*\/)/g, '<span style="color: #7DFCF4;">$&</span>')

  // Variable declarations: highlight variable names after const/let/var
  result = result.replace(
    /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    (_m, kw: string, name: string) => `${kw} <span style="color: #58A6FF;">${name}</span>`,
  )

  // Helper to highlight parameter identifiers within a comma-separated list
  const highlightParamList = (params: string): string => {
    return params
      .split(',')
      .map((segment) => {
        const original = segment
        const part = segment.trim()
        if (!part) return original
        // Skip simple destructuring params to avoid heavy parsing
        if (part.startsWith('{') || part.startsWith('[')) return original
        // Remove rest and default assignment when extracting the param name
        let left = part.replace(/^\.{3}/, '').trim()
        const eqIdx = left.indexOf('=')
        if (eqIdx !== -1) left = left.slice(0, eqIdx).trim()
        const m = left.match(/[a-zA-Z_$][a-zA-Z0-9_$]*/)
        if (!m) return original
        const name = m[0]
        const replaced = part.replace(name, `<span style="color: #FFD166;">${name}</span>`)
        return original.replace(part, replaced)
      })
      .join(',')
  }

  // Function declarations/expressions: function name(params)
  result = result.replace(
    /\bfunction\b(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*)?\(([^)]*)\)/g,
    (_match, nameGroup: string | undefined, params: string) => {
      const highlightedParams = highlightParamList(params)
      return `function${nameGroup || ''}(${highlightedParams})`
    },
  )

  // Arrow functions with parentheses: (params) =>
  result = result.replace(/\(([^)]*)\)\s*=>/g, (_match, params: string) => {
    const highlightedParams = highlightParamList(params)
    return `(${highlightedParams}) =>`
  })

  // Arrow functions single param: x =>
  result = result.replace(
    /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g,
    (_match, name: string) => `<span style=\"color: #FFD166;\">${name}</span> =>`,
  )

  // Keywords
  result = result.replace(
    /\b(import|from|function|export|const|return|let|var|async|await|type|as)\b/g,
    '<span style="color: #ff6b6b; font-weight: 600;">$1</span>',
  )

  // Function names (calls and declarations): name(
  result = result.replace(
    /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
    '<span style="color: #B392F0;">$1</span>(',
  )

  return result
}

export function transformJs(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  const highlighted = highlightSimpleJs(escaped)
  return wrapLines(highlighted)
}
