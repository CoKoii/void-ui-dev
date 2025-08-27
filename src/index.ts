import type { App } from 'vue'
import VButton from './components/Button/index.vue'
import VThemeToggle from './components/ThemeToggle/index.vue'

// 导入样式
import './styles/main.scss'

// 所有组件列表
const components = [VButton, VThemeToggle]

// 定义 install 方法，接收 Vue 实例作为参数
const install = (app: App): void => {
  // 注册所有组件
  components.forEach((component) => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 版本号
const version = '1.0.0'

// 导出单个组件
export { VButton, VThemeToggle }

// 重新导出所有组件和类型，支持按需导入
export * from './components'

// 导出安装方法和版本号
export { install, version }

// 导出组件类型
export type { ThemeToggleProps, ThemeToggleEmits } from './components/ThemeToggle/types'
