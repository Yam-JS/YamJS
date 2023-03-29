import { config as envConfig } from 'dotenv'
import { existsSync } from 'fs'
import path from 'path'
import { proxy } from 'valtio/vanilla'

const parse = <T>(value: string | undefined, fallback: T, type: 'number' | 'string') => {
  if (value === undefined) {
    return fallback
  }

  if (type === 'number') {
    return parseInt(value) as unknown as T
  }

  return value as unknown as T
}

const createConfig = () => {
  envConfig()

  const isCi = process.env.CI === 'true'

  const options = proxy({
    isCi,
    user: parse(process.env.BOT_USERNAME, 'testbot', 'string'),
    port: parse(process.env.BOT_PORT, 25565, 'number'),
    timeout: parse(process.env.TEST_TIMEOUT, isCi ? 60_000 : 30_000, 'number'),
    testPath: parse(process.env.TEST_PATH, path.resolve(__dirname, '__tests'), 'string'),
    jsFile: parse<string | undefined>(process.env.TEST_JS, undefined, 'string'),
  })

  return options
}

export const appConfig = createConfig()

export const readTestConfigs = () => {
  const targetPath = require.resolve(path.resolve('.yamjs-test-config.js'))

  if (!existsSync(targetPath)) return

  const contents = require(targetPath)

  const keys = Object.keys(contents)

  for (const key of keys) {
    let value = contents[key]

    if (typeof value === 'function') {
      value = value()
    }

    // @ts-expect-error
    appConfig[key] = value
  }
}
