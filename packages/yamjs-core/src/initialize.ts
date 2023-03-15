import { yamReloadHandler } from './reload'
import { yamTickerTasks } from './tasks'
import { yamTicker } from './ticker'
import { yamInitializeTimers } from './timers'

let isInitialized = false

export const yamInitialize = () => {
  console.log('Initializing YamJS...', isInitialized)
  if (isInitialized) return

  yamTicker.start()
  yamTickerTasks.initialize()
  yamInitializeTimers()
  yamReloadHandler.initialize()
  isInitialized = true
}

if (Yam.getConfig().initialize) {
  yamInitialize()
}
