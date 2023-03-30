import { asyncCatchAndLogUnhandledError, catchAndLogUnhandledError } from './errors'
import { logVerbose } from './util'

type Hook = {
  name?: string
  hook: HookCallback

  /**
   * Allows to control the order of execution.
   * Lower number means earlier execution.
   * Higher number means later execution.
   *
   * Default is 3.
   */
  priority?: 1 | 2 | 3 | 4 | 5
}
export type HookCallback = () => void

type HookId = string
type HookUnref = () => void
// TODO: 'onEnable' doesn't work
type LifecycleTypes = 'disable' | 'enable'

export const __INTERNAL_LIFECYCLE = Symbol('lifecycle')

const createLifecycleHandler = () => {
  const hooks = new Map<LifecycleTypes, Map<HookId, Hook>>()
  let nextId = 0
  let isReloading = false

  const executeHooks = async (type: LifecycleTypes) => {
    const group = hooks.get(type)

    for (let i = 1; i <= 5; i++) {
      const priorityHooks = [...group.values()].filter((hook) => hook.priority === i)
      for (const { hook, name } of priorityHooks) {
        name && console.log(`${type === 'enable' ? 'Enabling' : 'Disabling'} ${name}`)

        await asyncCatchAndLogUnhandledError(
          async () => await hook?.(),
          `Error while executing ${type} hook`
        )
      }
    }

    hooks.delete(type)
  }

  Yam.instance.setOnCloseFn(async () => {
    await executeHooks('disable')
  })

  return {
    [__INTERNAL_LIFECYCLE]: {
      executeHooks,
    },

    reload: async () => {
      logVerbose('Reloading YamJS')
      isReloading = true

      await executeHooks('disable')

      Yam.reload()

      logVerbose('Finished reloading YamJS')
      isReloading = false
    },

    on: (name: LifecycleTypes, hook: Hook): HookUnref => {
      const id = nextId++

      const callbacks = hooks.get(name) ?? new Map()
      callbacks.set(id, { priority: 3, ...hook })
      hooks.set(name, callbacks)

      return () => delete callbacks[id]
    },
  }
}

export const lifecycle = createLifecycleHandler()
