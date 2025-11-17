import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Chrome extension
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        sidebar: resolve(__dirname, 'sidebar.html'),
        options: resolve(__dirname, 'options.html')
      }
    }
  },
  // For dev mode, Vite will automatically detect HTML files in root
  // Access sidebar at http://localhost:5173/sidebar.html
  // Access options at http://localhost:5173/options.html
})
