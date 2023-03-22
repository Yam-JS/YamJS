// TODO: This needs to be fixed and clarified.

import { YamJSCore } from './core'

export { internal } from './core'
export type { Java, Polyglot } from './types/global'

export type { YamApi, YamConfig, YamInstance } from './types/yamApi'
export { initialize } from './initialize'

export default YamJSCore
