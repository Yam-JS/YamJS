import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { testCache } from '../cache/cache'
import { appConfig } from '../config'
import { createBukkitYml } from './setup/bukkitYml'
import { downloadPaper, downloadYamJs } from './setup/download'
import { createServerProperties } from './setup/serverProperties'
import { ServerConfig } from './types'

const addMap = () => {
  if (!appConfig.js) return
  const targetPath = `${appConfig.js}.map`
  if (!existsSync(targetPath)) return

  return testCache.setFile({
    name: 'index.js.map',
    getContents: () => {
      return readFileSync(targetPath, 'utf8')
    },
    folder: 'server/plugins/YamJS',
  })
}

export const setupServer = (config: ServerConfig) => {
  return Promise.allSettled([
    // Server
    testCache.setFile({
      ifMissing: true,
      name: 'server.jar',
      getContents: () => downloadPaper(),
      folder: 'server',
    }),

    // Eula
    testCache.setFile({
      ifMissing: true,
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

    testCache.setFile({
      name: 'yamjs.jar',
      getContents: () => {
        if (config.yamJsJar) {
          const targetPath = path.resolve(config.yamJsJar)
          if (!existsSync(targetPath)) throw new Error('No yamjs.jar found')

          return readFileSync(targetPath)
        }

        return downloadYamJs()
      },
      folder: 'server/plugins',
    }),

    // index.js
    config.js
      ? testCache.setFile({
          name: 'index.js',
          getContents: () => {
            if (config.rawJs) return config.rawJs
            if (!config.js) throw new Error('This should not happen. js is not defined')
            return readFileSync(config.js, 'utf8')
          },
          folder: 'server/plugins/YamJS',
        })
      : undefined,

    // index.js.map
    addMap(),
  ])
}
