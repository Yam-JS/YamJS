// TODO: This needs to be fixed and clarified.

export type { Java, Polyglot } from './types/global'

export type { YamApi, YamConfig, YamFileInstance } from './types/yamApi'
export { yamInitialize } from './initialize'
export { load, reload, command, record, file, context } from './legacy'
