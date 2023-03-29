import { spawn } from 'node:child_process'
import { proxy } from 'valtio/vanilla'
import { createBotInstance } from '../bot/bot'
import { testCache } from '../cache/cache'
import { AppEvents, createEventStateListener, waitForEventPayload } from '../util/events/events'
import { promiseObjectRace } from '../util/misc'
import { waitForState } from '../util/proxy'
import { setupServer } from './setup'

const ServerProcessClosed = 'ServerProcessClosed'

const baseOptions = {
  doneRegex: /\[.+\]: Done/,
}

const startServerProcess = () => {
  const process = spawn('java', ['-jar', 'server.jar', 'nogui'], {
    cwd: testCache.directoryMap.server.path,
    stdio: 'pipe',
    detached: false,
  })
  process.stdin.setDefaultEncoding('utf8')
  process.stdout.setEncoding('utf8')
  process.stderr.setEncoding('utf8')

  let buffer = ''

  const onData = (data: string) => {
    buffer += data
    const lines = buffer.split('\n')
    const len = lines.length - 1
    for (let i = 0; i < len; ++i) {
      AppEvents.emit('server/log', lines[i])
    }
    buffer = lines[lines.length - 1]
  }

  process.stdout.on('data', onData)
  process.stderr.on('data', (err) => {
    console.log(err)
  })
  // process.on('close', () => {
  //   AppEvents.emit('server/log', ServerProcessClosed)
  // })

  return process
}

const createServer = () => {
  const internal = {
    nextBotId: 0,
    logs: createEventStateListener('server/log'),
    mcServer: undefined as undefined | ReturnType<typeof startServerProcess>,
    bots: new Set<ReturnType<typeof createBotInstance>>(),
    ...baseOptions,
  }

  const state = proxy({
    isReady: false,
    isProcessRunning: false,
  })

  const start = async (outputLogs: boolean = false) => {
    if (state.isProcessRunning) {
      // Need to wait for server to finish processing to figure out what to do.
      const { isReady } = await promiseObjectRace({
        isStopped: waitForState(state, (state) => !state.isProcessRunning, 0),
        isReady: waitForState(state, (state) => state.isReady, 0),
      })

      if (isReady) return
    }

    await setupServer()

    internal.mcServer = startServerProcess()
    state.isProcessRunning = true

    if (outputLogs) {
      AppEvents.on('server/log', (msg) => {
        console.log(msg)
      })
    }

    const { closed } = await promiseObjectRace({
      done: waitForEventPayload('server/log', (payload) => internal.doneRegex.test(payload)),
      closed: waitForEventPayload('server/log', (payload) => payload === ServerProcessClosed),
    })

    if (closed) {
      state.isProcessRunning = false
      throw new Error('Server process closed unexpectedly.')
    }

    state.isReady = true
    return
  }

  const write = (msg: string) => {
    if (!internal.mcServer) {
      return
    }

    internal.mcServer?.stdin.write(msg + '\r')
    internal.mcServer?.stdin.write(`say CommandExecuted: '${msg}'\r`)

    return waitForEventPayload(
      'server/log',
      (payload) => payload.match(/CommandExecuted: '(.*)'/)?.[1] === msg
    )
  }

  const stop = async () => {
    if (!internal.mcServer) return
    if (state.isProcessRunning && !state.isReady) {
      const { isStopped } = await promiseObjectRace({
        isStopped: waitForState(state, (state) => !state.isProcessRunning, 0),
        isReady: waitForState(state, (state) => state.isReady, 0),
      })

      if (isStopped) return
    }

    state.isReady = false

    for (const bot of internal.bots) {
      try {
        bot.stop()
      } catch (err) {
        // Ignore
      }
    }

    write('stop')
    const timeoutHandle = setTimeout(() => {
      console.warn('Server shutdown took too long. Killing process.')
      internal.mcServer?.kill()
      internal.mcServer = undefined
      state.isProcessRunning = false
    }, 10000)

    internal.mcServer.on('close', () => {
      state.isProcessRunning = false
      internal.mcServer?.kill()
      clearTimeout(timeoutHandle)
    })

    return waitForState(state, (state) => !state.isProcessRunning)
  }

  const createBot = (
    name: string,
    options: {
      disableAutoJoin?: boolean
    } = {}
  ) => {
    const { disableAutoJoin = false } = options
    const bot = createBotInstance({
      id: internal.nextBotId++,
      username: name,
      server: state,
      onQuit: () => {
        internal.bots.delete(bot)
      },
    })

    if (!disableAutoJoin) {
      bot.start()
    }

    internal.bots.add(bot)

    return bot
  }

  return {
    createBot,
    write,
    start,
    stop,
    state,
  }
}

export type Server = ReturnType<typeof createServer>
export const server = createServer()

if (require.main === module) {
  server.start(true)

  new Promise<void>(async (resolve) => {
    await waitForState(server.state, (state) => state.isReady)
    console.log('Server is ready.')

    await server.write('help')
    console.log('Help done.')

    await server.stop()
    console.log('Server stopped.')
    resolve()

    process.exit(0)
  })
}
