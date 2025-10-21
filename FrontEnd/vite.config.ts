import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Thêm dòng này:
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173
  }
})
