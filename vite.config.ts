import { defineConfig } from 'vite'
import dynamicImport from 'vite-plugin-dynamic-import'

export default defineConfig({
  plugins: [
    dynamicImport(/* options */)
  ],
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
