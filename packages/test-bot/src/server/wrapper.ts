import { spawn } from 'child_process'
import { readFileSync } from 'fs'
import { proxy } from 'valtio'
import { testCache } from '../cache/cache'
import { appConfig } from '../config'
import { AppEvents, createEventStateListener, waitForEventPayload } from '../util/events/events'
import { promiseObjectRace } from '../util/misc'
import { waitForState } from '../util/proxy'
import { createBukkitYml } from './bukkitYml'
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

    // Bukkit.yml
    testCache.setFile({
      name: 'bukkit.yml',
      getContents: () => createBukkitYml(),
      folder: 'server',
    }),

    // Plugin
    testCache.setFileToCacheIfMissing({
      name: 'yamjs.jar',
      getContents: () => downloadYamJs(),
      folder: 'server/plugins',
    }),

    // index.js
    appConfig.jsFile
      ? testCache.setFile({
          name: 'index.js',
          getContents: () => {
            if (!appConfig.jsFile) throw new Error('This should not happen. jsFile is not defined')
            return readFileSync(appConfig.jsFile, 'utf8')
          },
          folder: 'server/plugins/YamJS',
        })
      : undefined,
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
    isProcessRunning: false,
  })

  const start = async (outputLogs: boolean = false) => {
    if (state.isProcessRunning) {
      // Need to wait for server to finish processing to figure out what to do.
      const { isReady } = await promiseObjectRace({
        isStopped: waitForState(state, (state) => !state.isProcessRunning),
        isReady: waitForState(state, (state) => state.isReady),
      })

      if (isReady) return
    }

    await setup()

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

  const stop = () => {
    if (!internal.mcServer) {
      return
    }

    state.isReady = false
    write('stop')
    const timeoutHandle = setTimeout(() => {
      console.warn('Server shutdown took too long. Killing process.')
      internal.mcServer?.kill()
      internal.mcServer = undefined
      state.isProcessRunning = false
    }, 10000)

    internal.mcServer.on('close', () => {
      state.isProcessRunning = false
      clearTimeout(timeoutHandle)
    })

    return waitForState(state, (state) => !state.isProcessRunning)
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
