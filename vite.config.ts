import { defineConfig } from 'vite'

export default defineConfig({
  root: 'examples',
  server: {
    port: 5173,
    proxy: {
      '/blog': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true,
      },
      '/landing': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
