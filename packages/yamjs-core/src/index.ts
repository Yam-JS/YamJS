import './bukkit'
import './debug'
import './errors'
import { lifecycle } from './lifecycle'
import './registerEvent'
import './sourceMap'
import './tasks'
import './ticker'
import './timers'
import './util'

export type { YamApi, YamConfig, YamInstance } from './types/yamApi'
export type { Java, Polyglot } from './types/global'

export { bukkitManager, bukkitPlugin, bukkitServer } from './bukkit'
export { getDebugInfo } from './debug'
export { logError, catchAndLogUnhandledError } from './errors'
export { registerEvent, createEventListener, type RegisterEventType } from './registerEvent'
export { cacheSourceMap } from './sourceMap'
export { lifecycle } from './lifecycle'

if (Yam.getConfig().initialize) {
  lifecycle.enable()
}
