import { setupTest } from './setupTest'
import { TestEngineContext, TestSetup } from './types'

export const createTest = (
  setup: Omit<TestSetup, 'testFn'>,
  callback: TestSetup['testFn']
): TestSetup => {
  return {
    ...setup,
    testFn: async (testEngine) => {
      await setupTest(setup, testEngine)

      return callback(testEngine)
    },
  }
}
