import fs from 'node:fs'
import path from 'node:path'
import { DirectoryLevel, createCacheDirectoryMap } from './directory'

const createCacheDirectory = (map: DirectoryLevel) => {
  const keys = Object.keys(map)

  for (const key of keys) {
    const item = map[key as keyof typeof map]

    // Handle paths/files
    if (typeof item === 'string') {
      if (key === 'path') {
        makeCacheFolder(item)
        continue
      }

      // TBD; this is a file
    }

    // Handle objects
    if (typeof item === 'object') {
      createCacheDirectory(item)
      continue
    }
  }
}

const cacheDirectoryMap = createCacheDirectoryMap()

const folderProp = (folder?: string) =>
  folder ? path.resolve(cacheDirectoryMap.path, folder) : cacheDirectoryMap.path

const makeCacheFolder = (folder?: string) => {
  if (!fs.existsSync(folderProp(folder))) {
    fs.mkdirSync(folderProp(folder))
  }
}

const purgeCacheFolder = (folder?: string) => {
  if (fs.existsSync(folderProp(folder))) {
    fs.rmdirSync(folderProp(folder), { recursive: true })
  }
}

type AllowedContentType = string | Buffer | object

const parseContent = (content: AllowedContentType) => {
  if (Buffer.isBuffer(content)) {
    return content
  }

  if (typeof content === 'object') {
    return JSON.stringify(content)
  }

  return content
}

interface SetFileCacheOptions {
  name: string
  getContents: () => AllowedContentType | Promise<AllowedContentType>
  folder?: string
}

const setFileToCache = async ({ name, getContents, folder }: SetFileCacheOptions) => {
  fs.writeFileSync(path.resolve(folderProp(folder), name), parseContent(await getContents()))
}

const setFileToCacheIfMissing = async ({ name, getContents, folder }: SetFileCacheOptions) => {
  if (!fs.existsSync(path.resolve(folderProp(folder), name))) {
    await setFileToCache({
      name,
      getContents,
      folder,
    })
  }
}

const setup = () => {
  createCacheDirectory(cacheDirectoryMap)
}

const createCache = () => {
  const context = {
    isInitialized: false,
  }

  const wrapper = <T>(fn: T) => {
    if (!context.isInitialized) {
      setup()
      context.isInitialized = true
    }

    return fn
  }

  return {
    setFileToCacheIfMissing: wrapper(setFileToCacheIfMissing),
    setFile: wrapper(setFileToCache),
    remove: wrapper(purgeCacheFolder),
    directoryMap: cacheDirectoryMap,
  }
}

export const testCache = createCache()
