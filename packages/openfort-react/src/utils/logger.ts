const PREFIX = '[Openfort-React]'

export const logger = {
  enabled: true,
  // biome-ignore lint/suspicious/noConsole: allowed for debugging
  log: (...args: any[]) => (logger.enabled ? console.log(PREFIX, ...args) : null),
  // biome-ignore lint/suspicious/noConsole: allowed for debugging
  error: (...args: any[]) => (logger.enabled ? console.error(PREFIX, ...args) : null),
  // biome-ignore lint/suspicious/noConsole: allowed for debugging
  warn: (...args: any[]) => (logger.enabled ? console.warn(PREFIX, ...args) : null),
}
