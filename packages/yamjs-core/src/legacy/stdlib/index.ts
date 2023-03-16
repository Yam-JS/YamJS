// @ts-nocheck
type classes = any
type jiFile = any
type jiInputStream = any
type ogpContext = any
type juLinkedList = any

/** A serializable object. */
export type basic =
  | { [x in string]: basic }
  | basic[]
  | string
  | number
  | boolean
  | null
  | undefined
  | void

/** A set of listeners attached to an event. */
export type cascade = Set<
  ((event: any) => void) | { script: (event: any) => void; priority: priority }
>

/** A pending task. */
export type future = { tick: number; args: any[]; script: Function }

/** A valid event name. */
export type events = keyof classes & `${string}Event`

/** A Yam context instance. */
export type instance = {
  context: ogpContext
  hooks: { list: juLinkedList<Function>; release(): void }
  messages: juLinkedList<{ channel: string; content: string }>
  meta: string
  root: string
  tasks: { list: juLinkedList<Function>; release(): void }
  close(): void
  destroy(): void
  execute(): void
  open(): void
  tick(): void
}

/** A valid event priority. */
export type priority = 'HIGH' | 'HIGHEST' | 'LOW' | 'LOWEST' | 'MONITOR' | 'NORMAL'

/** File system utilities for a specific path. */
export type record = {
  /** Returns an array of modifiers for the contents of the folder (if any) at the current path. */
  readonly children: record[]
  /** Creates a folder at the current path if no file or folder already exists there. */
  directory(): record
  /** Creates a file at the current path if no file or folder already exists there. */
  entry(): record
  /** Whether a file or folder exists at the current path or not. */
  readonly exists: boolean
  /** Joins the current path and the given sub-path, and returns a new modifier for it. */
  file(...sub: string[]): record
  /** Starting from the current path, removes parent folders upstream until a parent folder is non-empty. */
  flush(): record
  /** The java file for the current path. */
  io: jiFile
  /** Synchronously parses the JSON content (if any) of the file at the current path. */
  json(async?: false): any
  /** Parses the JSON content (if any) of the file at the current path. */
  json(async: true): Promise<any>
  /** The name of the current path. */
  readonly name: string
  /** The current path. */
  readonly path: string
  /** The record for the parent folder of the current path. */
  readonly parent: record
  /** Synchronously returns the content (if any) of the file at the current path. */
  read(async?: false): string
  /** Returns the content (if any) of the file at the current path. */
  read(async: true): Promise<string>
  /** Removes and flushes the file or folder (if any) at the current path. */
  remove(): record
  /** Whether the current path represents a folder, a file, or none of the above. */
  readonly type: 'folder' | 'file' | 'none'
  /** Synchronously writes the given content to the file (if any) at the current path. */
  write(content: string, async?: false): record
  /** Writes the given content to the file (if any) at the current path. */
  write(content: string, async: true): Promise<record>
}

/** A web response. */
export type response = {
  /** Synchronously parses the JSON content (if any) of the response. */
  json(async?: false): any
  /** Parses the JSON content (if any) of the response. */
  json(async: true): Promise<any>
  /** Synchronously returns the content (if any) of the response. */
  read(async?: false): string
  /** Returns the content (if any) of the response. */
  read(async: true): Promise<string>
  /** Returns the response stream. */
  stream(): jiInputStream
}

if ('Yam' in globalThis) {
  Object.assign(globalThis, { Core: Yam })
} else if ('Core' in globalThis) {
  Object.assign(globalThis, { Yam: Core })
} else if ('Polyglot' in globalThis) {
  throw 'YamJS was not detected (or is very outdated) in your environment!'
} else if ('Java' in globalThis) {
  throw 'GraalJS was not detected in your environment!'
} else {
  throw 'Java was not detected in your environment!'
}

/** A session container for this module. */
export const session = {
  data: new Map<string, any>(),
  event: new Map<events, cascade>(),
  load: new Map<string, any>(),
  poly: { index: 0, list: new Map<number, future>() },
  task: { list: new Set<future>(), tick: 0 },
  type: new Map<keyof classes, any>(),
}

