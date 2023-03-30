# @yam-js/test-util

Simple library that provides test utility to help with E2E testing for @yam-js.

Note: This library is still in development.

# Getting Started

Pick your favorite test framework. @yam-js uses mocha. From there, install package:

```
npm install --dev @yam-js/test-util
```

# Config

Test utilities are configurable. To config, create a new `.yamjs-test-config.js` file.

```javascript
module.exports = {
  /**
   * Configure port
   *
   * @optional
   */
  port: 25565

  /**
   * Point to YamJS Jar
   *
   * @optional
   */
  yamJsJar: './dist/yamjs.jar',

  /**
   * Points to your JavaScript file
   *
   * @required
   */
  js: './dist/index.js',
}
```

# Usage

The test util provides wrappers around a Minecraft server instance with Mineflayer bots.

Example usage

```typescript
import { server, waitForEventPayload } from '@yam-js/test-util'

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
```

# Notes

- You may need to increase timeouts to account for server process.
