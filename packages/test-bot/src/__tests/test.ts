// import { testEngine } from '../factory/testEngine'
// import { describe, it, expect } from '../tests'
// import { waitForEventPayload } from '../util/events/events'
// import { waitForState } from '../util/proxy'

// describe('expect', () => {
//   it('expect toBe works', () => {
//     expect(true).toBe(true)
//   })

//   it('expect toBeDefined', () => {
//     expect(true).toBeDefined()
//   })

//   it('expect toBeFalsy', () => {
//     expect(false).toBeFalsy()
//   })
// })

// describe('server lifecycle', () => {
//   it('expect YamJS to enable', async () => {
//     await testEngine.context.server.stop()
//     testEngine.context.server.start()

//     await waitForEventPayload('server/log', (payload) => {
//       return Boolean(payload.match(/\[YamJS\] Enabling YamJS/)?.[0])
//     })
//   })

//   it('expect YamJS to disable', async () => {
//     testEngine.context.server.stop()

//     await waitForEventPayload('server/log', (payload) => {
//       return Boolean(payload.match(/\[YamJS\] Disabling YamJS/)?.[0])
//     })
//   })
// })

// describe('bot lifecycle', () => {
//   it('expect bot to rejoin', async () => {
//     await testEngine.context.server.stop()
//     await testEngine.context.server.start()
//     testEngine.context.bot.start()

//     await waitForState(testEngine.context.bot.state, (state) => {
//       return state.isReady
//     })

//     expect(testEngine.context.bot.state.isReady).toBe(true)
//   })
// })
