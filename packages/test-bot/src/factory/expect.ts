export function expect<Value>(value: Value) {
  return {
    toBe: <Expected>(expected: Expected) => {
      // @ts-expect-error
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}`)
      }
    },
  }
}
