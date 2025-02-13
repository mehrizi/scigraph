import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    target: 'es2020'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: { 
        'decorator-auto-accessors': true ,
        'transform-class-properties':true
      },
    }
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './components'),
      '@/classes': path.resolve(__dirname, './classes'),
      '@/models': path.resolve(__dirname, './models'),
      // You can add more aliases here as needed:
      // '@pages': path.resolve(__dirname, './src/pages'),
      // '@assets': path.resolve(__dirname, './src/assets'),
      // '@utils': path.resolve(__dirname, './src/utils'),
    }
  }
})
