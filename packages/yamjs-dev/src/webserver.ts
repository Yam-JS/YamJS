import { lifecycle } from '@yam-js/core'

const HttpServer = Java.type('com.sun.net.httpserver.HttpServer')
const InetSocketAddress = Java.type('java.net.InetSocketAddress')
const HttpHandler = Java.type('com.sun.net.httpserver.HttpHandler')
const InputStream = Java.type('java.io.InputStream')
const InputStreamReader = Java.type('java.io.InputStreamReader')
const BufferedReader = Java.type('java.io.BufferedReader')
const OutputStream = Java.type('java.io.OutputStream')
const IOException = Java.type('java.io.IOException')

class ApiHandler {
  constructor() {
    this.handle = this.handle.bind(this)
  }

  // @ts-expect-error
  handle(exchange) {
    const requestMethod = exchange.getRequestMethod()
    if (requestMethod === 'GET') {
      const response = 'Hello, World!' // use a JavaScript string
      exchange.sendResponseHeaders(200, response.length)
      const os = exchange.getResponseBody()
      os.write(response.split('').map((c) => c.charCodeAt(0))) // convert string to byte array
      os.close()
    } else {
      exchange.sendResponseHeaders(405, -1) // 405 Method Not Allowed
    }
  }
}

export const server = HttpServer.create(new InetSocketAddress(8000), 0)
server.createContext('/api', new ApiHandler())
server.start()

lifecycle.register('onDisable', {
  hook: () => server.stop(0),
  name: 'custom api',
})

console.log('API server running at http://localhost:8000/api')
