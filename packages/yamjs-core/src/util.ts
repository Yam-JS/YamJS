let isVerboseLoggingEnabled = undefined as boolean | undefined
export const logVerbose = (...args: any[]) => {
  if (isVerboseLoggingEnabled === undefined) {
    isVerboseLoggingEnabled = Yam.getConfig().verbose
  }

  if (isVerboseLoggingEnabled) {
    console.log(...args)
  }
}
