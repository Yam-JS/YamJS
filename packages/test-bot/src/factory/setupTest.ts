import { wait } from '../util/misc'
import { TestEngineContext, TestSetup } from './types'

export async function setupTest(setup: Omit<TestSetup, 'testFn'>, testEngine: TestEngineContext) {
  const { bot, server } = testEngine
  const rawBot = bot.getRawBot()

  await server.write(`op ${rawBot.username}`)

  rawBot.chat('/clearinventory')

  if (setup.items) {
    for (const item of setup.items) {
      const { material } = item

      if (material) {
        rawBot.chat(`/give ${rawBot.username} ${material} 1`)
      }
    }
  }

  await wait(250)

  if (setup.hand) {
    const item = rawBot.inventory.findInventoryItem(setup.hand, null, false)

    if (!item) throw new Error('Missing item')

    rawBot.equip(item, null)
  }
}
