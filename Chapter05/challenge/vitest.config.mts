import swc from 'unplugin-swc'
import { defineConfig, configDefaults } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: [
      ...configDefaults.exclude,
      './src/core'
    ],
    
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})