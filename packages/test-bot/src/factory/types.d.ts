import { TestBot } from '../bot/bot'
import { TestItem } from '../factory'
import { Server } from '../server/wrapper'

type TestState = 'success' | 'failed' | 'running' | 'pending'

export interface ItemConfig {
  material?: string
  quantity?: number
}

export interface TestSetup {
  items?: ItemConfig[]
  hand?: string
  testFn: (testEngine: TestEngineContext) => Promise<boolean | void> | boolean | void
}

export interface TestItem {
  name: string
  callback: TestCallback
  state: TestState
  result?: {
    message?: string
  }
  msgs?: string[]
}

export interface TestSuite {
  name: string
  callback: TestSuiteCallback

  state: TestState

  tests?: TestItem[]
  setup?: any
  msgs?: string[]
}

export interface TestEngineState {
  suite: TestSuite[]
  current: TestSuite | undefined
}

export interface TestEngineContext {
  bot: TestBot
  server: Server
}

export type TestSuiteCallback = (ctx: TestEngineContext) => void
export type TestCallback = (ctx: TestEngineContext) => Promise<boolean | void> | boolean | void
