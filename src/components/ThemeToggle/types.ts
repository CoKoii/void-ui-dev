export type Theme = string

export interface ThemeToggleEmits {
  'theme-change': [theme: string]
}

export interface ThemeToggleProps {
  // 浅色主题名称
  lightTheme?: string
  // 深色主题名称
  darkTheme?: string
  // 主题键
  themeKey?: string
  // 是否持久化主题
  persistent?: boolean
  // 是否遵循系统主题
  followSystem?: boolean
  // 动画持续时间
  duration?: number
  // 动画缓动函数
  easing?: string
  // 最大圆形半径（半径过大页面帧率可能下降，超过设定阈值的时跳过动画直接切换）
  maxRadius?: number
  // 本地存储键
  storageKey?: string
  // 无障碍标签
  ariaLabel?: string
  // 是否在初始化时触发 theme-change
  emitInitial?: boolean
  // 遵从系统的减少动画偏好
  respectReducedMotion?: boolean
}
