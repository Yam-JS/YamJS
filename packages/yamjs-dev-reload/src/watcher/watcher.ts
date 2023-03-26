import { watch } from 'chokidar'
import { reload } from '../util/reload'

export const initializeWatcher = (path: string = 'src', extensions = ['js', 'ts']) => {
  const watcher = watch(`${path}/**/*.+(${extensions.join('|')})`, {})

  watcher.on('change', async () => {
    reload()
  })
}
