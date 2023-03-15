import { yamTickerTasks } from './tasks'

const baseTimer = (
  callback: () => void,
  delay: number,
  options?: Parameters<typeof yamTickerTasks['add']>[2]
) => {
  const modifier = delay / 50

  return yamTickerTasks.add(
    () => {
      try {
        callback()
      } catch (err) {
        console.error('Unhandled timer', err)
      }
    },
    modifier,
    options
  )
}

const yamSetTimeout = (callback: () => void, delay: number) => baseTimer(callback, delay)
const yamSetInterval = (callback: () => void, delay: number) =>
  baseTimer(
    () => {
      callback()
    },
    delay,
    {
      reset: true,
    }
  )

const yamSetImmediate = (callback: () => void) => yamSetTimeout(callback, 0)

const yamClearTimeout = (id: number) => yamTickerTasks.remove(id)

export const yamInitializeTimers = () => {
  // @ts-expect-error
  globalThis.setTimeout = yamSetTimeout
  // @ts-expect-error
  globalThis.setInterval = yamSetInterval
  // @ts-expect-error
  globalThis.setImmediate = yamSetImmediate
  globalThis.clearTimeout = yamClearTimeout
  globalThis.clearInterval = yamClearTimeout
}
