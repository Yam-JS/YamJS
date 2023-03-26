import path from 'path'
import { initializeWatcher } from './watcher/watcher'

const [, , targetPath, extensions] = process.argv

const fullTargetPath = path.resolve(process.cwd(), targetPath)

console.log(`Watching for changes in ${fullTargetPath}...`)
initializeWatcher(fullTargetPath, extensions ? extensions.split(',') : undefined)
