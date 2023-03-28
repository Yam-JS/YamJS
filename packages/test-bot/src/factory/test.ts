import { testEngine } from './testEngine'
import { AppTestCallback } from './types'

export const test = (name: string, callback: AppTestCallback) => {
  if (!testEngine.state.current) throw new Error('No describe block')
  if (!testEngine.state.current.tests) testEngine.state.current.tests = []

  testEngine.state.current.tests.push({ name, callback, state: 'pending' })
}

test.skip = (name: string, callback: AppTestCallback) => {
  if (!testEngine.state.current) throw new Error('No describe block')
  if (!testEngine.state.current.tests) testEngine.state.current.tests = []

  testEngine.state.current.tests.push({ name, callback, state: 'skipped' })
}
