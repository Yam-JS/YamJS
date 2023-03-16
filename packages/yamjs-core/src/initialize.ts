import { reloadHandler } from './reload'
import { tickerTasks } from './tasks'
import { ticker } from './ticker'
import { initializeTimers } from './timers'

let isInitialized = false

export const initialize = () => {
  console.log('Initializing YamJS...', isInitialized)
  if (isInitialized) return

  ticker.start()
  tickerTasks.initialize()
  initializeTimers()
  reloadHandler.initialize()
  isInitialized = true
}

if (Yam.getConfig().initialize) {
  initialize()
}
