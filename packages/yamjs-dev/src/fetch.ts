const HTTPRequest = Java.type('java.net.http.HttpRequest')
const HTTPClient = Java.type('java.net.http.HttpClient')
const URI = Java.type('java.net.URI')
const BodyHandlers = Java.type('java.net.http.HttpResponse.BodyHandlers')

function fetch(url: String): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = HTTPRequest.newBuilder().GET().uri(new URI(url)).build()
    const client = HTTPClient.newHttpClient()
    // @ts-expect-error
    client.sendAsync(request, BodyHandlers.ofString()).whenComplete((response, error) => {
      if (error != null) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

export { fetch }