/** Imports the specified type from java. */
export function type<X extends keyof classes>(name: X): classes[X] {
  if (session.type.has(name)) {
    return session.type.get(name)
  } else {
    const value = Java.type(name)
    session.type.set(name, value)
    return value
  }
}

const Files = type('java.nio.file.Files')
const JavaString = type('java.lang.String')
const Paths = type('java.nio.file.Paths')
const Pattern = type('java.util.regex.Pattern')
const Scanner = type('java.util.Scanner')
const URL = type('java.net.URL')
const UUID = type('java.util.UUID')

/** A system which simplifies asynchronous cross-context code execution. */
export const desync = {
  /** Provides the result to a desync request within an auxilliary file. If this method is called while not within a desync-compatible context, it will fail. */
  async provide(provider: (data: basic) => basic | Promise<basic>) {
    try {
      const { data, uuid } = JSON.parse(context.meta)
      try {
        context.emit(uuid, JSON.stringify({ data: await provider(data), status: true }))
      } catch (error) {
        context.emit(uuid, JSON.stringify({ data: error, status: false }))
      }
    } catch (error) {
      throw "The current context's metadata is incompatible with the desync system!"
    }
  },
  /** Sends a desync request to another file. If said file has a valid desync provider, that provider will be triggered and a response will be sent back when ready. */
  async request(path: string | record | jiFile, data: basic = {}) {
    const script = file(path)
    if (script.exists) {
      const uuid = UUID.randomUUID().toString()
      const promise = context.on(uuid)
      context.create('file', file(path).io.getAbsolutePath(), JSON.stringify({ data, uuid })).open()
      const response = JSON.parse(await promise)
      if (response.status) return response.data as basic
      else throw response.data
    } else {
      throw 'That file does not exist!'
    }
  },
  /** Runs a task off the main server thread. */
  shift<X>(script: (...args: any[]) => X | Promise<X>) {
    switch (env.name) {
      case 'bukkit':
        return new Promise<X>((resolve, reject) => {
          env.content.server.getScheduler().runTaskAsynchronously(
            env.content.plugin,
            new env.content.Runnable(async () => {
              try {
                resolve(await script())
              } catch (error) {
                reject(error)
              }
            })
          )
        })
      case 'minestom':
        return new Promise<X>(async (resolve, reject) => {
          try {
            resolve(await script())
          } catch (error) {
            reject(error)
          }
        })
    }
  },
}

/** It's even more complicated. */
export function chain<
  A,
  B extends (input: A, loop: (input: A) => C) => any,
  C extends ReturnType<B>
>(input: A, handler: B): C {
  const loop = (input: A): C => {
    try {
      return handler(input, loop)
    } catch (error) {
      throw error
    }
  }
  return loop(input)
}

/** Registers a custom command to the server. */
export function command(options: {
  name: string
  message?: string
  aliases?: string[]
  execute?: (sender: any, ...args: string[]) => void
  namespace?: string
  permission?: string
  tabComplete?: (sender: any, ...args: string[]) => string[]
}) {
  switch (env.name) {
    case 'bukkit': {
      env.content.plugin.register(
        options.namespace || env.content.plugin.getName(),
        options.name,
        options.aliases || [],
        options.permission || '',
        options.message || '',
        (sender: any, label: string, args: string[]) => {
          try {
            if (!options.permission || sender.hasPermission(options.permission)) {
              options.execute && options.execute(sender, ...args)
            } else {
              sender.sendMessage(options.message || '')
            }
          } catch (error) {
            console.error(`An error occured while attempting to execute the "${label}" command!`)
            console.error(error.stack || error.message || error)
          }
        },
        (sender: any, alias: string, args: string[]) => {
          try {
            return (options.tabComplete && options.tabComplete(sender, ...args)) || []
          } catch (error) {
            console.error(
              `An error occured while attempting to tab-complete the "${alias}" command!`
            )
            console.error(error.stack || error.message || error)
            return []
          }
        }
      )
      break
    }
    case 'minestom': {
      const command = new env.content.Command(options.name)
      command.addSyntax(
        (sender, context) => {
          try {
            options.execute && options.execute(sender, ...context.getInput().split(' ').slice(1))
          } catch (error) {
            console.error(
              `An error occured while attempting to execute the "${options.name}" command!`
            )
            console.error(error.stack || error.message || error)
          }
        },
        env.content.ArgumentType.StringArray('tab-complete').setSuggestionCallback(
          (sender, context, suggestion) => {
            for (const completion of options.tabComplete(
              sender,
              ...context.getInput().split(' ').slice(1)
            ) || []) {
              suggestion.addEntry(new env.content.SuggestionEntry(completion))
            }
          }
        )
      )
      env.content.registry.register(command)
    }
  }
}

