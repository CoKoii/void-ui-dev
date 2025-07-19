import { ref } from 'vue'

export function useClick() {
  const ripples = ref<number[]>([])
  let id = 0
  const ButtonClick = () => {
    const rippleId = id++
    ripples.value.push(rippleId)
    setTimeout(() => {
      const index = ripples.value.indexOf(rippleId)
      if (index > -1) ripples.value.splice(index, 1)
    }, 300)
  }

  return { ripples, ButtonClick }
}
