import { existsSync, readFileSync, writeFileSync } from 'node:fs'
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
    getContents: () => readFileSync(targetPath, 'utf8'),
    folder: 'server/plugins/YamJS',
  })
}

export const setupServer = async (config: ServerConfig) => {
  try {
    // Download and save server.jar (Directly)
    const serverJarData = await downloadPaper()
    const serverJarPath = path.join(testCache.directoryMap.server.path, 'server.jar')
    writeFileSync(serverJarPath, serverJarData)
    console.log('server.jar saved successfully:', serverJarPath)

    // Eula
    await testCache.setFile({
      ifMissing: true,
      name: 'eula.txt',
      getContents: () => 'eula=true',
      folder: 'server',
    })

    // Server.properties
    await testCache.setFile({
      name: 'server.properties',
      getContents: () =>
        createServerProperties({
          'query.port': appConfig.port,
        }),
      folder: 'server',
    })

    // Bukkit.yml
    await testCache.setFile({
      name: 'bukkit.yml',
      getContents: () => createBukkitYml(),
      folder: 'server',
    })

    await testCache.setFile({
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
    })

    // index.js
    if (config.js) {
      await testCache.setFile({
        name: 'index.js',
        getContents: () => {
          if (config.rawJs) return config.rawJs
          if (!config.js) throw new Error('This should not happen. js is not defined')
          return readFileSync(config.js, 'utf8')
        },
        folder: 'server/plugins/YamJS',
      })
    }

    // index.js.map
    addMap()
  } catch (error) {
    console.error('Error setting up server:', error.message)
    throw error // Rethrow the error to stop execution if necessary
  }
}
