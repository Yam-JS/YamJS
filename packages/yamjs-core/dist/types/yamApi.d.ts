type Queue = any
type Message = any

export class YamInstance {
  /** The underlying context associated with this instance. */
  context: any

  /* Track whether the context is active, to safely close if needed. */
  isContextActive: boolean = false

  /** The engine used for all instance contexts. */
  static readonly engine: any

  /** All registered unload hooks tied to this instance. */
  readonly hooks: Queue

  /** All queued messages created by this instance. */
  readonly messages: Message[]

  /** Metadata associated with this instance. */
  meta: string

  /** The root directory of this instance. */
  root: string

  /**
   * The tick function associated with this instance.
   */
  tickFn: () => void

  /** The close function associated with this instance. */
  onCloseFn: () => void

  /** The logger function associated with this instance. */
  loggerFn: (error: JsError) => void

  /** All queued tasks linked to this instance. */
  readonly tasks: Queue

  /** Builds a new instance from the given paths. */
  constructor(root: string, meta: string)

  /** Closes this instance's context. */
  close(): void

  /** Closes this instance and removes it from the instance registry. */
  destroy(): void

  /** Executes this instance by calling its entry point. */
  execute(): void

  /** Opens this instance's context. */
  open(): void

  /** Executes the tick loop for this instance. */
  tick(): void

  logError(error: Throwable): void

  setTickFn(fn: () => void): void
  setOnCloseFn(fn: () => void): void
  setLoggerFn(fn: (error: JsError) => void): void
}
export interface YamConfig {
  /*
   * The "main" property within the config.
   */
  main: string

  /**
   * This property determines whether or not the JavaScript initialization
   * function should be called.
   */
  initialize: boolean

  /**
   * Enables verbose logging
   */
  verbose: boolean
}

export interface YamApi {
  instance: YamInstance

  /**
   * Destroys the current instance.
   */
  destroy: () => void

  /**
   * Sends a message into the global event framework. Listeners will fire on next tick.
   *
   * @param channel The channel to send the message to.
   * @param message The message to send.
   */
  emit: (channel: string, message: string) => void

  /**
   * Creates a new file instance with the given index path.
   *
   * @param main The main index path.
   * @param meta The meta data for the instance.
   */
  fileInstance: (main: string, meta?: string) => any

  /**
   * Gets the "meta" value of the current instance.
   */
  getMeta: () => string

  /**
   * Returns the "root" of the current instance.
   */
  getRoot: () => string

  /**
   * Returns the "config".
   */
  getConfig: () => YamConfig

  /**
   * Adds an unload hook to be executed just before the instance is closed.
   *
   * @param fn The function to be executed.
   */
  hook: (fn: () => void) => void

  /**
   * Loads the given class from the given source, usually a JAR library.
   *
   * @param file The file to load the class from.
   * @param name The name of the class to load.
   */
  load: <T>(file: string, name: string) => T

  /**
   * Unregisters an event listener from the channel registry.
   *
   * @param channel The channel to unregister the listener from.
   * @param listener The listener to unregister.
   */
  off: (channel: string, listener: (message: string) => void) => void

  /**
   * Registers an event listener to the channel registry.
   *
   * @param channel The channel to register the listener to.
   * @param listener The listener to register.
   */
  on: (channel: string, listener: (message: string) => void) => void

  /**
   * Pushes a script into the tick loop to be fired upon next tick.
   *
   * @param fn The function to be pushed.
   */
  push: (fn: () => void) => void

  /**
   * Creates a new script instance with the given source code.
   *
   * @param main The main source code.
   * @param meta The meta data for the instance.
   */
  scriptInstance: (main: string, meta?: string) => any

  /**
   * Closes and re-opens the current instance. Works best when pushed into the tick loop.
   */
  swap: () => void

  /**
   * Closes all open instances, resets everything, and swaps the main instance.
   */
  reload: () => void
}
