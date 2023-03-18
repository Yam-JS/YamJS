import { catchAndLogUnhandledError, logError } from './errors'
import { initialize } from './initialize'
import { reloadHandler } from './reload'

export const YamJSCore = {
  initialize,
  reload: reloadHandler.reload,
  logError,
  catchAndLogUnhandledError,
}
