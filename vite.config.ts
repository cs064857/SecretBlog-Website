import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 51733,
    proxy: {
      '/api': {
        target: 'http://localhost:88',
        changeOrigin: true,
      },
      // 將網站地圖 SEO 端點代理到 Gateway
      '/sitemap.xml': {
        target: 'http://localhost:88',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:88',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
