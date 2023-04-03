import { lifecycle } from '@yam-js/core'

const HttpServer = Java.type('com.sun.net.httpserver.HttpServer')
const InetSocketAddress = Java.type('java.net.InetSocketAddress')

class ApiHandler {
  constructor() {
    this.handle = this.handle.bind(this)
  }

  // @ts-expect-error
  handle(exchange) {
    const requestMethod = exchange.getRequestMethod()
    if (requestMethod === 'GET') {
      const response = 'Done' // use a JavaScript string
      exchange.sendResponseHeaders(200, response.length)
      const os = exchange.getResponseBody()
      os.write(response.split('').map((c) => c.charCodeAt(0))) // convert string to byte array
      os.close()
      lifecycle.reload()
    } else {
      exchange.sendResponseHeaders(405, -1) // 405 Method Not Allowed
    }
  }
}

export const server = HttpServer.create(new InetSocketAddress(8000), 0)
server.createContext('/reload', new ApiHandler())
server.start()

lifecycle.on('disable', {
  callback: () =>
    new Promise<void>((resolve) => {
      server.stop(0)

      setTimeout(() => {
        resolve()
      }, 10)
    }),
  name: 'custom api',
})

console.log('API server running at http://localhost:8000/api')
