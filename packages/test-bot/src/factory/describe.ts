import { testEngine } from './testEngine'
import { TestSuiteCallback } from './types'

export const describe = (name: string, callback: TestSuiteCallback) => {
  testEngine.state.suite.push({ name, callback, state: 'pending' })
}
