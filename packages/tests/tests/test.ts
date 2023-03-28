import '@yam-js/test-bot/tests'
import { waitForEventPayload } from '@yam-js/test-bot/src/util/events/events'

describe('JS', ({ server, bot }) => {
  it('reads hello world', async () => {
    await waitForEventPayload('server/log', (payload) => {
      return payload.includes('Hello world!')
    })
  })

  it('basic events are registered and triggered', async () => {
    bot.stop()

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes(`Test3 Player testbot quit the game!`)
    })

    bot.start()

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes(`Test2 Player testbot joined the game!`)
    })
  })

  it('lifecycle.reload is able to reload', async () => {
    await server.write('jsreload')

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes(`Test1 Hello world!`)
    })

    await server.write('jsreload')

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes(`Test1 Hello world!`)
    })
  })
})
