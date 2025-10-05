import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitLab Pages (adjust if your repo name is different)
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: true,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  
  // Development server
  server: {
    port: 3000,
    open: true,
    host: true
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true
  },
  
  // Ensure proper MIME types for assets
  optimizeDeps: {
    include: []
  }
})