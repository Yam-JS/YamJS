import { spawn } from 'child_process'
import { proxy } from 'valtio'
import { testCache } from '../cache/cache.js'
import { isMain } from '../util/esm.js'
import {
  AppEvents,
  createEventStateListener,
  waitUntilEventPayload,
} from '../util/events/events.js'
import { promiseObjectRace } from '../util/misc.js'
import { downloadPaper, downloadYamJs } from './download.js'
import { createServerProperties } from './serverProperties.js'

const ServerProcessClosed = 'ServerProcessClosed'

const baseOptions = {
  doneRegex: /\[.+\]: Done/,
}

const setup = () => {
  return Promise.allSettled([
    // Server
    testCache.setFileToCacheIfMissing({
      name: 'server.jar',
      getContents: () => downloadPaper(),
      folder: 'server',
    }),

    // Eula
    testCache.setFileToCacheIfMissing({
      name: 'eula.txt',
      getContents: () => 'eula=true',
      folder: 'server',
    }),

    // Server.properties
    testCache.setFile({
      name: 'server.properties',
      getContents: () => createServerProperties(),
      folder: 'server',
    }),

    // Plugin
    testCache.setFileToCacheIfMissing({
      name: 'yamjs.jar',
      getContents: () => downloadYamJs(),
      folder: 'server/plugins',
    }),
  ])
}

const startServerProcess = () => {
  const process = spawn('java', ['-jar', 'server.jar', 'nogui'], {
    cwd: testCache.directoryMap.server.path,
    stdio: 'pipe',
    detached: false,
  })
  process.stdin.setDefaultEncoding('utf-8')
  process.stdout.setEncoding('utf-8')
  process.stderr.setEncoding('utf-8')

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
  process.stderr.on('data', onData)
  process.on('close', () => {
    AppEvents.emit('server/log', ServerProcessClosed)
  })

  return process
}

const createServer = () => {
  const internal = {
    logs: createEventStateListener('server/log'),
    process: undefined as undefined | ReturnType<typeof startServerProcess>,
    ...baseOptions,
  }

  const state = proxy({
    isReady: false,
  })

  const start = async (outputLogs: boolean = false) => {
    await setup()

    internal.process = startServerProcess()

    if (outputLogs) {
      AppEvents.on('server/log', (msg) => {
        console.log(msg)
      })
    }

    const { closed } = await promiseObjectRace({
      done: waitUntilEventPayload('server/log', (payload) => internal.doneRegex.test(payload)),
      closed: waitUntilEventPayload('server/log', (payload) => payload === ServerProcessClosed),
    })

    if (closed) {
      throw new Error('Server process closed unexpectedly.')
    }

    state.isReady = true
    return
  }

  const write = (msg: string) => {
    process?.stdin.write(msg)

    return waitUntilEventPayload('server/log', (payload) => payload.includes(msg))
  }

  const stop = () => {
    if (!internal.process) {
      return
    }

    write('stop\n')
    const timeoutHandle = setTimeout(() => {
      console.warn('Server shutdown took too long. Killing process.')
      internal.process?.kill()
    }, 10000)

    internal.process.on('close', () => {
      internal.process = undefined
      state.isReady = false
      clearTimeout(timeoutHandle)
    })
  }

  return {
    write,
    start,
    stop,
    state,
  }
}

export type Server = ReturnType<typeof createServer>
export const server = createServer()

// if ran directly
// if (require.main === module) {
if (isMain(import.meta.url)) {
  server.start(true)
}