/** A simple task scheduler. */
export const task = {
  /** Cancels a previously scheduled task. */
  cancel(handle: future) {
    session.task.list.delete(handle)
  },
  /** Schedules a task to run infinitely at a set interval. */
  interval(script: Function, period = 0, ...args: any[]) {
    const future = task.timeout(
      (...args: any[]) => {
        try {
          future.tick += Math.ceil(period < 1 ? 1 : period)
          script(...args)
        } catch (err) {
          console.error('future task interval error', err)
        }
      },
      0,
      ...args
    )
    return future
  },
  /** Schedules a task to run after a set timeout. */
  timeout(script: Function, period = 0, ...args: any[]) {
    const future = {
      tick: session.task.tick + Math.ceil(period < 0 ? 0 : period),
      args,
      script: (...args) => {
        try {
          script(...args)
        } catch (err) {
          console.error('future task timeout error', err)
        }
      },
    }
    session.task.list.add(future)
    return future
  },
}

export const context = (() => {
  try {
    /* Yam v5 */
    return {
      /** Creates a new context and returns its instance. If `type` is file, `content` refers to a JS file path relative to the JS root folder. If `type` is script, `content` refers to a piece of JS code. */
      create<X extends 'file' | 'script'>(
        type: X,
        content: string,
        meta?: string
      ): { file: instance & { main: string }; script: instance & { code: string } }[X] {
        return Yam[`${type}Instance`](content, meta) as any
      },
      /** Destroys the currently running context. */
      destroy() {
        Yam.destroy()
      },
      emit(channel: string, message: string) {
        Yam.emit(channel, message)
      },
      meta: Yam.getMeta(),
      off(channel: string, listener: (data: string) => void) {
        return Yam.off(channel, listener)
      },
      on: ((channel: string, listener?: (data: string) => void) => {
        if (listener) {
          return Yam.on(channel, listener)
        } else {
          return new Promise((resolve) => {
            const dummy = (response: string) => {
              context.off(channel, dummy)
              resolve(response)
            }
            context.on(channel, dummy)
          })
        }
      }) as {
        (channel: string): Promise<string>
        (channel: string, listener: (data: string) => void)
      },
      swap() {
        push(Yam.swap)
      },
    }
  } catch (error) {
    /* Yam v4 */
    const channels = {} as { [x in string]: ((data: string) => void)[] }
    const messages = [] as { channel: string; content: string }[]

    task.interval(() => {
      for (const message of messages.splice(0, messages.length)) {
        if (message.channel in channels) {
          for (const listener of channels[message.channel]) {
            try {
              listener(message.content)
            } catch (error) {
              console.error('An error occured while attempting to listen for a message!')
              console.error(error.stack || error.message || error)
            }
          }
        }
      }
    })

    return {
      create() {
        throw 'Your current version of Yam does not support creating new contexts!'
      },
      destroy() {
        throw 'The primary instance cannot be destroyed!'
      },
      emit(channel: string, content: string) {
        messages.push({ channel, content })
      },
      meta: 'Yam',
      off(channel: string, listener: (data: string) => void) {
        if (channel in channels) {
          const list = channels[channel]
          list.includes(listener) && list.splice(list.indexOf(listener), 1)
        }
      },
      on: ((channel: string, listener?: (data: string) => void) => {
        if (listener) {
          channels[channel] || (channels[channel] = []).push(listener)
        } else {
          return new Promise((resolve) => {
            const dummy = (response: string) => {
              context.off(channel, dummy)
              resolve(response)
            }
            context.on(channel, dummy)
          })
        }
      }) as {
        (channel: string): Promise<string>
        (channel: string, listener: (data: string) => void)
      },
      swap() {
        push(Yam.swap)
      },
    }
  }
})()

