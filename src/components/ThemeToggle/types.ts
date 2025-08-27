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
}
