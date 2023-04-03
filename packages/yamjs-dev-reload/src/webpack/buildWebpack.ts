import webpack from 'webpack'
import path from 'path'
import { clearWebpackConsole } from './util'
import { formatWebpackMessages } from './formatWebpackMessages'
import { reload } from '../util/reload'

const isInteractive = process.stdout.isTTY

export async function startWebpack(root: string) {
  // eslint-disable-next-line
  const createConfig = require(path.join(root, 'webpack.config.js'))
  const config = createConfig({ dev: true })

  let compiler: webpack.Compiler
  try {
    compiler = webpack(config, () => {
      return
    })
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

    reload()
  })

  return compiler.watch({}, (stats) => {
    stats ?? console.log(stats)
  })
}
