import { readTestConfigs } from './config/config'
import { server } from './server/wrapper'

readTestConfigs()

export { server }
