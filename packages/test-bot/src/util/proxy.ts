import { subscribe } from 'valtio/vanilla'
import { appConfig } from '../config'
import { promiseTimeout } from './misc'

export const waitForState = async <T extends object>(
  state: T,
  predicate: (state: T) => boolean,
  timeout: number = appConfig.timeout
) => {
  const promise = new Promise<boolean>((resolve) => {
    // check if predicate is already true
    if (predicate(state)) {
      resolve(true)
    }

    // subscribe to state changes
    const unsubscribe = subscribe(state, () => {
      if (predicate(state)) {
        unsubscribe()
        resolve(true)
      }
    })
  })

  timeout > 0 ? await promiseTimeout(promise) : await promise

  return state
}
