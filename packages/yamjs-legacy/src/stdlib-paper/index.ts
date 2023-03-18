import '../js'
import * as base from '../stdlib'
export * from '../stdlib'

const addons = {
  manager: base.env.content.manager,
  plugin: base.env.content.plugin,
  server: base.env.content.server,
}

export const stdlib = Object.assign({}, base, addons)

Object.assign(globalThis, addons, { core: stdlib })

export default stdlib
