import { spawn } from 'node:child_process'
import { testCache } from '../cache/cache'
import { AppEvents } from '../util/events/events'

export const startServerProcess = () => {
  const childProcess = spawn('java', ['-jar', 'server.jar', 'nogui'], {
    cwd: testCache.directoryMap.server.path,
    stdio: 'pipe',
    detached: false,
  })
  childProcess.stdin.setDefaultEncoding('utf8')
  childProcess.stdout.setEncoding('utf8')
  childProcess.stderr.setEncoding('utf8')

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

  childProcess.stdout.on('data', onData)
  childProcess.stderr.on('data', (err) => {
    console.log(err)
  })

  return childProcess
}
