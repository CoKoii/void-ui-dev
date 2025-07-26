export type ButtonType = 'primary' | 'secondary' | 'outline'
export type ButtonShape = 'round' | 'circle' | 'square'
export type ButtonStatus = 'primary' | 'success' | 'warning' | 'danger'
export type ButtonSize = 's' | 'm' | 'l' | 'xl'
export interface ButtonProps {
  type?: ButtonType
  shape?: ButtonShape
  status?: ButtonStatus
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  long?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}
