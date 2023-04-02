import { lifecycle, registerEvent } from '@yam-js/core'
import { command } from '@yam-js/legacy'
import { PlayerJoinEvent, PlayerQuitEvent } from 'org.bukkit.event.player'
// import { initializeSourceMap } from './sourceMap'

// initializeSourceMap()

const test = (fn: () => void) => {
  setTimeout(fn, 1000)
}

test(() => {
  console.log('Test1 Hello world!')
})

registerEvent(PlayerJoinEvent, (event) => {
  console.log(`Test2 Player ${event.getPlayer().getName()} joined the game!`)
})

registerEvent(PlayerQuitEvent, (event) => {
  console.log(`Test3 Player ${event.getPlayer().getName()} quit the game!`)
})

command({
  name: 'jsreload',
  execute() {
    console.log('Test4 Reloading...')
    lifecycle.reload()
  },
})

command({
  name: 'setTimeout',
  execute() {
    setTimeout(() => {
      console.log('setTimeout worked')
    }, 250)
  },
})

command({
  name: 'setInterval',
  execute() {
    let count = 0
    setInterval(() => {
      console.log('setInterval worked' + count++)
    }, 250)
  },
})

command({
  name: 'setImmediate',
  execute() {
    setImmediate(() => {
      console.log('setImmediate worked')
    })
  },
})
