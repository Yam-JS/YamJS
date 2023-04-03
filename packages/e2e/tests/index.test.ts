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

describe('build is correct', () => {
  const packageJson = require('../../yamjs-plugin/package.json')

  describe('YamJS-paper.jar', () => {
    beforeEach(async () => {
      await server.start({
        outputLogs: true,
      })
    })

    after(async () => {
      await server.stop()
    })

    it('pluginName returns YamJS', () => {
      assert(
        server
          .getLogs()
          .find((log) => log.includes(`[YamJS] Enabling YamJS v${packageJson.version}`)) !==
          undefined
      )
    })
  })

  describe('YamJS-paper-legacy.jar', () => {
    beforeEach(async () => {
      await server.start({
        yamJsJar: '../yamjs-plugin/paper/build/libs/yamjs-paper-legacy.jar',
      })
    })

    after(async () => {
      await server.stop()
    })

    it('pluginName returns grakkit', async () => {
      assert(
        server
          .getLogs()
          .find((log) => log.includes(`[grakkit] Enabling grakkit v${packageJson.version}`)) !==
          undefined
      )
    })
  })
})

describe('regression testing', () => {
  it('does not error with "zip file closed" on exit', async () => {
    await server.stop()

    const logs = server.getLogs()
    assert(logs.find((log) => log.includes('zip file closed')) === undefined)
  })
})
