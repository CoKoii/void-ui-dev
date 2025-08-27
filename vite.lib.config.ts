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
      fileName: (format) =>
        `void-design-vue.${format === 'es' ? 'js' : format === 'cjs' ? 'umd.cjs' : format}`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
        // 使用命名导出以避免警告
        exports: 'named',
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 移除 additionalData，避免与 @use 规则冲突
      },
    },
  },
})
