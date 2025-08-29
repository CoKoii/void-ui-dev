import { escapeHtml, wrapLines } from './index'

const COLOR = {
  colorTokenBg: (hex: string) => {
    const textColor =
      hex.toLowerCase() === '#000000' || hex.toLowerCase() === '#000' ? '#ffffff' : '#000000'
    return `<span style="color: ${textColor}; background-color: ${hex}; padding: 2px 4px; border-radius: 3px;">${hex}</span>`
  },
  string: '<span style="color: #9ECBFF;">$&</span>',
  comment: '<span style="color: #7DFCF4; font-weight: bold; letter-spacing: 1px;">$&</span>',
  varName: (kw: string, name: string) => `${kw} <span style="color: #9ECBFF;">${name}</span>`,
  keyword: '<span style="color: #ff6b6b; font-weight: 600;">$1</span>',
  funcName: '<span style="color: #B392F0;">$1</span>(',
  paramName: (name: string) => `<span style="color: #FFD866;">${name}</span>`,
  regex: '<span style="color: #F97583;">$&</span>',
}

const RE = {
  colorHex: /(#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}))\b/g,
  token:
    /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/[^\n\r]*(?![gimsuxy])|\/\*[\s\S]*?\*\/|\/(?![*\/])(?:[^\/\n\r]|\\.)*\/[gimsuy]*/g,
  strOrComment: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/[^\n\r]*|\/\*[\s\S]*?\*\//g,
  stringsOnly: /("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')/g,
  commentsOnly: /(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)/g,
  varDecl: /\b(const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
  keywords:
    /\b(import|from|function|export|const|return|let|var|async|await|type|as|default|for|of|if|while|switch|catch|with|typeof|delete|new|in|else|try|finally|break|continue|class|extends|implements|interface|throw|instanceof)\b/g,
  funcNameCall:
    /\b(?!(?:if|for|while|switch|catch|with|return|typeof|delete|new)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
  funcParamsDecl: /\b(function\s*\*?\s*(?:[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\()([^)]*)(\))/g,
  arrowParamsParen: /\(([^)]*)\)(\s*=>)/g,
  arrowParamSingle: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(=>)/g,
  paramUsage: (name: string) => new RegExp(`\\b(?<!\\.|:)\\s*${name}\\b(?!\\s*[:=])`, 'g'),
  regexPattern: /\/(?![*\/])(?:[^\/\n\r\\]|\\.)+\/[gimsuy]*/g,
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

function applyGlobalHighlights(s: string): string {
  let out = s
  out = out.replace(RE.colorHex, (_m, hex: string) => COLOR.colorTokenBg(hex))
  out = out.replace(RE.varDecl, (_m, kw: string, name: string) => COLOR.varName(kw, name))
  out = out.replace(RE.keywords, COLOR.keyword)
  out = out.replace(RE.funcNameCall, COLOR.funcName)
  return out
}

function applyGlobalHighlightsAvoidingSpans(s: string): string {
  const parts: string[] = []
  let lastIndex = 0
  const spanRegex = /<span[^>]*>.*?<\/span>/g
  let match: RegExpExecArray | null

  while ((match = spanRegex.exec(s)) !== null) {
    if (match.index > lastIndex) {
      const beforeSpan = s.substring(lastIndex, match.index)
      parts.push(applyGlobalHighlights(beforeSpan))
    }
    parts.push(match[0])
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < s.length) {
    const remaining = s.substring(lastIndex)
    parts.push(applyGlobalHighlights(remaining))
  }

  return parts.join('')
}

function findMatchingBrace(code: string, start: number): number {
  let count = 1
  for (let j = start + 1; j < code.length; j++) {
    if (code[j] === '{') count++
    else if (code[j] === '}') {
      count--
      if (count === 0) return j
    }
  }
  return code.length
}

function findExpressionEnd(code: string, start: number): number {
  let count = 0
  for (let j = start; j < code.length; j++) {
    const c = code[j]
    if (c === '(' || c === '[' || c === '{') count++
    else if (c === ')' || c === ']' || c === '}') {
      count--
      if (count < 0) return j
    } else if (count === 0 && (c === ';' || c === ',' || c === '\n')) {
      return j
    }
  }
  return code.length
}

function extractParams(list: string, paramNames: Set<string>): void {
  if (!list || !list.trim()) return
  list.replace(
    /(?:^|[,({[]\s*)(?:(?:public|private|protected|readonly|override)\s+)*([a-zA-Z_$][a-zA-Z0-9_$]*)/g,
    (_m, name) => {
      if (!RESERVED_PARAM_TOKENS.has(name)) paramNames.add(name)
      return ''
    },
  )
}

function highlightPlain(plain: string, paramNames: Set<string>): string {
  const output: string[] = []
  let i = 0
  while (i < plain.length) {
    RE.funcParamsDecl.lastIndex = i
    const mFunc = RE.funcParamsDecl.exec(plain)
    RE.arrowParamsParen.lastIndex = i
    const mArrowParen = RE.arrowParamsParen.exec(plain)
    RE.arrowParamSingle.lastIndex = i
    const mArrowSingle = RE.arrowParamSingle.exec(plain)
    const matches = [mFunc, mArrowParen, mArrowSingle].filter(
      (m): m is RegExpExecArray => m !== null,
    )
    if (!matches.length) {
      let remaining = plain.slice(i)
      remaining = applyGlobalHighlights(remaining)
      for (const name of paramNames) {
        remaining = remaining.replace(RE.paramUsage(name), COLOR.paramName(name))
      }
      output.push(remaining)
      break
    }
    matches.sort((a, b) => a.index - b.index)
    const m = matches[0]
    const start = m.index
    if (start > i) {
      let before = plain.slice(i, start)
      before = applyGlobalHighlights(before)
      for (const name of paramNames) {
        before = before.replace(RE.paramUsage(name), COLOR.paramName(name))
      }
      output.push(before)
    }
    let header: string
    let bodyStart = m.index + m[0].length
    const newParams = new Set(paramNames)
    if (m === mFunc) {
      const open = m[1]
      const inside = m[2]
      const close = m[3]
      extractParams(inside, newParams)
      header = open + highlightParamList(inside) + close
    } else if (m === mArrowParen) {
      const inside = m[1]
      const after = m[2]
      extractParams(inside, newParams)
      header = `(${highlightParamList(inside)})${after}`
    } else {
      const name = m[1]
      const arrow = m[2]
      if (!RESERVED_PARAM_TOKENS.has(name)) newParams.add(name)
      header = COLOR.paramName(name) + arrow
    }
    const wsRe = /\s*/g
    wsRe.lastIndex = bodyStart
    wsRe.exec(plain)
    bodyStart = wsRe.lastIndex
    let bodyEnd: number
    let highlightedBody: string
    if (bodyStart < plain.length && plain[bodyStart] === '{') {
      const bracePos = bodyStart
      bodyStart++
      bodyEnd = findMatchingBrace(plain, bracePos)
      const body = plain.slice(bodyStart, bodyEnd)
      highlightedBody = highlightPlain(body, newParams)
      output.push(applyGlobalHighlightsAvoidingSpans(header) + '{' + highlightedBody + '}')
      i = bodyEnd + 1
    } else {
      bodyEnd = findExpressionEnd(plain, bodyStart)
      const body = plain.slice(bodyStart, bodyEnd)
      highlightedBody = highlightPlain(body, newParams)
      output.push(applyGlobalHighlightsAvoidingSpans(header) + highlightedBody)
      i = bodyEnd
    }
  }
  return output.join('')
}

function highlightSimpleJs(htmlEscaped: string): string {
  const src = htmlEscaped
  const segs: string[] = []
  let last = 0
  const re = new RegExp(RE.token)

  while (true) {
    const m = re.exec(src)
    if (!m) break
    const idx = m.index
    if (idx > last) segs.push(highlightPlain(src.slice(last, idx), new Set()))

    const token = m[0]

    if ((token.startsWith('//') && !token.match(/\/\/[gimsuxy]*$/)) || token.startsWith('/*')) {
      segs.push(COLOR.comment.replace('$&', token))
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
    } else if (
      token.startsWith('/') &&
      !token.startsWith('//') &&
      !token.startsWith('/*') &&
      token.match(/^\/(?![*\/])(?:[^\/\n\r\\]|\\.)*\/[gimsuy]*$/)
    ) {
      segs.push(COLOR.regex.replace('$&', token))
    } else {
      segs.push(token)
    }
    last = re.lastIndex
  }

  if (last < src.length) segs.push(highlightPlain(src.slice(last), new Set()))
  return segs.join('')
}

export function transformJs(code: string): string {
  const trimmedCode = code.trim()
  const escaped = escapeHtml(trimmedCode)
  const highlighted = highlightSimpleJs(escaped)
  return wrapLines(highlighted)
}
