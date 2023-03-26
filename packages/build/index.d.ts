import { defineConfig } from 'vite'

export declare const yamJsViteConfig: (options: {
  root: string
  name: string
  external?: string[]
  entryPoints?: string[]
  isBin?: boolean
}) => ReturnType<typeof defineConfig>
