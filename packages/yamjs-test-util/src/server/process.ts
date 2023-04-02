import { spawn } from 'node:child_process'
import { testCache } from '../cache/cache'
import { AppEvents } from '../util/events/events'

export const startServerProcess = () => {
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
