import { YamJSCore } from './core';
export type { Java, Polyglot } from './types/global';
export type { YamApi, YamConfig, YamInstance } from './types/yamApi';
export { initialize } from './initialize';
export { load, reload, command, record, file, context } from './legacy';
export default YamJSCore;
