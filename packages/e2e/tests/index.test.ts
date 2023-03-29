import { server } from '@yam-js/test-bot/src/index'
import { waitForEventPayload } from '@yam-js/test-bot/src/util/events/events'

describe('test', () => {
  beforeEach(async () => {
    await server.start(true)
  })

  after(async () => {
    await server.stop()
  })

  it('reads hello world', async () => {
    await server.write('jsreload')

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes('Hello world!')
    })
  })

  it('basic events are registered and triggered', async () => {
    const bot = server.createBot('Dummy')

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes(`Test2 Player Dummy joined the game!`)
    })

    bot.stop()

    await waitForEventPayload('server/log', (payload) => {
      return payload.includes(`Test3 Player Dummy quit the game!`)
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
