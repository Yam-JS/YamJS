import { JavaTypes } from '@yam-js/graal-type-introspection/JavaTypes'
import { YamApi } from './yamApi'

export type Java = {
  type: <Key extends keyof JavaTypes>(name: Key) => JavaTypes[Key]
  extend: any
}

export type Polyglot = {
  eval: <T = any>(...args: any[]) => T
}

declare global {
  const Java: Java
  const Polyglot: Polyglot
  const Yam: YamApi
}
