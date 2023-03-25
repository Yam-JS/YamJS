import { logError } from './errors'
import { MainInstanceListener } from './registerEvent'
import { tickerTasks } from './tasks'
import { ticker } from './ticker'
import { initializeTimers } from './timers'
import { HandlerList } from 'org.bukkit.event'
import { bukkitPlugin } from './bukkit'
import { lifecycle, __INTERNAL_LIFECYCLE } from './lifecycle'

let isInitialized = false

export const initialize = () => {
  if (isInitialized) return

  ticker.start()
  tickerTasks.initialize()
  initializeTimers()

  Yam.instance.setLoggerFn((error) => logError(error))

  // TODO: Validate
  if (Yam.getMeta() === 'yamjs') {
    // Driver instance should unregister all listeners
    lifecycle.register('onDisable', {
      name: 'Event Listeners',
      hook: () => {
        HandlerList.unregisterAll(bukkitPlugin)
      },
      priority: 5,
    })
  } else {
    // Context instance should unregister only its own listeners
    lifecycle.register('onDisable', {
      name: 'Context Event Listeners',
      hook: () => {
        HandlerList.unregisterAll(MainInstanceListener)
      },
      priority: 5,
    })
  }

  // TODO: 'onEnable' doesn't work
  lifecycle[__INTERNAL_LIFECYCLE].executeHooks('onEnable')

  isInitialized = true
}

if (Yam.getConfig().initialize) {
  initialize()
}
