import { appConfig } from '../config'

const DEFAULT_WAIT = 25

export const wait = (duration = DEFAULT_WAIT) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))

// export const promiseObjectRace = <T extends Record<string, Promise<any>>>(promises: T): any => {
//   const keys = Object.keys(promises)

//   return Promise.race(keys.map((key) => promises[key].then((value) => ({ [key]: value })))).then(
//     (result) => {
//       const key = Object.keys(result)[0]
//       const value = result[key]

//       return { [key]: value }
//     }
//   )
// }

export const promiseObjectRace = <T extends Record<string, Promise<any>>>(
  promises: T
): Promise<{ [K in keyof T]: T[K] extends Promise<infer R> ? R | undefined : never }> => {
  const keys = Object.keys(promises)

  return Promise.race(keys.map((key) => promises[key].then((value) => ({ [key]: value })))).then(
    (result) => {
      const key = Object.keys(result)[0]
      const value = result[key]
      return { [key]: value }
    }
  ) as any
}

export const promiseTimeout = <T>(
  promise: Promise<T>,
  timeout: number = appConfig.timeout
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Promise timed out'))
    }, timeout)

    promise.then(
      (value) => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      (error) => {
        clearTimeout(timeoutId)
        reject(error)
      }
    )
  })
}
