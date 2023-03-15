import webpack from 'webpack'
import got from 'got'
import path from 'path'
import { paths } from '../paths'
import { clearWebpackConsole } from './util'
import { formatWebpackMessages } from './formatWebpackMessages'

const createConfig = require(path.join(paths.root, 'webpack.config.js'))
const isInteractive = process.stdout.isTTY

export async function startWebpack() {
  const config = createConfig({ dev: true })

  let compiler: webpack.Compiler
  try {
    compiler = webpack(config)
  } catch (err) {
    console.log(err)

    process.exit(1)
  }

  if (isInteractive) {
    clearWebpackConsole()
  }

  compiler.hooks.invalid.tap('invalid', () => {
    clearWebpackConsole()

    console.log('Compiling...')
  })

  compiler.hooks.done.tap('done', async (stats) => {
    clearWebpackConsole()
    const messages = formatWebpackMessages(
      stats.toJson({
        all: false,
        warnings: true,
        errors: true,
      })
    )

    for (const message of messages.errors) {
      console.log(message)
    }

    console.log(messages.errors.length ? 'Failed to compile.' : 'Compiled successfully.')

    // Ignore the first call
    if (!context.hasInitialized) {
      context.hasInitialized = true
      return
    }

    if (!context.isReloading && messages.errors.length === 0) handleReload()
  })

  return compiler.watch({}, (stats) => {
    stats ?? console.log(stats)
  })
}

const context = {
  hasInitialized: false,
  isReloading: false,
}

async function handleReload() {
  try {
    context.isReloading = true
    await got.get('http://localhost:4000/reload', { timeout: 1000, retry: 1 })
    console.log('Reload successful')
    context.isReloading = false

    return
  } catch (err) {
    console.log('Failed to connect...')
    return setTimeout(handleReload, 1000)
  }
}
