import mineflayer, { Bot, BotOptions } from 'mineflayer'
import { makeActivateItem, makeDigAtBlock, makePlaceAtBlock } from './actions'
import { AppEvents, waitForEventPayload } from '../util/events/events'
import { proxy } from 'valtio/vanilla'
import { appConfig } from '../config'
import { waitForState } from '../util/proxy'
import { Server } from '../server/wrapper'
import { promiseObjectRace } from '../util/misc'

const defaultOptions: BotOptions = {
  host: 'localhost',
  port: appConfig.port,
  username: appConfig.user,
}

export const createBotInstance = (options: {
  server: Server['state']
  id: number
  username?: string
  onQuit?: () => void
}) => {
  const { server, id } = options
  const internal = {
    bot: undefined as undefined | Bot,
    mcData: undefined as undefined | any,
  }
  const state = proxy({
    isRunning: false,
    isReady: false,
  })

  const start = async () => {
    if (state.isReady) return
    if (!server.isReady) {
      return
    }

    if (state.isRunning) {
      const { ready } = await promiseObjectRace({
        notRunning: waitForState(state, (state) => !state.isRunning),
        ready: waitForState(state, (state) => state.isReady),
      })

      if (ready) {
        return
      }
    }

    const bot = mineflayer.createBot({
      ...defaultOptions,
      username: options.username ?? defaultOptions.username,
    })
    state.isRunning = true
    internal.bot = bot

    bot.on('spawn', async () => {
      state.isReady = true
      internal.mcData = require('minecraft-data')(bot.version)

      AppEvents.emit('bot/ready', `${id}`)
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
      // console.log('kicked', reason, loggedIn)
      state.isReady = false
      state.isRunning = false
      AppEvents.emit('bot/not-ready', `${id}`)
      options.onQuit?.()
    })

    bot.on('error', (err) => {
      if (err.message.includes('ECONNREFUSED')) {
        return
      }

      console.log(err)
    })

    return waitForEventPayload('server/log', (payload) =>
      payload.includes(`${internal.bot?.username} joined the game`)
    )
  }

  const stop = async () => {
    if (!internal.bot) return

    state.isReady = false
    internal.bot.quit()

    await waitForEventPayload('server/log', (payload) =>
      payload.includes(`${internal.bot?.username} left the game`)
    )

    state.isRunning = false
    internal.bot = undefined

    return
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
    id,
    start,
    stop,
    state,
    getRawBot: () => {
      if (!internal.bot) throw new Error('Bot not ready.')

      return internal.bot
    },
    // TODO: Fix this
    activateItem: makeFn(makeActivateItem),
    digAtBlock: makeFn(makeDigAtBlock),
    placeAtBlock: makeFn(makePlaceAtBlock),
  }
}
