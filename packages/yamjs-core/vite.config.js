import { resolve } from 'path'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    babel({
      filter: /\.ts$/,
      babelConfig: {
        configFile: resolve(__dirname, 'babel.config.js'),
      },
    }),
    dts({
      entryRoot: resolve(__dirname, 'src'),
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'yamjs-core',
      fileName: (format) => `index.${format}.js`,
      rollupOptions: {
        // overwrite default .html entry
        input: resolve(__dirname, 'src/index.ts'),
      },
    },
  },
})
