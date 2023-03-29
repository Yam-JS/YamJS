import { readFileSync } from 'fs'
import { testCache } from '../cache/cache'
import { appConfig } from '../config'
import { createBukkitYml } from './setup/bukkitYml'
import { downloadPaper, downloadYamJs } from './setup/download'
import { createServerProperties } from './setup/serverProperties'

export const setupServer = () => {
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
