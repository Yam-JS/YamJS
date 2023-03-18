import { Opaque } from 'type-fest'
import { ticker } from './ticker'

type TickerTask = () => void
type TaskId = Opaque<number, 'TaskId'>
type Tick = Opaque<number, 'Tick'>
type TaskObject = {
  baseTick: Tick
  tick: Tick
  fn: TickerTask
  reset: boolean
  id: TaskId
}

const isTick = (tick: number): tick is Tick => true
const isTaskId = (id: number): id is TaskId => true
const tick = (tick: number | Tick) => tick as Tick
const taskId = (id: number | TaskId) => id as TaskId

const createTickerTasks = () => {
  const context = {
    nextId: 0,
  }

  const taskIdMap = new Map<TaskId, TaskObject>()

  const remove = (id: number) => {
    if (!isTaskId(id)) return

    taskIdMap.delete(id)
  }

  const add = (
    fn: TickerTask,
    baseTick: number,
    options?: {
      /**
       * Reset the task after it has been run
       *
       * @default false
       */
      reset?: boolean
      nextId?: number
    }
  ) => {
    if (!isTick(baseTick)) return

    const id = taskId(options?.nextId ?? context.nextId++)
    const targetTick = tick(ticker.getTick() + Math.max(baseTick, 1))

    // Handle TaskIdMap
    taskIdMap.set(id, {
      baseTick,
      tick: targetTick,
      fn,
      reset: options?.reset || false,
      id,
    })

    return id
  }

  const runTask = (task: TaskObject) => {
    taskIdMap.delete(task.id)
    task.fn()

    if (task.reset) {
      add(task.fn, task.baseTick, { reset: task.reset, nextId: task.id })
    }
  }

  const run = (tick: number) => {
    if (!isTick(tick)) return

    for (const [, task] of taskIdMap) {
      if (tick >= task.tick) {
        runTask(task)
      }
    }
  }

  return {
    add,
    run,
    remove,
    initialize: () => {
      ticker.registerTickFn((tick) => run(tick))
    },
  }
}

export const tickerTasks = createTickerTasks()
