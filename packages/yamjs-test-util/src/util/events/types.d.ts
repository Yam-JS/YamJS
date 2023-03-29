interface BaseEvent {
  type: string
  timestamp: number
  payload: any
}

interface ServerLogEvent extends BaseEvent {
  type: 'server/log'
  payload: string
}

type Id = string
interface BotReadyEvent extends BaseEvent {
  type: 'bot/ready'
  payload: Id
}

interface BotNotReadyEvent extends BaseEvent {
  type: 'bot/not-ready'
  payload: Id
}

export type Events = ServerLogEvent | BotReadyEvent | BotNotReadyEvent
export type EventNames = Events['type']

type BaseEventMap<Events extends { type: string; payload: any }> = {
  [K in Events['type']]: Events extends { type: K; payload: infer P } ? P : never
}

export type EventMap = BaseEventMap<Events>
