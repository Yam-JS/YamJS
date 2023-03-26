import { lifecycle } from '@yam-js/core'

export const initializeDevReload = () => {
  const HttpServer = Java.type('com.sun.net.httpserver.HttpServer')
  const InetSocketAddress = Java.type('java.net.InetSocketAddress')

  class ApiHandler {
    constructor() {
      this.handle = this.handle.bind(this)
    }

    handle(exchange) {
      const requestMethod = exchange.getRequestMethod()
      if (requestMethod === 'GET') {
        // Send Response
        const response = 'Done' // use a JavaScript string
        exchange.sendResponseHeaders(200, response.length)
        const os = exchange.getResponseBody()
        os.write(response.split('').map((c) => c.charCodeAt(0))) // convert string to byte array
        os.close()

        // Reload
        lifecycle.reload()
      } else {
        exchange.sendResponseHeaders(405, -1) // 405 Method Not Allowed
      }
    }
  }

  const server = HttpServer.create(new InetSocketAddress(8000), 0)
  server.createContext('/reload', new ApiHandler())
  server.start()

  lifecycle.register('onDisable', {
    hook: () =>
      new Promise<void>((resolve) => {
        server.stop(0)

        // Need delay to make sure server is stopped
        setTimeout(() => {
          resolve()
        }, 10)
      }),
    name: 'yamjs-dev-reload',
  })
}
