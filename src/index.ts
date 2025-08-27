import type { App } from 'vue'

// 自动生成导入
import VThemeToggle from './components/ThemeToggle/index.vue'

import './styles/main.scss'

const components = [VThemeToggle] as const

const install = (app: App): void => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

const version = '1.0.6'

const VoidDesignVue = { install, version }

export { VThemeToggle }
export * from './components'
export { install, version }
export default VoidDesignVue