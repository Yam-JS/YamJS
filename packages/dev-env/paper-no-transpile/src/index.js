/* eslint-disable no-undef */

const { cacheSourceMap, registerEvent } = require('@yam-js/core')
const { command, file } = require('@yam-js/legacy')
const { initializeDevReload } = require('@yam-js/dev-reload')

initializeDevReload()

console.log('Hello World!')

command({
  name: 'test',
  execute: () => {
    throw new Error('Oh no')
  },
})

// registerEvent(EntityDeathEvent, (event) => {
//   console.log('Entity died', event.getEntity().getUniqueId().toString())
// })

Java.type('org.bukkit.Bukkit').getOnlinePlayers()
