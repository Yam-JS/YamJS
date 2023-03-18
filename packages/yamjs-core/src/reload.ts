export type CloseCallback = () => any

export interface CloseCallbackHandle {
  unregister(): void
}

const createReloadHandler = () => {
  const callbacks: Record<string, { name: string; fn: CloseCallback }> = {}
  let isReloading = false
  let nextId = 0

  const executeReload = async () => {
    Yam.reload()
  }

  const executeRegisteredCallbacks = async () => {
    const snapshot = { ...callbacks }
    for (const i in snapshot) {
      console.log(`Closing ${callbacks[i].name}`)
      const callback = callbacks[i]

      try {
        await callback.fn?.()
      } catch (err) {
        console.error(err)
      }

      delete callbacks[i]
    }
  }

  return {
    isReloading: () => isReloading,

    reload: async () => {
      console.log(`Reloading`)

      if (isReloading) {
        console.log('Force reloading')
        executeReload()
        return
      }

      isReloading = true

      await executeRegisteredCallbacks()

      executeReload()
    },

    register: (name: string, callback: CloseCallback): CloseCallbackHandle => {
      const id = nextId++
      callbacks[id] = { name, fn: callback }

      return {
        unregister: () => delete callbacks[id],
      }
    },

    initialize: () => {
      Yam.instance.setOnCloseFn(async () => {
        await executeRegisteredCallbacks()
      })
    },
  }
}

export const reloadHandler = createReloadHandler()
