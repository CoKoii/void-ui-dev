import { computed } from 'vue'
import type { ButtonProps } from '../types'
export const useColorHook = (props: Readonly<ButtonProps>) => {
  const computedColor = computed(() => {
    if (props.color) return props.color
    switch (props.type) {
      case 'primary':
        return 'var(--blue-6)'
      case 'success':
        return 'var(--green-6)'
      case 'warning':
        return 'var(--orange-6)'
      case 'danger':
        return 'var(--red-6)'
      default:
        return false
    }
  })
  return computedColor
}
