import { escapeHtml, wrapLines } from './index'

const COLOR = {
  colorTokenBg: (hex: string) =>
    `<span style="color: #000000; background-color: ${hex}; padding: 2px 4px; border-radius: 3px;">${hex}</span>`,
  string: '<span style="color: #9ECBFF;">$&</span>',
  comment: '<span style="color: #7DFCF4;">$&</span>',
  varName: (kw: string, name: string) => `${kw} <span style="color: #9ECBFF;">${name}</span>`,
  keyword: '<span style="color: #ff6b6b; font-weight: 600;">$1</span>',
  funcName: '<span style="color: #B392F0;">$1</span>(',
  paramName: (name: string) => `<span style="color: #FFD866;">${name}</span>`,
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
  funcParamsDecl: /\b(function\s*\*?\s*(?:[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\()([^)]*)(\))/g,
  arrowParamsParen: /\(([^)]*)\)(\s*=>)/g,
  arrowParamSingle: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(=>)/g,
  paramUsage: (name: string) => new RegExp(`\\b(?<!\\.|:)\\s*${name}\\b(?!\\s*[:=])`, 'g'),
}

const RESERVED_PARAM_TOKENS = new Set(['true', 'false', 'null', 'undefined', 'this', 'super'])

function highlightParamList(list: string): string {
  if (!list || !list.trim()) return list
  let s = list
  s = s.replace(
    /\.\.\.\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    (_m, name: string) => `...${COLOR.paramName(name)}`,
  )

  s = s.replace(
    /(^|[,(]\s*)(?:(?:public|private|protected|readonly|override)\s+)*(this|[a-zA-Z_$][a-zA-Z0-9_$]*)(\?)?\s*:/g,
    (_m: string, prefix: string, name: string, opt: string | undefined) =>
      `${prefix}${name === 'this' ? name : COLOR.paramName(name)}${opt || ''}:`,
  )

  s = s.replace(
    /(^|[,(]\s*)(?:(?:public|private|protected|readonly|override)\s+)*(this|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g,
    (_m: string, prefix: string, name: string) =>
      `${prefix}${name === 'this' ? name : COLOR.paramName(name)}=`,
  )

  s = s.replace(
    /(^|[,(]\s*)(?:(?:public|private|protected|readonly|override)\s+)*(?!this\b)([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*(?:\?|,|\)|$))/g,
    (_m: string, prefix: string, name: string) =>
      `${prefix}${RESERVED_PARAM_TOKENS.has(name) ? name : COLOR.paramName(name)}`,
  )

  s = s.replace(
    /([\{,]\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*:\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    (_m: string, pre: string, name: string) => `${pre}${COLOR.paramName(name)}`,
  )

  s = s.replace(
    /([\{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*(?:,|\}|=))/g,
    (_m: string, pre: string, name: string) => `${pre}${COLOR.paramName(name)}`,
  )

  s = s.replace(
    /([\[,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*(?:,|\]|=))/g,
    (_m: string, pre: string, name: string) => `${pre}${COLOR.paramName(name)}`,
  )

  return s
}

function applyPlainHighlight(s: string): string {
  let out = s
  out = out.replace(RE.colorHex, (_m, hex: string) => COLOR.colorTokenBg(hex))
  out = out.replace(
    RE.funcParamsDecl,
    (_m, open: string, inside: string, close: string) =>
      `${open}${highlightParamList(inside)}${close}`,
  )
  out = out.replace(
    RE.arrowParamsParen,
    (_m, inside: string, after: string) => `(${highlightParamList(inside)})${after}`,
  )
  out = out.replace(
    RE.arrowParamSingle,
    (_m, name: string, arrow: string) => `${COLOR.paramName(name)}${arrow}`,
  )
  out = out.replace(RE.varDecl, (_m, kw: string, name: string) => COLOR.varName(kw, name))
  out = out.replace(RE.keywords, COLOR.keyword)
  out = out.replace(RE.funcNameCall, COLOR.funcName)
  return out
}

function highlightSimpleJs(htmlEscaped: string): string {
  const paramNames = new Set<string>()

  const extractParams = (list: string) => {
    if (!list || !list.trim()) return
    list.replace(
      /(?:^|[,({[]\s*)(?:(?:public|private|protected|readonly|override)\s+)*([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
      (_m, name) => {
        if (!RESERVED_PARAM_TOKENS.has(name)) {
          paramNames.add(name)
        }
        return ''
      },
    )
  }

  htmlEscaped.replace(RE.funcParamsDecl, (_m, _open, inside) => {
    extractParams(inside)
    return ''
  })
  htmlEscaped.replace(RE.arrowParamsParen, (_m, inside) => {
    extractParams(inside)
    return ''
  })
  htmlEscaped.replace(RE.arrowParamSingle, (_m, name) => {
    if (!RESERVED_PARAM_TOKENS.has(name)) {
      paramNames.add(name)
    }
    return ''
  })

  const src = htmlEscaped
  const segs: string[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(RE.token)
  while ((m = re.exec(src)) !== null) {
    const idx = m.index
    if (idx > last) {
      let plain = src.slice(last, idx)
      plain = applyPlainHighlight(plain)
      for (const name of paramNames) {
        plain = plain.replace(RE.paramUsage(name), COLOR.paramName(name))
      }
      segs.push(plain)
    }
    const token = m[0]
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
      segs.push(token)
    }
    last = re.lastIndex
  }
  if (last < src.length) {
    let plain = src.slice(last)
    plain = applyPlainHighlight(plain)
    for (const name of paramNames) {
      plain = plain.replace(RE.paramUsage(name), COLOR.paramName(name))
    }
    segs.push(plain)
  }
  return segs.join('')
}

export function transformJs(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  const highlighted = highlightSimpleJs(escaped)
  return wrapLines(highlighted)
}
