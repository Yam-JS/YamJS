# Command

```typescript
import { command } from '@yam-js/legacy'

command({
  name: 'bless',
  // permission required
  permission: 'example.command.bless',
  // error that displays if you don't have permissions
  error: 'You are not yet skilled enough to cast the blessing!',
  execute: (player, target) => {
    if (target) {
      target = server.getPlayer(target)
      if (target) {
        target.sendMessage('Take this blessing, because you are awesome!')
        target.setHealth(target.getMaxHealth())
        player.sendMessage('Your target has been blessed.')
      } else {
        player.sendMessage('That player is offline or does not exist!')
      }
    } else {
      player.sendMessage('Usage: /bless <target>')
    }
  },
  tabComplete: (player, ...args) => {
    if (args.length < 2) {
      const players = [...server.getOnlinePlayers()].map((player) => player.getName())
      return players.filter((name) => name.includes(args[0]))
    }
  },
})
```
