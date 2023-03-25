import { cacheSourceMap, registerEvent } from '@yam-js/core'
import { command, file } from '@yam-js/legacy/src'
import { EntityDeathEvent } from 'org.bukkit.event.entity'
import { fetch } from './fetch'
import { initializeWebServer } from './autoReload'
import { server } from './webserver'

initializeWebServer()

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

console.log(server)

// fetch('https://www.google.com/')
//   .then((response) => {
//     // @ts-ignore
//     console.log(response.body())
//   })
//   .catch((error) => {
//     // @ts-ignore
//     console.log(error)
//   })

registerEvent(EntityDeathEvent, (event) => {
  console.log('Entity died', event.getEntity().getUniqueId().toString())
})

Java.type('org.bukkit.Bukkit').getOnlinePlayers()
