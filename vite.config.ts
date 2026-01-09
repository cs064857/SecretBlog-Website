import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 載入環境變數
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL

  return {
    plugins: [vue()],
    server: {
      port: 51733,
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
        // 將網站地圖 SEO 端點代理到 Gateway
        '/sitemap.xml': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
        '/robots.txt': {
          target: apiBaseUrl,
          changeOrigin: true,
        }
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
