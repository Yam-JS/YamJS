import YamJS, { internal } from '@yam-js/core'
import { WebServer } from './webServer'

interface AutoReloadOpts {
  /**
   * This will trigger before the reload event. This is useful for starting
   * existing services.
   */
  onStop?: () => void

  /**
   * If you don't like the default messages, you can disable them.
   */
  disableMessages?: boolean

  /**
   * If you really want this in prod...
   */
  allowProductionUse?: boolean
}

/**
 * This will initialize a webserver on port 4000 during development mode.
 * When this receives a response at `/reload`, it'll start reloading the
 * server.
 *
 * This is not recommended for production use.
 */
export function initializeAutoReload(opts?: AutoReloadOpts) {
  const { onStop, disableMessages = false, allowProductionUse = false } = opts ?? {}
  const isDev = process.env.NODE_ENV === 'development'
  const allowReload = allowProductionUse ? true : isDev

  if (allowReload) {
    try {
      console.log('YamJS-Dev: Starting WebServer...')
      WebServer.start()
      WebServer.listen(4000)

      WebServer.get('/reload', (req, res) => {
        res.send('done')

        onStop?.()

        YamJS.reload()
      })

      YamJS[internal].reloadHandler.register('WebServer', () => {
        WebServer.stop()
      })
    } catch (err) {
      console.error(err)
    }

    if (!disableMessages) console.log('YamJS-Dev: Development Mode')
  } else {
    if (!disableMessages) console.log('YamJS-Dev: Production Mode')
  }
}
