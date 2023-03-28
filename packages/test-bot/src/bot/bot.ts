import mineflayer, { Bot, BotOptions } from 'mineflayer'
import { makeActivateItem, makeDigAtBlock, makePlaceAtBlock } from './actions'
import { AppEvents, waitForEventPayload } from '../util/events/events'
import { proxy } from 'valtio'
import { appConfig } from '../config'
import { waitForState } from '../util/proxy'
import { Server } from '../server/wrapper'

const defaultOptions: BotOptions = {
  host: 'localhost',
  port: appConfig.port,
  skipValidation: true,
  auth: 'offline',
  username: appConfig.user,
}

export type TestBot = ReturnType<typeof createTestBot>

export const createTestBot = (options: { server: Server; id: string }) => {
  const { server, id } = options
  const internal = {
    bot: undefined as undefined | Bot,
    mcData: undefined as undefined | any,
  }
  const state = proxy({
    isReady: false,
  })

  const start = () => {
    if (server.state.isReady && state.isReady) return

    const bot = mineflayer.createBot(defaultOptions)
    internal.bot = bot

    bot.on('spawn', async () => {
      state.isReady = true
      internal.mcData = (await import('minecraft-data')).default(bot.version)

      AppEvents.emit('bot/ready', id)
    })

    bot.on('chat', (username, message, type, rawMessage, matches) => {
      //
    })

    bot.on('message', (jsonString) => {
      // console.log('event:message', jsonString.json)
      // console.log(getChatMessage(jsonString))
    })

    // Log errors and kick reasons:
    bot.on('kicked', (reason, loggedIn) => {
      state.isReady = false
      AppEvents.emit('bot/not-ready', id)
    })

    bot.on('error', (err) => {
      if (err.message.includes('ECONNREFUSED')) {
        return
      }

      console.log(err)
    })

    return waitForEventPayload('bot/ready', (payload) => payload === id)
  }

  const makeFn = <Fn extends (bot: Bot) => any, ReturnFn extends ReturnType<Fn>>(
    fn: Fn
  ): ReturnFn => {
    if (!internal.bot) {
      return (() => {}) as ReturnFn
    }

    return fn(internal.bot!)
  }

  return {
    start,
    state,
    getRawBot: () => {
      if (!internal.bot) throw new Error('Bot not ready.')

      return internal.bot
    },
    activateItem: makeFn(makeActivateItem),
    digAtBlock: makeFn(makeDigAtBlock),
    placeAtBlock: makeFn(makePlaceAtBlock),
  }
}
