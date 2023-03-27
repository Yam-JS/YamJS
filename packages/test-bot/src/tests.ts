import { test } from './factory/test'
import { describe } from './factory/describe'
import { expect } from './factory/expect'

const it = test
type Describe = typeof describe
type Test = typeof test
type Expect = typeof expect

declare global {
  const describe: Describe
  const it: Test
  const test: Test
  const expect: Expect
}

// @ts-expect-error
globalThis.describe = describe
// @ts-expect-error
globalThis.it = test
// @ts-expect-error
globalThis.test = test

export { it, describe, test, expect }
