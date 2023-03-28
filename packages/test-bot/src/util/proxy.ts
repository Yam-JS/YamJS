import { subscribe } from 'valtio'
import { appConfig } from '../config'
import { promiseObjectRace } from './misc'

export const waitForState = async <T extends object>(
  state: T,
  predicate: (state: T) => boolean,
  timeout: number = appConfig.timeout
) => {
  let timeoutId: NodeJS.Timeout | null = null

  const { failure } = await promiseObjectRace({
    success: new Promise<boolean>((resolve) => {
      const unsubscribe = subscribe(state, () => {
        if (predicate(state)) {
          unsubscribe()
          resolve(true)
        }
      })
    }),
    failure: new Promise<boolean>((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(true)
      }, timeout)
    }),
  })

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  if (failure) {
    throw new Error('Timeout waiting for state')
  }

  return state
}
