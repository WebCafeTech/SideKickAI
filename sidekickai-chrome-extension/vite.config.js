import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Chrome extension
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Faster than terser
    cssMinify: true,
    rollupOptions: {
      input: {
        sidebar: resolve(__dirname, 'sidebar.html'),
        options: resolve(__dirname, 'options.html')
      },
      output: {
        // Optimize chunk splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        },
        // Reduce chunk size warnings
        chunkSizeWarningLimit: 1000
      }
    },
    // Optimize build performance
    target: 'es2015',
    sourcemap: false, // Disable sourcemaps in production for faster builds
    reportCompressedSize: false // Faster builds
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: false // Disable error overlay for faster HMR
    }
  },
  // For dev mode, Vite will automatically detect HTML files in root
  // Access sidebar at http://localhost:5173/sidebar.html
  // Access options at http://localhost:5173/options.html
})
