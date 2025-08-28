<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import type { ThemeToggleProps, ThemeToggleEmits } from './types'

interface ViewTransition {
  ready: Promise<void>
  finished: Promise<void>
}

defineOptions({ name: 'VThemeToggle' })

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  lightTheme: 'light',
  darkTheme: 'dark',
  persistent: false,
  followSystem: true,
  themeKey: 'data-theme',
  duration: 450,
  easing: 'ease-in-out',
  storageKey: 'theme',
  ariaLabel: '切换主题',
  emitInitial: true,
  respectReducedMotion: true,
})

const emit = defineEmits<ThemeToggleEmits>()

let root: HTMLElement | null = null
const currentTheme = ref<string>('')

const isSystemDark = ref(false)
let mediaQuery: MediaQueryList | null = null
let reduceMotionQuery: MediaQueryList | null = null
let storageCache: string | null = null
let themeObserver: MutationObserver | null = null

const getStoredTheme = (): string | null => {
  if (!props.persistent) return null
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(props.storageKey) : null
  } catch {
    return null
  }
}
const scheduleWrite = (fn: () => void) => {
  const ri = (
    globalThis as typeof globalThis & { requestIdleCallback?: (cb: () => void) => number }
  ).requestIdleCallback
  if (ri) ri(() => fn())
  else setTimeout(fn, 0)
}
const setStoredTheme = (theme: string) => {
  if (!props.persistent) return
  storageCache = theme
  scheduleWrite(() => {
    try {
      if (storageCache && typeof window !== 'undefined')
        window.localStorage.setItem(props.storageKey, storageCache)
    } catch {}
  })
}
const removeStoredTheme = () => {
  if (!props.persistent) return
  try {
    if (typeof window !== 'undefined') window.localStorage.removeItem(props.storageKey)
  } catch {}
}

const getTheme = (): string => {
  const domTheme = root?.getAttribute(props.themeKey)
  if (domTheme) {
    currentTheme.value = domTheme
    return domTheme
  }
  return currentTheme.value
}

// 响应式计算属性
const isDarkTheme = computed(() => currentTheme.value === props.darkTheme)

const syncColorScheme = (theme: string) => {
  if (!root) return
  const isDark = theme === props.darkTheme
  ;(root.style as CSSStyleDeclaration & { colorScheme?: string }).colorScheme = isDark
    ? 'dark'
    : 'light'
}

const setTheme = (next: string) => {
  currentTheme.value = next
  if (root) root.setAttribute(props.themeKey, next)
  syncColorScheme(next)

  if (!props.followSystem) {
    setStoredTheme(next)
  }

  emit('theme-change', next)
}

const getInitialTheme = (): string => {
  const domTheme = root?.getAttribute(props.themeKey)
  if (domTheme) return domTheme
  if (props.followSystem) {
    return isSystemDark.value ? props.darkTheme : props.lightTheme
  }
  const stored = getStoredTheme()
  if (stored) return stored
  return props.lightTheme
}

const getNextTheme = (): string =>
  getTheme() === props.darkTheme ? props.lightTheme : props.darkTheme

const getPoint = (e?: MouseEvent | PointerEvent) => ({
  x: e?.clientX ?? (typeof innerWidth !== 'undefined' ? innerWidth / 2 : 0),
  y: e?.clientY ?? (typeof innerHeight !== 'undefined' ? innerHeight / 2 : 0),
})
const calcRadius = (x: number, y: number) =>
  Math.hypot(
    Math.max(x, (typeof innerWidth !== 'undefined' ? innerWidth : 0) - x),
    Math.max(y, (typeof innerHeight !== 'undefined' ? innerHeight : 0) - y),
  )

let animating = false
const shouldReduceMotion = () => props.respectReducedMotion && !!reduceMotionQuery?.matches

const toggleTheme = async (e?: MouseEvent | PointerEvent) => {
  if (animating) return
  const next = getNextTheme()

  if (shouldReduceMotion() || !('startViewTransition' in document)) return setTheme(next)

  animating = true
  const { x, y } = getPoint(e)
  const r = calcRadius(x, y)

  if (props.maxRadius && r > props.maxRadius) {
    setTheme(next)
    animating = false
    return
  }

  try {
    const vt = (
      document as Document & { startViewTransition: (callback: () => void) => ViewTransition }
    ).startViewTransition(() => setTheme(next))
    await vt.ready

    await root
      ?.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: props.duration,
          easing: props.easing,
          pseudoElement: '::view-transition-new(root)',
        },
      )
      .finished.catch(() => {})
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

const handleDocumentThemeChange = () => {
  if (!root) return
  const domTheme = root.getAttribute(props.themeKey)
  if (domTheme && domTheme !== currentTheme.value) {
    currentTheme.value = domTheme
    syncColorScheme(domTheme)
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

onMounted(() => {
  root = document.documentElement as HTMLElement
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  isSystemDark.value = !!mediaQuery.matches

  const initial = getInitialTheme()
  const domTheme = root.getAttribute(props.themeKey)
  if (domTheme && domTheme === initial) {
    currentTheme.value = domTheme
    syncColorScheme(domTheme)
    if (props.emitInitial) emit('theme-change', domTheme)
  } else {
    setTheme(initial)
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === props.themeKey) {
        handleDocumentThemeChange()
      }
    })
  })

  themeObserver.observe(root, {
    attributes: true,
    attributeFilter: [props.themeKey],
  })
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', handleSystemThemeChange)
  themeObserver?.disconnect()
  themeObserver = null
})

defineExpose({
  currentTheme,
  toggleTheme,
  setTheme,
})
</script>

<template>
  <button
    class="VThemeToggle"
    type="button"
    role="switch"
    :aria-checked="isDarkTheme"
    :aria-label="props.ariaLabel"
    @click="toggleTheme($event)"
  >
    <slot>
      <span>{{ isDarkTheme ? '🌛' : '🌞' }}</span>
    </slot>
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
