import { yamJsViteConfig } from '../build'

export default yamJsViteConfig({
  root: __dirname,
  name: 'yamjs-dev-reload',
  entryPoints: ['./src/webpack.ts', './src/yamjs.ts', './src/watcher.ts'],
  external: ['webpack', 'path', 'http', '@yam-js/core', 'chokidar'],
})
