import { asyncCatchAndLogUnhandledError } from './errors'
import { logVerbose } from './util'

type LifecycleConfig = {
  name?: string
  callback: LifecycleCallback

  /**
   * Allows to control the order of execution.
   * Lower number means earlier execution.
   * Higher number means later execution.
   *
   * Default is 3.
   */
  priority?: 1 | 2 | 3 | 4 | 5
}
type LifecycleCallback = () => void

type CallbackId = string
type LifecycleCallbackUnref = () => void
type LifecycleTypes = 'disable' | 'enable'

export const __INTERNAL_LIFECYCLE = Symbol('lifecycle')

const createLifecycleHandler = () => {
  const instances = new Map<LifecycleTypes, Map<CallbackId, LifecycleConfig>>()
  let nextId = 0
  let isEnabled = false

  const executeCallbacks = async (type: LifecycleTypes) => {
    const group = instances.get(type)

    for (let i = 1; i <= 5; i++) {
      const priorityItems = [...group.values()].filter((item) => item.priority === i)
      for (const { callback, name } of priorityItems) {
        name && console.log(`${type === 'enable' ? 'Enabling' : 'Disabling'} ${name}`)

        await asyncCatchAndLogUnhandledError(
          async () => await callback?.(),
          `Error while executing ${type} callback`
        )
      }
    }

    instances.delete(type)
  }

  Yam.instance.setOnCloseFn(async () => {
    await executeCallbacks('disable')
  })

  return {
    /**
     * Normally when importing from YamJS, the JS portion is automatically initialized.
     * If you disable "initialize" is disabled, you can manually initialize it by running
     * this function.
     */
    enable: async () => {
      if (isEnabled) return

      isEnabled = true
      await executeCallbacks('enable')
    },

    /**
     * Primary method of reloading YamJS. This will reload the entire JS portion of YamJS.
     */
    reload: async () => {
      logVerbose('Reloading YamJS')

      await executeCallbacks('disable')

      Yam.reload()

      logVerbose('Finished reloading YamJS')
    },

    /**
     * Allows to register a callback that will be executed when YamJS is enabled or disabled.
     */
    on: (name: LifecycleTypes, config: LifecycleConfig): LifecycleCallbackUnref => {
      if (name === 'enable' && isEnabled) {
        config.callback()

        return () => undefined
      }

      const id = nextId++

      const callbacks = instances.get(name) ?? new Map()
      callbacks.set(id, { priority: 3, ...config })
      instances.set(name, callbacks)

      return () => delete callbacks[id]
    },
  }
}

export const lifecycle = createLifecycleHandler()
