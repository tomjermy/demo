import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Pages from 'vite-plugin-pages'


export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Pages({
      pagesDir: 'src/pages',
      extensions: ['vue'],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
