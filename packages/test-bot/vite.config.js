import { yamJsViteConfig } from '../build'

export default yamJsViteConfig({
  root: __dirname,
  name: '@yam-js/test-util',
  external: ['@yam-js/core', 'minecraft-data', 'dotenv', 'mineflayer'],
})
