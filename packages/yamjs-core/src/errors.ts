import { mapLineToSource } from './sourceMap'

const Bukkit = Java.type('org.bukkit.Bukkit')
const MiniMessage = Java.type('net.kyori.adventure.text.minimessage.MiniMessage')

const space = '      '
const javaSourceMethodSkips = [
  'yamjs.Interop.catchError',
  'com.oracle.truffle.polyglot.PolyglotFunctionProxyHandler.invoke',
  'jdk.proxy1.$Proxy75.run',
]
const jsFileSkips = ['webpack/runtime/make']
const jsMethodSkips = ['catchAndLogUnhandledErrors']

const formatError = (error: any) => {
  const list: string[] = []

  list.push(error.name)

  for (let i = 0; i < error.stack.length; i++) {
    const item = error.stack[i]

    // JAVA
    if (item.javaFrame) {
      if (javaSourceMethodSkips.includes(`${item.source}.${item.methodName}`)) continue

      list.push(`${space}at ${item.source}.${item.methodName}(${item.fileName}:${item.line})`)
      continue
    }

    // JAVASCRIPT
    const source = mapLineToSource(item.source, item.line)

    // - SKIPS
    if (jsFileSkips.some((skip) => source.file.includes(skip))) continue
    if (jsMethodSkips.includes(item.methodName)) continue
    if (source.line === 0) continue

    let methodName = item.methodName || '<anonymous>'

    if (item.methodName === ':=>') {
      methodName = '<anonymous>'
    }

    list.push(
      `${space}at ${methodName} (${source.file}:${source.line}) [${item.source}:${item.line}]`
    )
  }

  return list.join('\n')
}

export const logError = (error: unknown, msg?: string) => {
  let jsError

  try {
    // @ts-expect-error
    const errorType = error?.getClass?.()?.getName?.() ?? undefined
    if (errorType?.includes('yamjs.JsError')) {
      jsError = error
    } else {
      // @ts-expect-error
      jsError = __interop.catchError(() => {
        throw error
      })
    }

    const errorMsg = formatError(jsError)
    msg && Bukkit.getConsoleSender().sendMessage(msg)
    Bukkit.getConsoleSender().sendMessage(
      MiniMessage.miniMessage().deserialize(`<red>${errorMsg}</red>`)
    )
  } catch (logError) {
    console.log(
      'ERROR: There was an error logging an error. Please report to YamJS. ',
      logError.name
    )
    console.log(logError.message, logError.stack)
    // @ts-expect-error
    console.log('Original error: ', error?.name)
    // @ts-expect-error
    console.log(error?.message, error?.stack)
  }
}

export const catchAndLogUnhandledError = <R>(fn: () => R, msg: string): R | undefined => {
  try {
    return fn()
  } catch (error) {
    logError(error, msg)
  }
}

export const asyncCatchAndLogUnhandledError = async <R>(
  fn: () => Promise<R>,
  msg: string
): Promise<R> | undefined => {
  try {
    return await fn()
  } catch (error) {
    logError(error, msg)
  }
}

export const createCatchAndLogUnhandledErrorHandler =
  <P extends any[], R>(fn: (...arg: P) => R, msg: string) =>
  (...args: P): R | undefined => {
    try {
      return fn(...args)
    } catch (error) {
      logError(error, msg)
    }
  }
