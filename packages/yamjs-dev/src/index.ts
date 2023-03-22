import YamJS from '@yam-js/core'
import { command, file } from '@yam-js/legacy/src'
import { initializeAutoReload } from './autoReload/autoReload'

initializeAutoReload()
console.log('Hello World!')

const sourceMap = file('./plugins/yamjs/index.js.map')
const contents = sourceMap.read()

YamJS.cacheSourceMap('index.js', contents, 1)

command({
  name: 'test',
  execute: () => {
    throw new Error('Oh no')
  },
})
