import { BukkitTask } from 'org.bukkit.scheduler'
import { lifecycle } from './lifecycle'
import { logVerbose } from './util'

interface TickContext {
  tick: number
  task: BukkitTask | undefined
  isActive: boolean
  tickFns: ((tick: number) => void)[]
}

const Context = Symbol('TickContext')

const nextTick = () => {
  const ctx = ticker[Context]
  if (!ctx.isActive) return

  for (const fn of ctx.tickFns) {
    fn(ctx.tick)
  }

  if (ctx.tick % 20 === 0) {
    logVerbose('Tick', ctx.tick)
  }

  ctx.tick += 1
}

const createTicker = () => {
  const ctx: TickContext = {
    tick: 0,
    task: undefined,
    isActive: false,
    tickFns: [],
  }

  const start = () => {
    ctx.isActive = true
    Yam.instance.setTickFn(nextTick)
  }

  const stop = async () => {
    ctx.isActive = false
    if (ctx.task) ctx.task.cancel()

    return
  }

  lifecycle.on('enable', {
    name: 'Ticker',
    callback: () => {
      start()
    },
  })

  return {
    [Context]: ctx,
    start,
    stop,
    getTick: () => ctx.tick,
    registerTickFn: (fn: (tick: number) => void) => {
      ctx.tickFns.push(fn)
    },
  }
}

export const ticker = createTicker()
