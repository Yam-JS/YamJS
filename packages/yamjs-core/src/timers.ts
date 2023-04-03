import { createCatchAndLogUnhandledErrorHandler } from './errors'
import { tickerTasks } from './tasks'

const baseTimer = (
  callback: () => void,
  delay: number,
  options?: Parameters<(typeof tickerTasks)['add']>[2]
) => {
  const modifier = delay / 50

  return tickerTasks.add(
    createCatchAndLogUnhandledErrorHandler(callback, 'Unhandled timer'),
    modifier,
    options
  )
}

const setTimeout = (callback: () => void, delay: number) => baseTimer(callback, delay)
const setInterval = (callback: () => void, delay: number) =>
  baseTimer(callback, delay, {
    reset: true,
  })

const setImmediate = (callback: () => void) => setTimeout(callback, 0)

const clearTimeout = (id: number) => tickerTasks.remove(id)

export const initializeTimers = () => {
  // @ts-expect-error
  globalThis.setTimeout = setTimeout
  // @ts-expect-error
  globalThis.setInterval = setInterval
  // @ts-expect-error
  globalThis.setImmediate = setImmediate
  // @ts-ignore
  globalThis.clearTimeout = clearTimeout
  // @ts-ignore
  globalThis.clearInterval = clearTimeout
}
