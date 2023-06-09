import { resolve } from 'path'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import dts from 'vite-plugin-dts'
import banner from 'vite-plugin-banner'

export const yamJsViteConfig = ({
  root,
  entryPoints = ['src/index.ts'],
  name,
  external = [],
  isBin = false,
  skipDeclaration = false,
}) =>
  defineConfig({
    plugins: [
      babel({
        filter: /\.ts$/,
        babelConfig: {
          configFile: resolve(__dirname, 'babel.config.js'),
        },
      }),
      !skipDeclaration &&
        dts({
          entryRoot: resolve(root, 'src'),
          copyDtsFiles: true,
        }),
      isBin &&
        banner({
          content: '//#!/usr/bin/env node',
          verify: false,
        }),
    ],
    build: {
      target: 'esnext',
      sourcemap: true,
      lib: {
        entry: entryPoints.map((item) => resolve(root, item)),
        name: name,
        fileName: (format, entry) => `${entry}.${format}.js`,
        rollupOptions: {
          // overwrite default .html entry
          input: resolve(root, 'src/index.ts'),
        },
      },
      rollupOptions: {
        external: (entrypoint) => {
          if (entrypoint.startsWith('node:')) {
            return true
          }

          return external.includes(entrypoint)
        },
      },
    },
  })