/** Stores data on a per-path basis. */
export function data(path: string, ...more: string[]) {
  const name = Paths.get(path, ...more)
    .normalize()
    .toString()
  if (session.data.has(name)) {
    return session.data.get(name)
  } else {
    const value = file(root, 'data', `${name}.json`).json() || {}
    session.data.set(name, value)
    return value
  }
}

/** The environment that this module is currently running in. */
export const env = (() => {
  try {
    //@ts-expect-error
    const Bukkit: any = type('org.bukkit.Bukkit')

    /* bukkit detected */

    const manager = Bukkit.getPluginManager()
    const plugin = manager.getPlugin('YamJS')

    // TODO: This seems odd. Why would this be here, versus within the plugin?
    // I would be worried that a context being closed would cause this to be called
    // and all events to be unregistered.
    Yam.hook(() => {
      //@ts-expect-error
      type('org.bukkit.event.HandlerList').unregisterAll(plugin)
    })

    return {
      content: {
        //@ts-expect-error
        EventPriority: type('org.bukkit.event.EventPriority') as any,
        //@ts-expect-error
        instance: new (Java.extend(type('org.bukkit.event.Listener'), {}))(),
        manager,
        plugin,
        Runnable: type('java.lang.Runnable'),
        server: Bukkit.getServer(),
      },
      name: 'bukkit',
    }
  } catch (error) {
    try {
      //@ts-expect-error
      const MinecraftServer: any = type('net.minestom.server.MinecraftServer')

      /* minestom detected */

      const manager = MinecraftServer.getExtensionManager()
      const extension = manager.getExtension('Yam')

      return {
        content: {
          //@ts-expect-error
          ArgumentType: type('net.minestom.server.command.builder.arguments.ArgumentType') as any,
          //@ts-expect-error
          Command: type('net.minestom.server.command.builder.Command') as any,
          extension,
          manager,
          node: extension.getEventNode(),
          registry: MinecraftServer.getCommandManager(),
          server: MinecraftServer,
          //@ts-expect-error
          SuggestionEntry: type(
            'net.minestom.server.command.builder.suggestion.SuggestionEntry'
          ) as any,
        },
        name: 'minestom',
      }
    } catch (error) {
      return { name: 'unknown', content: {} }
    }
  }
})()

/** Attaches one or more listeners to a server event. */
export function event<X extends events>(
  name: X,
  ...listeners: (
    | ((event: InstanceType<classes[X]>) => void)
    | { script: (event: InstanceType<classes[X]>) => void; priority: priority }
  )[]
) {
  switch (env.name) {
    case 'bukkit':
      {
        let list: cascade
        if (session.event.has(name)) {
          list = session.event.get(name)
        } else {
          list = new Set()
          session.event.set(name, list)
        }
        const targets: Set<priority> = new Set()
        for (const listener of listeners) {
          if (typeof listener === 'function') {
            targets.has('HIGHEST') || targets.add('HIGHEST')
          } else {
            targets.has(listener.priority) || targets.add(listener.priority)
          }
        }
        for (const listener of list) {
          if (typeof listener === 'function') {
            targets.has('HIGHEST') && targets.delete('HIGHEST')
          } else {
            targets.has(listener.priority) && targets.delete(listener.priority)
          }
        }
        for (const target of targets) {
          const emitter = type(name)
          env.content.manager.registerEvent(
            // @ts-expect-error
            emitter.class,
            env.content.instance,
            env.content.EventPriority.valueOf(target),
            (x: any, signal: any) => {
              if (signal instanceof emitter) {
                try {
                  for (const listener of list) {
                    if (typeof listener === 'function') {
                      target === 'HIGHEST' && listener(signal)
                    } else {
                      target === listener.priority && listener.script(signal)
                    }
                  }
                } catch (error) {
                  console.error(`An error occured while attempting to handle the "${name}" event!`)
                  console.error(error.stack || error.message || error)
                }
              }
            },
            env.content.plugin
          )
        }
        for (const listener of listeners) list.has(listener) || list.add(listener)
      }
      break
    case 'minestom':
      {
        let list: cascade
        if (session.event.has(name)) {
          list = session.event.get(name)
        } else {
          list = new Set()
          session.event.set(name, list)
        }
        if (list.size === 0) {
          const emitter = type(name)
          // @ts-expect-error
          env.content.node.addListener(emitter.class, (signal: any) => {
            try {
              for (const listener of list) {
                if (typeof listener === 'function') {
                  listener(signal)
                } else {
                  listener.script(signal)
                }
              }
            } catch (error) {
              console.error(`An error occured while attempting to handle the "${name}" event!`)
              console.error(error.stack || error.message || error)
            }
          })
        }
        for (const listener of listeners) list.has(listener) || list.add(listener)
      }
      break
  }
}

