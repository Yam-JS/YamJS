import YamJS from '@yam-js/core'
import { command, file } from '@yam-js/legacy/src'
import { EntityDeathEvent } from 'org.bukkit.event.entity'
import { initializeAutoReload } from './autoReload/autoReload'
import { fetch } from './fetch'

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

// fetch('https://www.google.com/')
//   .then((response) => {
//     // @ts-ignore
//     console.log(response.body())
//   })
//   .catch((error) => {
//     // @ts-ignore
//     console.log(error)
//   })

YamJS.registerEvent(EntityDeathEvent, (event) => {
  console.log('Entity died', event.getEntity().getUniqueId().toString())
})
