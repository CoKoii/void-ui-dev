import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VoidDesignVue',
      fileName: (format) => {
        const formatMap = {
          es: 'js',
          cjs: 'umd.cjs',
          umd: 'umd.cjs',
        }
        return `void-design-vue.${formatMap[format] || format}`
      },
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // 外部化依赖，减少包体积
      external: ['vue', 'ant-design-vue', '@ant-design/colors'],
      output: {
        // UMD 构建的全局变量映射
        globals: {
          vue: 'Vue',
          'ant-design-vue': 'antd',
          '@ant-design/colors': 'AntDesignColors',
        },
        // 使用命名导出
        exports: 'named',
        // 优化资源文件名
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'style.css'
          }
          return assetInfo.name || 'assets/[name]-[hash][extname]'
        },
      },
    },
    // 禁用 CSS 代码分割，确保样式打包到一个文件
    cssCodeSplit: false,
    sourcemap: true,
    // 启用压缩但不使用 terser（避免额外依赖）
    minify: 'esbuild',
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 移除 additionalData，避免与 @use 规则冲突
      },
    },
  },
})
