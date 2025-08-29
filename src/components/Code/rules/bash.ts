import { escapeHtml, wrapLines } from './index'

const COLOR = {
  comment: '<span style="color: #7DFCF4;">$&</span>',
  string: '<span style="color: #9ECBFF;">$&</span>',
  var: '<span style="color: #FFD866;">$&</span>',
  flag: '<span style="color: #B392F0;">$&</span>',
  cmd: (_pre: string, name: string) =>
    `${_pre}<span style=\"color: #ff6b6b; font-weight: 600;\">${name}</span>`,
  subshell: '<span style="color: #B392F0;">$&</span>',
  path: '<span style="color: #9ECBFF;">$&</span>',
}

const RE = {
  token: /"(?:[^"\\]|\\.)*"|'[^']*'|`[^`]*`|(^|[\s;])#[^\n\r]*/g,
  stringsOnly: /(\"(?:[^\"\\]|\\.)*\")|('[^']*')|(`[^`]*`)/g,
  // Variables: $FOO, ${FOO}, $1
  variable: /\$\{[^}]+\}|\$[a-zA-Z_][a-zA-Z0-9_]*|\$[0-9]+/g,
  flag: /(?<=^|\s)(?:--[a-zA-Z0-9][a-zA-Z0-9-]*\b(?:=[^\s]+)?|-{1}[a-zA-Z]+\b)(?=\s|$)/g,
  // Subshells: $(...), $((...))
  subshell: /\$\([^\)]*\)|\$\(\([^)]*\)\)/g,
  path: /(?<=^|\s)(?:\.{1,2}\/[^\s]+|\/[\w@.\-\/]+|[\w@.\-]+\/[\w@.\-\/]+)(?=\s|$)/g,
}

const FRONTEND_COMMANDS = [
  'npm',
  'pnpm',
  'yarn',
  'npx',
  'pnpx',
  'bun',
  'bunx',
  'corepack',
  'node',
  'deno',
  'tsx',
  'git',
  'gh',
  'vite',
  'vitepress',
  'vue',
  'nuxt',
  'next',
  'astro',
  'svelte',
  'ng',
  'qwik',
  'rollup',
  'webpack',
  'parcel',
  'tsc',
  'eslint',
  'prettier',
  'vitest',
  'jest',
  'sudo',
  'cd',
  'ls',
  'cat',
  'echo',
  'export',
  'unset',
  'pwd',
  'mkdir',
  'rm',
  'mv',
  'cp',
  'touch',
]

const CMD_RE = new RegExp(
  `(^|[\\s;|&])(${FRONTEND_COMMANDS.map((c) => c.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})(?=\\s|$)`,
  'g',
)

function highlightPlainBash(s: string): string {
  let out = s
  out = out.replace(RE.variable, COLOR.var)
  out = out.replace(RE.subshell, COLOR.subshell)
  out = out.replace(CMD_RE, (_m, pre: string, name: string) => COLOR.cmd(pre, name))
  out = out.replace(RE.flag, COLOR.flag)
  out = out.replace(RE.path, COLOR.path)
  return out
}

export function transformBash(code: string): string {
  const trimmed = code.trim()
  const escaped = escapeHtml(trimmed)

  const segs: string[] = []
  let last = 0
  const re = new RegExp(RE.token)

  while (true) {
    const m = re.exec(escaped)
    if (!m) break
    const idx = m.index
    if (idx > last) segs.push(highlightPlainBash(escaped.slice(last, idx)))

    const token = m[0]
    if (/#/.test(token) && (m[1] !== undefined || token.startsWith('#'))) {
      if (m[1]) {
        const prefix = m[1]
        const content = token.slice(prefix.length)
        segs.push(prefix + COLOR.comment.replace('$&', content))
      } else {
        segs.push(COLOR.comment.replace('$&', token))
      }
    } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
      segs.push(
        token.replace(RE.stringsOnly, (_m, g1, g2, g3) => {
          const strContent = g1 || g2 || g3
          return `<span style=\"color: #9ECBFF;\">${strContent}</span>`
        }),
      )
    } else {
      segs.push(token)
    }
    last = re.lastIndex
  }

  if (last < escaped.length) segs.push(highlightPlainBash(escaped.slice(last)))
  return wrapLines(segs.join(''))
}
