import { ref } from 'vue'

export function useClick() {
  const ripples = ref<{ id: number }[]>([])
  let id = 0
  const ButtonClick = () => {
    const rippleId = id++
    ripples.value.push({ id: rippleId })
    setTimeout(() => {
      ripples.value = ripples.value.filter((r) => r.id !== rippleId)
    }, 300)
  }
  return { ripples, ButtonClick }
}
