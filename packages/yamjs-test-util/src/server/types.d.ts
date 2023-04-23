export interface ServerConfig {
  /**
   * If true, the server logs will be output to the console
   */
  outputLogs?: boolean

  /**
   * Path to the YamJS jar
   */
  yamJsJar?: string

  /**
   * Path to the primary JS file
   */
  js?: string

  /**
   * JS Contents
   */
  rawJs?: string
}
