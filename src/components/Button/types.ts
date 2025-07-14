export type ButtonType = 'primary' | 'success' | 'danger' | 'warning'
export type ButtonSize = 'large' | 'small'
export type NativeType = 'button' | 'submit' | 'reset'
export type ButtonBorder = 'solid' | 'dashed' | 'dotted' | 'link'
export type ButtonShape = 'default' | 'round' | 'circle'
export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  nativeType?: NativeType
  border?: ButtonBorder
  shape?: ButtonShape
  round?: boolean
  circle?: boolean
  disabled?: boolean
  autofocus?: boolean
  color?: string
}
export interface ButtonInstance {
  ref: HTMLButtonElement
}
