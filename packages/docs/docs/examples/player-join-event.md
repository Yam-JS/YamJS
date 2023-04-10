# Player Join Event

```typescript
import { PlayerJoinEvent } from 'org.bukkit.event.player'
import { registerEvent } from '@yam-js/core'

registerEvent(PlayerJoinEvent, (event) => {
  const player = event.getPlayer()
  const location = player.getLocation()
  const world = location.getWorld().getName()
  const lines = [
    '-----------------------------------',
    `Name: ${player.getName()}`,
    `IP Address: ${player.getAddress().getHostName()}`,
    `Game Mode: ${player.getGameMode().toString()}`,
    `Location: { x: ${location.getX()}, y: ${location.getY()}, z: ${location.getZ()}, world: ${world} }`,
    `Health: ${player.getHealth()}/${player.getMaxHealth()}`,
    `Is Flying: ${player.isFlying() ? 'Yes' : 'No'}`,
    '-----------------------------------',
  ]

  lines.forEach((line) => console.log(line))
})
```
