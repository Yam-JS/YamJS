import { lifecycle } from '@yam-js/core'
import { WebServer } from './webServer'

export const initializeWebServer = () => {
  console.log('YamJS-Dev: Starting WebServer...')
  WebServer.start()
  WebServer.listen(4000)

  WebServer.get('/reload', (req, res) => {
    res.send('done')

    lifecycle.reload()
  })

  lifecycle.on('disable', {
    name: 'WebServer',
    callback: () => {
      WebServer.stop()
    },
  })
}
