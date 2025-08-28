<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { ThemeToggleProps, ThemeToggleEmits } from './types'

defineOptions({ name: 'VThemeToggle' })

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  lightTheme: 'light',
  darkTheme: 'dark',
  persistent: false,
  followSystem: true,
  duration: 450,
  easing: 'ease-in-out',
  storageKey: 'theme',
  ariaLabel: '切换主题',
  emitInitial: true,
  respectReducedMotion: true,
})

const emit = defineEmits<ThemeToggleEmits>()

// SSR 安全：仅在客户端初始化 root、媒体查询
let root: HTMLElement | null = null
const currentTheme = ref<string>('')

const isSystemDark = ref(false)
let mediaQuery: MediaQueryList | null = null
let reduceMotionQuery: MediaQueryList | null = null
let storageCache: string | null = null

const getStoredTheme = (): string | null => {
  if (!props.persistent) return null
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(props.storageKey) : null
  } catch {
    return null
  }
}
const scheduleWrite = (fn: () => void) => {
  const ri = (globalThis as any).requestIdleCallback as
    | ((cb: () => void) => number)
    | undefined
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
  const domTheme = root?.getAttribute('data-theme')
  if (domTheme) {
    currentTheme.value = domTheme
    return domTheme
  }
  return currentTheme.value
}

const syncColorScheme = (theme: string) => {
  if (!root) return
  const isDark = theme === props.darkTheme
  // 同步原生滚动条/表单控件的配色
  ;(root.style as any).colorScheme = isDark ? 'dark' : 'light'
}

const setTheme = (next: string) => {
  currentTheme.value = next
  if (root) root.setAttribute('data-theme', next)
  syncColorScheme(next)

  if (!props.followSystem) {
    setStoredTheme(next)
  }

  emit('theme-change', next)
}

const getInitialTheme = (): string => {
  // 1) DOM 已有 data-theme 优先
  const domTheme = root?.getAttribute('data-theme')
  if (domTheme) return domTheme
  // 2) 跟随系统（与现有语义保持一致：此时忽略存储）
  if (props.followSystem) {
    return isSystemDark.value ? props.darkTheme : props.lightTheme
  }
  // 3) 本地存储
  const stored = getStoredTheme()
  if (stored) return stored
  // 4) 回退默认浅色
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

  // 无动画环境或不支持视图转换，直接切换
  if (shouldReduceMotion() || !(document as any).startViewTransition) return setTheme(next)

  animating = true
  const { x, y } = getPoint(e)
  const r = calcRadius(x, y)

  if (props.maxRadius && r > props.maxRadius) {
    setTheme(next)
    animating = false
    return
  }

  try {
    const vt = (document as any).startViewTransition(() => setTheme(next))
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
  // 初始化 DOM 与媒体查询（仅在客户端）
  root = document.documentElement as HTMLElement
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  isSystemDark.value = !!mediaQuery.matches

  // 若 light/dark 名称相同，开发环境下警告
  if ((import.meta as any)?.env?.DEV && props.lightTheme === props.darkTheme) {
    console.warn('[VThemeToggle] lightTheme 和 darkTheme 相同，无法切换。')
  }

  const initial = getInitialTheme()
  // 如果 DOM 已有主题且等于 initial，就只同步 color-scheme；否则设置并派发事件
  const domTheme = root.getAttribute('data-theme')
  if (domTheme && domTheme === initial) {
    currentTheme.value = domTheme
    syncColorScheme(domTheme)
    if (props.emitInitial) emit('theme-change', domTheme)
  } else {
    setTheme(initial)
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', handleSystemThemeChange)
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
    :aria-checked="getTheme() === props.darkTheme"
    :aria-label="props.ariaLabel"
    @click="toggleTheme($event)"
  >
    <slot>
      <span class="VThemeToggle__label" style="--vtheme-color: var(--v-color-primary)">切换主题</span>
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
