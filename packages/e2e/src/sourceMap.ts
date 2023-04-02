import { cacheSourceMap } from '@yam-js/core'
import { file } from '@yam-js/legacy'

export const initializeSourceMap = () => {
  const sourceMap = file('./plugins/yamjs/index.js.map')
  const contents = sourceMap.read()

  cacheSourceMap('index.js', contents, 1)
}
