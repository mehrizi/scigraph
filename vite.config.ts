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
  }
})
