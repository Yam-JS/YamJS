import { program } from 'commander'
import path from 'path'
import { appConfig } from '../config'
import { testEngine } from '../factory/testEngine'

program.option('-t, --timeout', 'set timeout')
program.option('-p, --port', 'set port')
program.option('--path <path>', 'set test path')
program.option('--js <file>', 'set js file')

program.parse(process.argv)

const options = program.opts()

if (options.timeout) {
  const parsed = typeof options.timeout === 'string' ? parseInt(options.timeout) : options.timeout
  if (isNaN(parsed)) {
    throw new Error('Invalid timeout')
  }

  appConfig.timeout = parsed
}

if (options.port) {
  const parsed = typeof options.port === 'string' ? parseInt(options.port) : options.port
  if (isNaN(parsed)) {
    throw new Error('Invalid port')
  }

  appConfig.port = parsed
}

if (options.path) {
  appConfig.testPath = path.resolve(options.path)
}

if (options.js) {
  appConfig.jsFile = path.resolve(options.js)
}

testEngine.start()
