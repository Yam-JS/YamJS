import { context, desync, fetch, file, push } from './index'

// @ts-expect-error
desync.provide(async (info: { content: string; operation: string; link: string; path: string }) => {
  return await desync.shift(() => {
    try {
      let output: any
      switch (info.operation) {
        case 'fetch.read':
          output = fetch(info.link).read()
          break
        case 'file.read':
          output = file(info.path).read() || ''
          break
        case 'file.write':
          file(info.path).write(info.content)
          break
      }
      push(context.destroy)
      return output
    } catch (error) {
      push(context.destroy)
      throw error
    }
  })
})
