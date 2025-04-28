/*
 * @Author      : ZhouQiJun
 * @Date        : 2025-04-28 20:41:33
 * @LastEditors : ZhouQiJun
 * @LastEditTime: 2025-04-28 20:43:17
 * @Description : vite 配置
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
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
      // 指定组件库入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyUI', // 全局变量名（UMD 格式需要）
      fileName: (format) => `my-ui.${format}.js`, // 输出文件名
    },
    rollupOptions: {
      // 确保外部化处理不想打包进库的依赖
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // 在 UMD 格式中为外部依赖提供全局变量
        },
      },
    },
  },
})
