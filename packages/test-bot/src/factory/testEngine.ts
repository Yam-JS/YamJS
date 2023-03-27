import { startRender } from '../render'
import { setupTest } from './setupTest'
import { wait } from '../util/misc'
import { TestEngineContext, TestEngineState } from './types'
import { createTestBot } from '../bot/bot'
import { server } from '../server/wrapper'
import { proxy } from 'valtio'
import { isMain } from '../util/esm'

const createTestEngine = () => {
  const state: TestEngineState = proxy({
    suite: [],
    current: undefined,
  })
  const context = proxy({
    bot: createTestBot('main'),
    server,
  })

  return {
    state,
    context,

    chat: (msg: string) => {
      if (state.current) {
        const test = state.current.tests?.filter((t) => t.state === 'running')[0]
        if (!test) return

        test.msgs = test.msgs || []
        test.msgs.push(msg)
        // context.current.msgs = context.current.msgs || []
        // context.current.msgs.push(msg)
      }
    },

    start: async () => {
      startRender()

      await server.start()
      await context.bot.start()

      for (const group of state.suite) {
        state.current = group
        group.state = 'running'
        group.callback(context)

        setupTest(state.current.setup, context)
        let passed = true

        if (!group.tests) continue

        for (const test of group.tests) {
          group.msgs = []
          await wait(250)

          test.state = 'running'
          try {
            test.callback(context.bot)

            test.state = 'success'
          } catch (err: any) {
            test.state = 'failed'
            test.result = {
              message: 'message' in err ? err.message : err,
            }
            passed = false
          }
        }

        if (passed) {
          group.state = 'success'
        } else {
          group.state = 'failed'
        }
      }
    },
  }
}

export const testEngine = createTestEngine()

// if ran directly
if (isMain(import.meta.url)) {
  console.log('testEngine.ts: isMain(import.meta.url) === true')
  testEngine.start()
}
