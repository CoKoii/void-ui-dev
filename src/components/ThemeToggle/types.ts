export type Theme = string

export interface ThemeToggleEmits {
  'theme-change': [theme: string]
}

export interface ThemeToggleProps {
  lightTheme?: string
  darkTheme?: string
  persistent?: boolean
  followSystem?: boolean
  duration?: number
  easing?: string
  maxRadius?: number
  /** 本地存储键（默认 'theme'） */
  storageKey?: string
  /** 无障碍标签（默认 '切换主题'） */
  ariaLabel?: string
  /** 是否在初始化时触发 theme-change（默认 true） */
  emitInitial?: boolean
  /** 遵从系统的减少动画偏好（默认 true） */
  respectReducedMotion?: boolean
}