/** Sends a GET request to the given URL. */
export function fetch(link: string) {
  const response: response = {
    json(async?: boolean) {
      if (async) {
        return response.read(true).then((content) => JSON.parse(content))
      } else {
        try {
          return JSON.parse(response.read())
        } catch (error) {
          throw error
        }
      }
    },
    //@ts-expect-error
    read(async?: boolean) {
      if (async) {
        return desync.request(aux, { link, operation: 'fetch.read' }) as Promise<string>
      } else {
        return new Scanner(response.stream()).useDelimiter('\\A').next()
      }
    },
    stream() {
      return new URL(link).openStream()
    },
  }
  return response
}

/** A utility wrapper for paths and files. */
export function file(path: string | record | jiFile, ...more: string[]) {
  path = typeof path === 'string' ? path : 'io' in path ? path.path : path.getPath()
  const io = Paths.get(path, ...more)
    .normalize()
    .toFile()
  const record: record = {
    get children() {
      return record.type === 'folder' ? [...io.listFiles()].map((sub) => file(sub.getPath())) : null
    },
    directory() {
      if (record.type === 'none') {
        chain(io, (io, loop) => {
          const parent = io.getParentFile()
          parent && (parent.exists() || loop(parent))
          io.mkdir()
        })
      }
      return record
    },
    entry() {
      record.type === 'none' && record.parent.directory() && io.createNewFile()
      return record
    },
    get exists() {
      return io.exists()
    },
    file(...path) {
      return file(io, ...path)
    },
    flush() {
      chain(io, (io, loop) => {
        const parent = io.getParentFile()
        parent &&
          parent.isDirectory() &&
          (parent.listFiles()[0] || (parent.delete() && loop(parent)))
      })
      return record
    },
    io,
    json(async?: boolean) {
      if (async) {
        return record.read(true).then((content) => JSON.parse(content))
      } else {
        try {
          return JSON.parse(record.read())
        } catch (error) {
          return null
        }
      }
    },
    get name() {
      return io.getName()
    },
    get parent() {
      return record.file('..')
    },
    get path() {
      return regex.replace(io.getPath(), '(\\\\)', '/')
    },
    //@ts-expect-error
    read(async?: boolean) {
      if (async) {
        return desync.request(aux, { operation: 'file.read', path: record.path }) as Promise<string>
      } else {
        return record.type === 'file'
          ? new JavaString(Files.readAllBytes(io.toPath())).toString()
          : null
      }
    },
    remove() {
      chain(io, (io, loop) => {
        io.isDirectory() && [...io.listFiles()].forEach(loop)
        io.exists() && io.delete()
      })
      return record.flush()
    },
    get type() {
      return io.isDirectory() ? 'folder' : io.exists() ? 'file' : 'none'
    },
    //@ts-expect-error
    write(content: string, async?: boolean) {
      if (async) {
        return desync
          .request(aux, { content, operation: 'file.write', path: record.path })
          .then(() => record)
      } else {
        record.type === 'file' && Files.write(io.toPath(), new JavaString(content).getBytes())
        return record
      }
    },
  }
  return record
}

/** Imports classes from external files. */
export function load(path: string | record | jiFile, name: string) {
  if (session.load.has(name)) {
    return session.load.get(name)
  } else {
    const source = file(path)
    if (source.exists) {
      const value = Yam.load(source.io, name)
      session.load.set(name, value)
      return value
    } else {
      throw new ReferenceError(`The file "${source.path}" does not exist!`)
    }
  }
}

/** Runs a script on the next tick. */
export function push(script: Function) {
  Yam.push(script)
}

