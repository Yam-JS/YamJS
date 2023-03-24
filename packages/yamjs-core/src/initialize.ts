import { logError } from './errors'
import { MainInstanceListener } from './registerEvent'
import { reloadHandler } from './reload'
import { tickerTasks } from './tasks'
import { ticker } from './ticker'
import { initializeTimers } from './timers'
import { HandlerList } from 'org.bukkit.event'
import { bukkitPlugin } from './bukkit'

let isInitialized = false

export const initialize = () => {
  if (isInitialized) return

  ticker.start()
  tickerTasks.initialize()
  initializeTimers()
  reloadHandler.initialize()

  Yam.instance.setLoggerFn((error) => logError(error))

  // TODO: Validate
  if (Yam.getMeta() === 'yamjs') {
    // Driver instance should unregister all listeners
    reloadHandler.register('Event Listeners', () => {
      HandlerList.unregisterAll(bukkitPlugin)
    })
  } else {
    // Context instance should unregister only its own listeners
    reloadHandler.register('Context Event Listeners', () => {
      HandlerList.unregisterAll(MainInstanceListener)
    })
  }

  isInitialized = true
}

if (Yam.getConfig().initialize) {
  initialize()
}
