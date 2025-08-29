import { escapeHtml, wrapLines } from './index'

const COLOR = {
  colorTokenBg: (hex: string) =>
    `<span style="color: #000000; background-color: ${hex}; padding: 2px 4px; border-radius: 3px;">${hex}</span>`,
  string: '<span style="color: #9ECBFF;">$&</span>',
  comment: '<span style="color: #7DFCF4;">$&</span>',
  varName: (kw: string, name: string) => `${kw} <span style="color: #9ECBFF;">${name}</span>`,
  keyword: '<span style="color: #ff6b6b; font-weight: 600;">$1</span>',
  funcName: '<span style="color: #B392F0;">$1</span>(',
}

const RE = {
  colorHex: /(#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}))\b/g,
  token:
    /"(?:[^"\\\]|\\.)*"|'(?:[^'\\\]|\\.)*'|\/\/[^\n\r]*|\/\*[\s\S]*?\*\/|\/(?![*\/])(?:\\.|\\[(?:\\.|[^\\\]])*\\]|[^\\/\n\r])+\/[gimsuy]*/g,
  strOrComment: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/[^\n\r]*|\/\*[\s\S]*?\*\//g,
  stringsOnly: /("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g,
  commentsOnly: /(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)/g,
  varDecl: /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
  keywords: /\b(import|from|function|export|const|return|let|var|async|await|type|as|default)\b/g,
  funcNameCall:
    /\b(?!(?:if|for|while|switch|catch|with|return|typeof|delete|new)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
}

function applyPlainHighlight(s: string): string {
  let out = s
  out = out.replace(RE.colorHex, (_m, hex: string) => COLOR.colorTokenBg(hex))
  out = out.replace(RE.varDecl, (_m, kw: string, name: string) => COLOR.varName(kw, name))
  out = out.replace(RE.keywords, COLOR.keyword)
  out = out.replace(RE.funcNameCall, COLOR.funcName)
  return out
}

function highlightSimpleJs(htmlEscaped: string): string {
  const src = htmlEscaped
  const segs: string[] = []
  let last = 0
  let m: RegExpExecArray | null
  // Use a combined tokenizer that also captures regex literals
  const re = new RegExp(RE.token)
  while ((m = re.exec(src)) !== null) {
    const idx = m.index
    if (idx > last) segs.push(applyPlainHighlight(src.slice(last, idx)))
    const token = m[0]
    // Classify without using global RegExp.test to avoid lastIndex side effects
    if (token.startsWith('//') || token.startsWith('/*')) {
      segs.push(token.replace(RE.commentsOnly, COLOR.comment))
    } else if (token.startsWith('"') || token.startsWith("'")) {
      segs.push(
        token.replace(RE.stringsOnly, (_m, g1, g2) => {
          const strContent = g1 || g2
          const withColor = strContent.replace(RE.colorHex, (_m: string, hex: string) =>
            COLOR.colorTokenBg(hex),
          )
          return `<span style="color: #9ECBFF;">${withColor}</span>`
        }),
      )
    } else {
      // Regex literal — keep as-is
      segs.push(token)
    }
    last = re.lastIndex
  }
  if (last < src.length) segs.push(applyPlainHighlight(src.slice(last)))
  return segs.join('')
}

export function transformJs(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  const highlighted = highlightSimpleJs(escaped)
  return wrapLines(highlighted)
}
