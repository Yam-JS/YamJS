import http from 'http'

const context = {
  hasInitialized: false,
  isReloading: false,
}

export const reload = (): void => {
  if (!context.hasInitialized) {
    context.hasInitialized = true
    return
  }

  if (context.isReloading) return

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/reload',
    method: 'GET',
  }

  try {
    context.isReloading = true

    const req = http.request(options, (res) => {
      res.on('data', () => {
        context.isReloading = false

        console.log('Reload successful')
      })
    })
    req.on('error', () => {
      console.log('Failed to connect...')
      return setTimeout(reload, 1000)
    })

    setTimeout(() => {
      req.end()
    }, 1000)

    return
  } catch (err) {
    console.log(err)
    console.log('Failed to connect...')
    setTimeout(reload, 1000)
    return
  }
}
