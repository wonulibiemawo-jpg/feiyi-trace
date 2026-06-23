import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署配置
  // 如果你的仓库名是 feiyi-trace，则 base 为 '/feiyi-trace/'
  // 如果使用自定义域名或 username.github.io 仓库，改为 '/'
  base: '/feiyi-trace/',
})
