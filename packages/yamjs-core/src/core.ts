import { getDebugInfo } from './debug'
import { catchAndLogUnhandledError, logError } from './errors'
import { initialize } from './initialize'
import { reloadHandler } from './reload'
import { cacheSourceMap } from './sourceMap'

export const internal = Symbol('internal')

/**
 * This is currently unstable and subject to change.
 */
export const YamJSCore = {
  initialize,
  reload: reloadHandler.reload,
  logError,
  catchAndLogUnhandledError,
  cacheSourceMap,
  getDebugInfo,

  /**
   * This is used internally by YamJS to store internal data.
   * This is not recommended for use by plugins.
   *
   * Use at your own risk.
   *
   * @internal
   */
  [internal]: {
    reloadHandler,
  },
}
