import { startWebpack } from './webpack/buildWebpack'
import path from 'path'

startWebpack(path.resolve(process.cwd()))
