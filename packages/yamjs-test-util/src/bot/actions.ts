import { Bot } from 'mineflayer'
import { Block } from 'prismarine-block'

export const makePlaceAtBlock = (bot: Bot) => async (block: Block | null, vec: any) => {
  if (!block) return null

  try {
    await bot.placeBlock(block, vec)
  } catch (err) {
    // Do nothing; Getting a false positive.
  }

  return null
}

export const makeDigAtBlock = (bot: Bot) => async (block: Block, vec: any) => {
  try {
    await bot.dig(block, vec)
  } catch (err) {
    // Do nothing; Getting a false positive.
  }

  return null
}

export const makeActivateItem = (bot: Bot) => async () => {
  try {
    await bot.activateItem()
  } catch (err) {
    //
  }
}
