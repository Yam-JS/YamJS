import { testEngine } from './testEngine'
import { TestSetup } from './types'

export const setup = async (setup: Omit<TestSetup, 'testFn'>) => {
  if (!testEngine.state.current) throw new Error('No describe block')

  testEngine.state.current.setup = setup
}
