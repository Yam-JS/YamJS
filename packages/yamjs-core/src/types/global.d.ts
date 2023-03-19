import { JavaTypes } from '@yam-js/graal-type-introspection'
import { YamApi } from './yamApi'

type JavaTypeKey<T extends string> = T | keyof JavaTypes

export type Java = {
  // NOTE: We need to support both string and keyof JavaTypes here, without
  // sacrificing type safety. Ideally, the developer should see all the
  // possible keys in the parameter list, but still be able to pass a non-existing
  // key
  type: <Key extends string>(name: JavaTypeKey<Key>) => JavaTypes[Key]
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
