import YamJS from '@yam-js/core'

type classes = any
type jiFile = any
type jiInputStream = any
type ogpContext = any
type juLinkedList<T> = any
type Yam = any

// @ts-expect-error
const Yam = globalThis.Yam
const Core = Yam

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

/** A pending task. */
export type future = { tick: number; args: any[]; script: Function }

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
  load: new Map<string, any>(),
  poly: { index: 0, list: new Map<number, future>() },
  task: { list: new Set<future>(), tick: 0 },
}

const Files = Java.type('java.nio.file.Files')
const JavaString = Java.type('java.lang.String')
const Paths = Java.type('java.nio.file.Paths')
const Pattern = Java.type('java.util.regex.Pattern')
const Scanner = Java.type('java.util.Scanner')
const URL = Java.type('java.net.URL')
const UUID = Java.type('java.util.UUID')

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
            // @ts-expect-error
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
      // @ts-expect-error
      env.content.plugin.register(
        options.namespace || env.content.plugin.getName(),
        options.name,
        options.aliases || [],
        options.permission || '',
        options.message || '',
        (sender: any, label: string, args: string[]) => {
          YamJS.catchAndLogUnhandledError(() => {
            if (!options.permission || sender.hasPermission(options.permission)) {
              options.execute && options.execute(sender, ...args)
            } else {
              sender.sendMessage(options.message || '')
            }
          }, `An error occured while attempting to execute the "${label}" command!`)
        },
        (sender: any, alias: string, args: string[]) => {
          return (
            YamJS.catchAndLogUnhandledError(
              () => (options.tabComplete && options.tabComplete(sender, ...args)) || [],
              `An error occured while attempting to tab-complete the "${alias}" command!`
            ) ?? []
          )
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

/**
 * A simple task scheduler.
 * @deprecated
 */
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

export const context = {
  /** Creates a new context and returns its instance. If `type` is file, `content` refers to a JS file path relative to the JS root folder. If `type` is script, `content` refers to a piece of JS code. */
  create<X extends 'file' | 'script'>(
    type: X,
    content: string,
    meta?: string
  ): { file: instance & { main: string }; script: instance & { code: string } }[X] {
    return Yam[`${type}Instance`](content, meta)
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
    return {
      content: {
        manager: YamJS.manager,
        plugin: YamJS.plugin,
        Runnable: Java.type('java.lang.Runnable'),
        server: YamJS.server,
      },
      name: 'bukkit',
    }
  } catch (error) {
    try {
      const MinecraftServer: any = Java.type('net.minestom.server.MinecraftServer')

      /* minestom detected */

      const manager = MinecraftServer.getExtensionManager()
      const extension = manager.getExtension('Yam')

      return {
        content: {
          ArgumentType: Java.type(
            'net.minestom.server.command.builder.arguments.ArgumentType'
          ) as any,
          Command: Java.type('net.minestom.server.command.builder.Command') as any,
          extension,
          manager,
          node: extension.getEventNode(),
          registry: MinecraftServer.getCommandManager(),
          server: MinecraftServer,
          SuggestionEntry: Java.type(
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
    // @ts-expect-error
    read(async?: boolean) {
      if (async) {
        return desync.request(aux, { link, operation: 'fetch.read' }) as Promise<string>
      } else {
        return new Scanner(response.stream()).useDelimiter('\\A').next()
      }
    },
    stream() {
      // @ts-expect-error
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
    read(async?: boolean) {
      if (async) {
        return desync.request(aux, { operation: 'file.read', path: record.path }) as Promise<string>
      } else {
        return record.type === 'file'
          ? // @ts-expect-error
            new JavaString(Files.readAllBytes(io.toPath())).toString()
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
        // @ts-expect-error
        record.type === 'file' && Files.write(io.toPath(), new JavaString(content).getBytes())
        return record
      }
    },
  }
  return record
}

/** Imports classes from external files.123 */
export function load<T>(path: string | record | jiFile, name: string): T {
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
    // @ts-expect-error
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
  queueMicrotask(callback: () => void) {
    promise.then(callback).catch((error) => {
      task.timeout(() => {
        throw error
      })
    })
  },
})
