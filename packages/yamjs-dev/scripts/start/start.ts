import { startWebpack } from './buildWebpack'
import { copyDepPlugins, copyDeps } from './sync'

copyDeps()
copyDepPlugins()
startWebpack()
