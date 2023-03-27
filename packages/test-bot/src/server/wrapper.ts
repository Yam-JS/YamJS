import { spawn } from 'child_process'
import { proxy } from 'valtio'
import { testCache } from '../cache/cache'
import { appConfig } from '../config'
import { AppEvents, createEventStateListener, waitUntilEventPayload } from '../util/events/events'
import { promiseObjectRace } from '../util/misc'
import { waitUntilState } from '../util/proxy'
import { downloadPaper, downloadYamJs } from './download'
import { createServerProperties } from './serverProperties'

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
      getContents: () =>
        createServerProperties({
          'query.port': appConfig.port,
        }),
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
    logs: createEventStateListener('server/log'),
    mcServer: undefined as undefined | ReturnType<typeof startServerProcess>,
    ...baseOptions,
  }

  const state = proxy({
    isReady: false,
  })

  const start = async (outputLogs: boolean = false) => {
    if (state.isReady) return

    await setup()

    internal.mcServer = startServerProcess()

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
    if (!internal.mcServer) {
      return
    }

    internal.mcServer?.stdin.write(msg + '\r')
    internal.mcServer?.stdin.write(`say CommandExecuted: '${msg}'\r`)

    return waitUntilEventPayload(
      'server/log',
      (payload) => payload.match(/CommandExecuted: '(.*)'/)?.[1] === msg
    )
  }

  const stop = () => {
    if (!internal.mcServer) {
      return
    }

    write('stop')
    const timeoutHandle = setTimeout(() => {
      console.warn('Server shutdown took too long. Killing process.')
      internal.mcServer?.kill()
      state.isReady = false
      internal.mcServer = undefined
    }, 10000)

    internal.mcServer.on('close', () => {
      internal.mcServer = undefined
      state.isReady = false
      clearTimeout(timeoutHandle)
    })

    return waitUntilState(state, (state) => !state.isReady)
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

if (require.main === module) {
  server.start(true)

  new Promise<void>(async (resolve) => {
    await waitUntilState(server.state, (state) => state.isReady)
    console.log('Server is ready.')

    await server.write('help')
    console.log('Help done.')

    await server.stop()
    console.log('Server stopped.')
    resolve()

    process.exit(0)
  })
}
