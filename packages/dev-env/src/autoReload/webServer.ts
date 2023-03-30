import { load } from '@yam-js/legacy'

export class WebServer {
  static app: undefined | { listen: Function; stop: Function; get: Function } = undefined

  static start = (
    jarFile: string = 'java-express-0.0.10.jar',
    className: string = 'express.Express'
  ) => {
    if (WebServer.app) return

    const Express = load<any>(`./plugins/yamjs/${jarFile}`, className)

    if (!Express) {
      throw new Error(`Unable to load "${jarFile}" in the "plugins/yamjs" folder.`)
    }

    const app = new Express()

    app.use((req: any, res: any, next: any) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
    })

    WebServer.app = app
  }

  static stop = () => {
    if (!WebServer.app) return

    WebServer.app.stop()
  }

  static listen = (port: number) => {
    if (!WebServer.app) throw new Error('WebServer is not active.')

    return WebServer.app.listen(port)
  }

  static get = (uri: string, callback: (req: any, res: any) => any) => {
    if (!WebServer.app) throw new Error('WebServer is not active.')

    return WebServer.app.get(uri, callback)
  }
}
