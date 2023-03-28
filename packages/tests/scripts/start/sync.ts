import fs from 'fs'
import path from 'path'
import { paths } from '../paths'

function copyDependenciesHandler(sourcePath, targetPath) {
  const depFiles = fs.readdirSync(sourcePath)

  // Creates folder when absent; useful for new clones.
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }

  depFiles.forEach((file) =>
    fs.copyFileSync(path.join(sourcePath, file), path.join(targetPath, file))
  )
}

export const copyDeps = () =>
  copyDependenciesHandler(paths.deps.path, paths.server.plugins.yamJS.path)
export const copyDepPlugins = () =>
  copyDependenciesHandler(paths.depsPlugins.path, paths.server.plugins.path)
