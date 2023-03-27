import { testEngine } from './testEngine'
import { TestCallback } from './types'

export const test = (name: string, callback: TestCallback) => {
  if (!testEngine.state.current) throw new Error('No describe block')
  if (!testEngine.state.current.tests) testEngine.state.current.tests = []

  testEngine.state.current.tests.push({ name, callback, state: 'pending' })
}
