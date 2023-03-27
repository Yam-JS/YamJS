import { subscribe } from 'valtio'

export const waitUntilState = <T extends object>(state: T, predicate: (state: T) => boolean) => {
  return new Promise<void>((resolve) => {
    const unsubscribe = subscribe(state, () => {
      if (predicate(state)) {
        unsubscribe()
        resolve()
      }
    })
  })
}
