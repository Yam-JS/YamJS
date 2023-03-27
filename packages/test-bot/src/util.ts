import { colors } from './colors'
import { PendingAction, ActiveBotContext } from './types'
import { Vec3 } from 'vec3'
import { digAtBlock, buildAtBlock } from './bot/bot'
import { Item } from 'prismarine-item'

const delay = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration))

const DEFAULT_WAIT = 25

interface Component {
  extra?: Component[]
  text: string
  bold?: boolean
  italic?: boolean
  underlined?: boolean
  strikethrough?: boolean
  obfuscated?: boolean
  color?: string
}

const parseComponent = (component?: string | null) => {
  if (!component) return
  const parsed = JSON.parse(component) as Component

  let output = ''

  parsed.extra?.forEach((extra) => {
    output += extra.text
  })

  return output
}

const getItemId = (item?: Item | null): string | undefined => {
  if (!item) return

  if (item.nbt) {
    if (item.nbt.type === 'compound') {
      const values = item.nbt.value.PublicBukkitValues
      if (values && values.type === 'compound') {
        const id = values.value['grakkit:itemid']
        if (id && id.type === 'string') {
          return id.value
        }
      }
    }
  }

  return
}

export async function executeAction(ctx: ActiveBotContext, item: PendingAction) {
  const { bot, mcData } = ctx
  // @ts-expect-error
  const { action, offset, delay: timed = DEFAULT_WAIT, msg, testForBlock, testForItem } = item

  if (action === 'dig' && offset) {
    const block = bot.blockAt(bot.entity.position.offset(...offset))
    if (!block) throw new Error('Missing block')
    await digAtBlock(ctx, block, new Vec3(0, 0, 1))
  }

  if (action === 'placeBlock' && offset) {
    const block = bot.blockAt(bot.entity.position.offset(...offset))
    if (!block) throw new Error('Missing block')
    await buildAtBlock(ctx, block, new Vec3(0, 0, 1))
  }

  if (action === 'command' && msg) {
    bot.chat(`/${msg}`)
  }

  if (action === 'testItem') {
    const { item: itemName, operator } = item
    const heldItem = bot.heldItem
    const id = getItemId(heldItem)

    if (operator === 'equal') {
      if (id !== itemName) {
        throw new Error(
          `\n${colors.fgGreen}Received: ${colors.reset}${id}\n${colors.fgRed}Expected: ${colors.reset}${itemName}`
        )
      }
    } else {
      if (id === itemName) {
        throw new Error(
          `\n${colors.fgGreen}Received: ${colors.reset}${id}\n${colors.fgRed}Expected: ${colors.reset}Not ${itemName}`
        )
      }
    }
  }

  if (action === 'test') {
    if (testForBlock && offset) {
      const block = bot.blockAt(bot.entity.position.offset(...offset))
      if (!block) throw new Error('Missing block')

      if (block.name !== testForBlock)
        throw new Error(
          `\n${colors.fgGreen}Received: ${colors.reset}${block.name}\n${colors.fgRed}Expected: ${colors.reset}${testForBlock}`
        )
    }
  }

  if (action === 'activateItem') {
    bot.activateItem()
  }

  if (action === 'wait') {
    await delay(timed)
  }

  return
}
