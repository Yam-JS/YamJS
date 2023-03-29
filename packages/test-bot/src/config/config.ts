import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { appConfig } from '../config'

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
