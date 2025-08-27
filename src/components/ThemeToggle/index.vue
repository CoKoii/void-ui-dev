<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { ThemeToggleProps, ThemeToggleEmits } from './types'

defineOptions({ name: 'VThemeToggle' })

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  lightTheme: 'light',
  darkTheme: 'dark',
  persistent: false,
  followSystem: false,
  duration: 480,
  easing: 'ease-in-out',
})

const emit = defineEmits<ThemeToggleEmits>()

const root = document.documentElement as HTMLElement
const currentTheme = ref<string>('')
const isSystemDark = ref(false)
const storageKey = 'theme'

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

const getStoredTheme = (): string | null => {
  if (!props.persistent) return null
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

const setStoredTheme = (theme: string) => {
  if (!props.persistent) return
  try {
    localStorage.setItem(storageKey, theme)
  } catch {}
}

const removeStoredTheme = () => {
  if (!props.persistent) return
  try {
    localStorage.removeItem(storageKey)
  } catch {}
}

const getInitialTheme = (): string => {
  if (props.followSystem) {
    return isSystemDark.value ? props.darkTheme : props.lightTheme
  }

  const stored = getStoredTheme()
  if (stored) return stored

  return props.lightTheme
}

const getTheme = (): string => currentTheme.value

const setTheme = (next: string) => {
  currentTheme.value = next
  root.setAttribute('data-theme', next)

  if (!props.followSystem) {
    setStoredTheme(next)
  }

  emit('theme-change', next)
}

const getPoint = (e?: MouseEvent | PointerEvent) => ({
  x: e?.clientX ?? innerWidth / 2,
  y: e?.clientY ?? innerHeight / 2,
})

const calcRadius = (x: number, y: number) =>
  Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

const getNextTheme = (): string => {
  const current = getTheme()
  return current === props.darkTheme ? props.lightTheme : props.darkTheme
}

let animating = false

const toggleTheme = async (e?: MouseEvent | PointerEvent) => {
  if (animating) return

  const next = getNextTheme()

  if (!document.startViewTransition) return setTheme(next)

  animating = true
  const { x, y } = getPoint(e)
  const r = calcRadius(x, y)

  try {
    const vt = document.startViewTransition(() => setTheme(next))
    await vt.ready
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        root
          .animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
            {
              duration: props.duration,
              easing: props.easing,
              pseudoElement: '::view-transition-new(root)',
            },
          )
          .finished.then(
            () => resolve(),
            () => resolve(),
          )
      })
    })
  } finally {
    animating = false
  }
}

const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  isSystemDark.value = e.matches
  if (props.followSystem) {
    const newTheme = e.matches ? props.darkTheme : props.lightTheme
    setTheme(newTheme)
  }
}

watch(
  () => props.followSystem,
  (newVal) => {
    if (newVal) {
      removeStoredTheme()
      const systemTheme = isSystemDark.value ? props.darkTheme : props.lightTheme
      setTheme(systemTheme)
    } else {
      setStoredTheme(currentTheme.value)
    }
  },
)

defineExpose({
  currentTheme: computed(() => currentTheme.value),
  toggleTheme,
  setTheme,
})

onMounted(() => {
  isSystemDark.value = mediaQuery.matches
  const initialTheme = getInitialTheme()
  setTheme(initialTheme)
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})
</script>

<template>
  <button class="VThemeToggle" type="button" @click="toggleTheme($event)" aria-label="切换主题">
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use './style.scss';
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
</style>
