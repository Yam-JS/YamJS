import path from 'node:path'

const folderName = '.testCache'

export const createCacheDirectoryMap = () => {
  const root = path.resolve(process.cwd(), folderName)
  const server = path.resolve(root, 'server')

  return {
    path: root,
    server: {
      path: server,
      eula: path.resolve(server, 'eula.txt'),
      plugins: {
        path: path.resolve(server, 'plugins'),
        grakkit: {
          path: path.resolve(server, 'plugins', 'grakkit'),
        },
        YamJS: {
          path: path.resolve(server, 'plugins', 'YamJS'),
        },
      },
    },
  }
}

export type CacheDirectoryMap = ReturnType<typeof createCacheDirectoryMap>

export type DirectoryLevel = {
  path: string
  [key: string]: string | DirectoryLevel
}
