import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from "path"


export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 确保路径别名正确
    },
    extensions: ['.js', '.ts', '.vue'] // 确保支持 `.vue` 文件[^76^]
  }
})
