import { readTestConfigs } from './config'
import { server } from './server/wrapper'

readTestConfigs()

export { server }
