import type { App } from 'vue'
import { version } from './version'

// 组件导入
import VThemeToggle from './components/ThemeToggle/index.vue'

// 样式导入
import './styles/main.scss'

// 组件列表
const components = [VThemeToggle] as const

// 安装函数
const install = (app: App): void => {
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 默认导出
const VoidDesignVue = { install, version }

// 组件导出
export { VThemeToggle }

// 类型导出
export * from './components'

// 插件导出
export { install, version }
export default VoidDesignVue