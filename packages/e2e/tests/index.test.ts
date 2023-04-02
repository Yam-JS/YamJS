import { server, waitForEventPayload } from '@yam-js/test-util'
import assert from 'assert'

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

describe('regression testing', () => {
  beforeEach(async () => {
    await server.start()
  })

  it('does not error with "zip file closed" on exit', async () => {
    await server.stop()

    const logs = server.getLogs()
    assert(logs.find((log) => log.includes('zip file closed')) === undefined)
  })
})
