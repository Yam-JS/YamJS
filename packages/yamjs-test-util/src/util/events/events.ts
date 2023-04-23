import { appConfig } from '../../config'
import { EventMap, EventNames, Events } from './types'

const createEventSystem = () => {
  const cache = new Map<EventNames, Map<Symbol, Function>>()

  return {
    on: <K extends Events['type']>(name: K, callback: (event: EventMap[K]) => void): EventUnref => {
      // create a unique symbol for the callback
      const symbol = Symbol()

      // add the callback to the cache
      if (cache.has(name)) {
        cache.get(name)?.set(symbol, callback)
      } else {
        cache.set(name, new Map([[symbol, callback]]))
      }

      // return a function to remove the callback
      return () => {
        cache.get(name)?.delete(symbol)
      }
    },

    emit: <K extends EventNames>(type: K, payload: EventMap[K]) => {
      if (cache.has(type)) {
        cache.get(type)?.forEach((callback) => {
          callback(payload)
        })
      }
    },
  }
}

export type EventUnref = () => void

export const AppEvents = createEventSystem()
export const createEventStateListener = <K extends Events['type']>(name: K) => {
  const context = {
    events: [] as EventMap[K][],
  }

  const unref = AppEvents.on(name, (event) => {
    context.events.push(event)
  })

  return {
    get: () => context.events,
    reset: () => {
      context.events = []
    },
    unref,
  }
}

export const waitForEventPayload = <K extends Events['type']>(
  name: K,
  predicate: (payload: EventMap[K]) => boolean,
  timeout: number = appConfig.timeout
) => {
  let timeoutId: NodeJS.Timeout | null = null

  const promise = new Promise<EventMap[K]>((resolve) => {
    const removeListener = AppEvents.on(name, (event) => {
      if (predicate(event)) {
        removeListener()
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        resolve(event)
      }
    })
  })

  const timeoutPromise = new Promise<void>((_, reject) => {
    timeoutId = setTimeout(() => {
      timeoutId = null
      reject(new Error(`Timeout waiting for event payload: ${name}`))
    }, timeout)
  })

  return Promise.race([promise, timeoutPromise])
}
