import { ref } from 'vue'

export function useClick() {
  const ripples = ref<{ id: number; borderRadius: string }[]>([])
  let id = 0

  const ButtonClick = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement
    const computedStyle = window.getComputedStyle(button)
    const borderRadius = computedStyle.borderRadius

    const rippleId = id++
    ripples.value.push({ id: rippleId, borderRadius })

    setTimeout(() => {
      ripples.value = ripples.value.filter((r) => r.id !== rippleId)
    }, 300)
  }

  return { ripples, ButtonClick }
}
