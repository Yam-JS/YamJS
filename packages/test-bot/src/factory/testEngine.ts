import { startRender } from '../render'
import { setupTest } from './setupTest'
import { wait } from '../util/misc'
import { TestEngineContext, TestEngineState } from './types'
import { createTestBot } from '../bot/bot'
import { server } from '../server/wrapper'
import { proxy } from 'valtio'

const createTestEngine = () => {
  const state: TestEngineState = proxy({
    suite: [],
    current: undefined,
  })
  const context: TestEngineContext = {
    bot: createTestBot({ id: 'main', server }),
    server,
  }

  return {
    state,
    context,

    start: async () => {
      startRender()

      for (const group of state.suite) {
        if (group.state === 'skipped') continue
        await server.start()
        await context.bot.start()

        state.current = group
        group.state = 'running'
        await group.callback(context)

        await setupTest(state.current.setup, context)
        let passed = true

        if (!group.tests) continue

        for (const test of group.tests) {
          if (test.state === 'skipped') continue

          group.msgs = []
          await wait(250)

          test.state = 'running'
          try {
            await test.callback(context)

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

      await wait(1000)

      console.log('Tests finished.')
      await server.stop()

      process.exit(0)
    },
  }
}

export const testEngine = createTestEngine()

if (require.main === module) {
  const tests = require('../__tests/index')

  testEngine.start()
}
