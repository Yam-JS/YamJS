import { catchAndLogUnhandledError, logError } from './errors'
import { initialize } from './initialize'
import { command, load } from './legacy'
import { reloadHandler } from './reload'

export const YamJSCore = {
  createCommand: command,
  initialize,
  loadJar: load,
  reload: reloadHandler.reload,
  logError,
  catchAndLogUnhandledError,
}
