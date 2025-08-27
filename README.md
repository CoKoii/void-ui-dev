# Void Design Vue

一个基于 Vue 3 的轻量级 UI 组件库。

## 安装

```bash
npm install void-design-vue
# 或
pnpm add void-design-vue
# 或
yarn add void-design-vue
```

## 完整引入

```typescript
import { createApp } from 'vue'
import { install } from 'void-design-vue'
import 'void-design-vue/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(install)
app.mount('#app')
```

## 按需引入

```typescript
import { VButton, VThemeToggle } from 'void-design-vue'
import 'void-design-vue/dist/style.css'

// 在组件中使用
export default {
  components: {
    VButton,
    VThemeToggle,
  },
}
```

## 组件列表

### VButton

基础按钮组件

```vue
<template>
  <VButton>点击我</VButton>
</template>
```

### VThemeToggle

主题切换组件，支持明暗主题切换

```vue
<template>
  <VThemeToggle><VButton>点击我</VButton></VThemeToggle>
</template>
```

#### Props

| 属性名       | 类型    | 默认值        | 说明                 |
| ------------ | ------- | ------------- | -------------------- |
| lightTheme   | string  | 'light'       | 浅色主题名称         |
| darkTheme    | string  | 'dark'        | 深色主题名称         |
| persistent   | boolean | false         | 是否持久化主题设置   |
| followSystem | boolean | false         | 是否跟随系统主题     |
| duration     | number  | 450           | 切换动画持续时间(ms) |
| easing       | string  | 'ease-in-out' | 切换动画缓动函数     |

## TypeScript 支持

本库完全支持 TypeScript，包含完整的类型定义。

```typescript
import type { ThemeToggleProps, ThemeToggleEmits } from 'void-design-vue'
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建库
pnpm build:lib

# 类型检查
pnpm type-check

# 测试
pnpm test:unit
```

## License

MIT
