import { watch } from 'chokidar'
import got, { RequestError } from 'got'
import { paths } from './paths'
import { setupYam } from './setupYam'

const watcher = watch(`${paths.yamPlugin.path}/**/*.java`, {})

let isProcessing = false

watcher.on('change', () => {
  if (isProcessing) return
  console.log('Compiling plugin...')
  isProcessing = true

  try {
    setupYam()
  } catch (err) {
    console.log(err)
    isProcessing = false
    return
  }

  got
    .get('http://localhost:4000/reload-plugin')
    .then(() => {
      console.log('Plugin reloaded.')
      isProcessing = false
    })
    .catch((err: RequestError) => {
      if (err.code === 'ECONNREFUSED') {
        console.log('Server is not running.')
      } else {
        console.log(err)
      }

      isProcessing = false
    })
})
