import { resolve } from 'path'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import dts from 'vite-plugin-dts'

export const yamJsViteConfig = ({ root, name, external = [] }) => defineConfig({
  plugins: [
    babel({
      filter: /\.ts$/,
      babelConfig: {
        configFile: resolve(__dirname, 'babel.config.js'),
      },
    }),
    dts({
      entryRoot: resolve(root, 'src'),
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(root, 'src/index.ts'),
      name: name,
      fileName: (format) => `index.${format}.js`,
      rollupOptions: {
        // overwrite default .html entry
        input: resolve(root, 'src/index.ts'),
      },
    },
    rollupOptions: {
      external
    }
  },
})