/** Tools for using regex patterns. */
export const regex = {
  test(input: string, expression: string) {
    //@ts-expect-error
    return input.matches(expression)
  },
  replace(input: string, expression: string, replacement: string) {
    //@ts-expect-error
    return Pattern.compile(expression).matcher(input).replaceAll(replacement)
  },
}

/** Reloads the JS environment. */
export function reload() {
  push(Yam.reload || Yam.swap)
}

/** The root folder of the environment. */
export const root = file(Yam.getRoot())

/** Recursively removes or replaces the circular references in an object. */
export function simplify(object: any, placeholder?: any, objects?: Set<any>) {
  if (object && typeof object === 'object') {
    objects || (objects = new Set())
    if (objects.has(object)) {
      return placeholder
    } else {
      objects.add(object)
      const output = typeof object[Symbol.iterator] === 'function' ? [] : {}
      for (const key in object) output[key] = simplify(object[key], placeholder, new Set(objects))
      return output
    }
  } else {
    return object
  }
}

export function sync<X>(script: (...args: any[]) => Promise<X>): Promise<X> {
  return new Promise((resolve, reject) => {
    Yam.sync(() => script().then(resolve).catch(reject))
  })
}

Yam.hook(() => {
  for (const [name] of session.data) {
    file(root, 'data', `${name}.json`)
      .entry()
      .write(JSON.stringify(simplify(session.data.get(name))))
  }
})

const aux = `${__dirname}/async.js`
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
const promise = Promise.resolve()

Object.assign(globalThis, {
  atob(data: string) {
    var str = regex.replace(String(data), '[=]+$', '')
    if (str.length % 4 === 1) {
      throw new Error("'atob' failed: The string to be decoded is not correctly encoded.")
    }
    for (
      var bc = 0, bs, buffer, idx = 0, output = '';
      (buffer = str.charAt(idx++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = charset.indexOf(buffer)
    }
    return output
  },
  btoa(data: string) {
    var str = String(data)
    for (
      var block, charCode, idx = 0, map = charset, output = '';
      str.charAt(idx | 0) || ((map = '='), idx % 1);
      output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
    ) {
      charCode = str.charCodeAt((idx += 3 / 4))
      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        )
      }
      block = (block << 8) | charCode
    }
    return output
  },
  clearImmediate(handle?: number) {
    task.cancel(session.poly.list.get(handle))
  },
  clearInterval(handle?: number) {
    task.cancel(session.poly.list.get(handle))
  },
  clearTimeout(handle?: number) {
    task.cancel(session.poly.list.get(handle))
  },
  queueMicrotask(callback: () => void) {
    promise.then(callback).catch((error) => {
      task.timeout(() => {
        throw error
      })
    })
  },
  // setInterval(script: string | Function, period = 0, ...args: any[]) {
  //   session.poly.list.set(
  //     session.poly.index,
  //     task.interval(
  //       typeof script === 'string' ? () => Polyglot.eval('js', script) : script,
  //       Math.ceil(period / 50),
  //       ...args
  //     )
  //   )
  //   return session.poly.index++
  // },
  // setTimeout(script: string | Function, period = 0, ...args: any[]) {
  //   session.poly.list.set(
  //     session.poly.index,
  //     task.timeout(
  //       typeof script === 'string' ? () => Polyglot.eval('js', script) : script,
  //       Math.ceil(period / 50),
  //       ...args
  //     )
  //   )
  //   return session.poly.index++
  // },
  // setImmediate(script: string | Function, ...args: any[]) {
  //   // console.log('setImmediate')
  //   session.poly.list.set(
  //     session.poly.index,
  //     task.timeout(
  //       typeof script === 'string' ? () => Polyglot.eval('js', script) : script,
  //       0,
  //       ...args
  //     )
  //   )
  //   return session.poly.index++
  // },
})

// export const setImmediate = (script: string | Function, ...args: any[]) => {
//   // console.log('environment setImmediate')
//   session.poly.list.set(
//     session.poly.index,
//     task.timeout(
//       typeof script === 'string' ? () => Polyglot.eval('js', script) : script,
//       0,
//       ...args
//     )
//   )
//   return session.poly.index++
// }
