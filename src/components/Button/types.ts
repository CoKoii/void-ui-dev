export type ButtonType = 'primary' | 'success' | 'danger' | 'warning' | 'info'
export type ButtonSize = 'large' | 'small'
export type NativeType = 'button' | 'submit' | 'reset'
export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  nativeType?: NativeType
  plain?: boolean
  round?: boolean
  circle?: boolean
  disabled?: boolean
  autofocus?: boolean
  color?: string
}
export interface ButtonInstance {
  ref: HTMLButtonElement
}
