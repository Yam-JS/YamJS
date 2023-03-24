import { defineConfig } from 'vite'

export declare const yamJsViteConfig: (options: {
  root: string
  name: string
  external?: string[]
}) => ReturnType<typeof defineConfig>
