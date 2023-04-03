import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { testCache } from '../cache/cache'
import { appConfig } from '../config'
import { createBukkitYml } from './setup/bukkitYml'
import { downloadPaper, downloadYamJs } from './setup/download'
import { createServerProperties } from './setup/serverProperties'

export const setupServer = (config: ServerConfig) => {
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
    config.yamJsJar
      ? // TODO: May be worth compressing down to a single function
        testCache.setFile({
          name: 'yamjs.jar',
          getContents: () => {
            if (!config.yamJsJar) throw new Error('This should not happen. YamJSJar is not defined')

            const targetPath = path.resolve(config.yamJsJar)
            if (!existsSync(targetPath)) throw new Error('No yamjs.jar found')

            return readFileSync(targetPath)
          },
          folder: 'server/plugins',
        })
      : testCache.setFileToCacheIfMissing({
          name: 'yamjs.jar',
          getContents: () => downloadYamJs(),
          folder: 'server/plugins',
        }),

    // index.js
    config.js
      ? testCache.setFile({
          name: 'index.js',
          getContents: () => {
            if (!config.js) throw new Error('This should not happen. js is not defined')
            return readFileSync(config.js, 'utf8')
          },
          folder: 'server/plugins/YamJS',
        })
      : undefined,
  ])
}
