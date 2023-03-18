import { command, file } from '@yam-js/core/src'
import { cacheSourceMap } from '@yam-js/core/src/sourceMap'
import { initializeAutoReload } from './autoReload/autoReload'

initializeAutoReload()
console.log('Hello World!')

const sourceMap = file('./plugins/yamjs/index.js.map')
const contents = sourceMap.read()

cacheSourceMap('index.js', contents, 1)

command({
  name: 'test',
  execute: () => {
    throw new Error('Oh no')
  },
})

// throw new Error('Oh no! Error went off!')
