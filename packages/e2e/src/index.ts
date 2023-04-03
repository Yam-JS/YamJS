import { lifecycle, registerEvent } from '@yam-js/core'
import { command } from '@yam-js/legacy'
import { PlayerJoinEvent, PlayerQuitEvent } from 'org.bukkit.event.player'

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
