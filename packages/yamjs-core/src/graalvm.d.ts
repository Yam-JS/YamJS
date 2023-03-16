export type Java = {
  type: <T = any>(name: string) => T
  extend: any
}

export type Polyglot = {
  eval: <T = any>(...args: any[]) => T
}

declare global {
  const Java: Java
  const Polyglot: Polyglot
}
